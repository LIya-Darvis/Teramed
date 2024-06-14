import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import './styles.css';
import { getDepartments, getWards, getAvailableBedsByWard } from '../../../api/supabaseApi';
import { supabase } from '../../../api/supabaseClient';

const AssignHospitalBedModal = ({ isOpen, onRequestClose, referralId, plannedStartDate }) => {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [wards, setWards] = useState([]);
    const [selectedWard, setSelectedWard] = useState('');
    const [availableBeds, setAvailableBeds] = useState([]);
    const [selectedBed, setSelectedBed] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        async function fetchData() {
            // Получаем список отделений
            const { data: departmentsData, error } = await supabase
                .rpc('get_departments');

            if (error) {
                console.error('Error fetching departments:', error.message);
                return;
            }

            setDepartments(departmentsData);
        }
        fetchData();
    }, []);

    const handleDepartmentChange = async (departmentId) => {
        setSelectedDepartment(departmentId);
        const { data: wardsData, error } = await supabase
            .rpc('get_wards_by_department', { department_id: departmentId });

        if (error) {
            console.error('Error fetching wards:', error.message);
            return;
        }
        setWards(wardsData);
    };

    const handleWardChange = async (wardId) => {
        setSelectedWard(wardId);
        // Получаем список доступных мест для выбранной палаты и даты начала госпитализации
        const { data: bedsData, error } = await supabase
            .rpc('get_available_beds_by_ward', { ward_id: wardId, planned_start_date: plannedStartDate.start_date });

        if (error) {
            console.error('Error fetching available beds:', error.message);
            return;
        }

        setAvailableBeds(bedsData);
    };

    const handleBedChange = (bedId) => {
        setSelectedBed(bedId);
    };

    const handleConfirm = async () => {
        try {
            // Добавляем новую запись в таблицу госпитализаций
            const { error: gospitalizationError } = await supabase.rpc('create_gospitalization', {
                p_id_gospitalization_referral: referralId.id,
                p_id_place: selectedBed,
                p_start_date: plannedStartDate.start_date,
                p_end_date: endDate
            });

            if (gospitalizationError) {
                throw new Error(`Error creating gospitalization: ${gospitalizationError.message}`);
            }

            // Обновляем статус направления на госпитализацию
            const newStatusId = '16b74847-fa8c-45b8-a624-168dc75e115f';
            const { error: updateStatusError } = await supabase.rpc('update_referral_status', {
                referral_id: referralId.id,
                status_id: newStatusId
            });

            if (updateStatusError) {
                throw new Error(`Error updating referral status: ${updateStatusError.message}`);
            }

            onRequestClose();
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Assign Hospital Bed"
            className="modal"
            overlayClassName="overlay"
        >
            <div className="modal-content">
                <button className="close-button" onClick={onRequestClose}>×</button>
                <h2>Выберите свободное место для госпитализации</h2>
                <div>
                    <label>Отделение:</label>
                    <select value={selectedDepartment} onChange={(e) => handleDepartmentChange(e.target.value)} required>
                        <option value="">Выберите отделение</option>
                        {departments.map(department => (
                            <option key={department.id} value={department.id}>{department.name}</option>
                        ))}
                    </select>
                </div>
                {selectedDepartment && (
                    <div>
                        <label>Палата:</label>
                        <select value={selectedWard} onChange={(e) => handleWardChange(e.target.value)} required>
                            <option value="">Выберите палату</option>
                            {wards.map(ward => (
                                <option key={ward.id} value={ward.id}>{ward.num}</option>
                            ))}
                        </select>
                    </div>
                )}
                {selectedWard && (
                    <div>
                        <label>Койка:</label>
                        <select value={selectedBed} onChange={(e) => handleBedChange(e.target.value)} required>
                            <option value="">Выберите койку</option>
                            {availableBeds.map(bed => (
                                <option key={bed.place_id} value={bed.place_id}>{bed.place_num}</option>
                            ))}
                        </select>
                    </div>
                )}
                <div>
                    <label>Дата окончания:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </div>
                {selectedBed && (
                    <button onClick={handleConfirm}>Подтвердить</button>
                )}
            </div>
        </Modal>
    );
};

AssignHospitalBedModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    referralId: PropTypes.string.isRequired,
    plannedStartDate: PropTypes.string.isRequired,
};

export default AssignHospitalBedModal;