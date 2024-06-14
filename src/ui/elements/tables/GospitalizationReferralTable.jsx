import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './styles.css';
import useRealtimeData from '../../../dataProviders/useRealtimeData';
import { useData } from '../../../dataProviders/DataProvider';
import { fetchData } from '../../../api/api';
import AssignHospitalBedModal from '../modals/AssignHospitalBedModal';

const GospitalizationReferralTable = ({ patientId = null }) => {
    const { data, setData } = useData();
    const userRole = data.userData.role;
    const initialData = useRealtimeData('get_gospitalization_referrals').data;
    const [referralsData, setReferralsData] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedReferral, setSelectedReferral] = useState(null);

    useEffect(() => {
        if (initialData) {
            if (patientId) {
                setReferralsData(initialData.filter(referral => referral.id_patient === patientId));
            } else {
                setReferralsData(initialData);
            }
        }
    }, [initialData, patientId]);

    // Функция для обработки нажатия на кнопку "Подтвердить"
    const handleAssignClick = (referral) => {
        console.log(referral)
        setSelectedReferral(referral); // Устанавливаем выбранное направление на госпитализацию
        setIsAssignModalOpen(true); // Открываем модальное окно
    };

    return (
        <div className='table_frame'>
            {referralsData.length > 0 ? (
                <table className='data_table'>
                    <thead>
                        <tr>
                            <th>Дата создания</th>
                            <th>Пациент</th>
                            <th>Статус</th>
                            <th>Терапевт</th>
                            <th>Причина</th>
                            <th>Дата начала</th>
                            <th>Действия</th> {/* Добавляем заголовок для кнопок действий */}
                        </tr>
                    </thead>
                    <tbody>
                        {referralsData.map((referral) => (
                            <tr key={referral.id}>
                                <td>{new Date(referral.creation_date).toLocaleDateString()}</td>
                                <td>{referral.patient_lastname} {referral.patient_name} {referral.patient_surname}</td>
                                <td>{referral.status_name}</td>
                                <td>{referral.terapevt_lastname} {referral.terapevt_name} {referral.terapevt_surname}</td>
                                <td>{referral.reason}</td>
                                <td>{new Date(referral.start_date).toLocaleDateString()}</td>
                                <td>
                                {referral.status_name !== "Подтверждено" && (
                                        <button onClick={() => handleAssignClick(referral)}>Подтвердить</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Нет данных</p>
            )}

            {/* Модальное окно для назначения места госпитализации */}
            <AssignHospitalBedModal
                isOpen={isAssignModalOpen}
                onRequestClose={() => setIsAssignModalOpen(false)}
                referralId={selectedReferral}
                plannedStartDate={selectedReferral} // Передаем выбранное направление на госпитализацию в модальное окно
            />
        </div>
    );
};

GospitalizationReferralTable.propTypes = {
    patientId: PropTypes.string,
    userData: PropTypes.shape({
        role: PropTypes.string.isRequired
    }).isRequired,
};

export default GospitalizationReferralTable;