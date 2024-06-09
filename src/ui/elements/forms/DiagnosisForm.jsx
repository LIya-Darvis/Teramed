import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from 'react-modal';
import './styles.css';
import { AddButton } from '../components/Buttons';
import { supabase } from '../../../api/supabaseClient';
import { fetchData } from '../../../api/api';
import useRealtimeData from '../../../dataProviders/useRealtimeData';
import { addAnalysis } from '../../../api/supabaseApi';

const DiagnosisForm = ({ isOpen, onRequestClose, doctorData, therapistData, patientId, handleAddDiagnosis }) => {
    const diagnosesPositions = useRealtimeData('get_diagnoses_with_positions').data;
    const [recomendations, setRecomendations] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [selectedDiagnosisId, setSelectedDiagnosisId] = useState('');

    if (!diagnosesPositions) return null;
    const filteredDiagnosis = diagnosesPositions.filter(diagnos => diagnos.id_position === doctorData.position_id);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const diagnosisData = {
            diagnos_date: new Date(),
            id_diagnos: selectedDiagnosisId,
            id_doctor: doctorData.doctor_id,
            id_patient: patientId,
            is_confirmed: false,
            recomendations: recomendations,
            symptoms: symptoms,
            id_therapist: null, // позднее редактируется на запись терапевта, подтвердившего диагноз
        };
        console.log(diagnosisData);
        // addDiagnosis(diagnosisData);

        onRequestClose();
    };

    return (

        <div>
            <h2>Добавить диагноз</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Выберите диагноз:</label>
                    <select
                        value={selectedDiagnosisId}
                        onChange={(e) => setSelectedDiagnosisId(e.target.value)}
                        required
                    >
                        <option value="">Выберите диагноз</option>
                        {filteredDiagnosis.map(diagnosis => (
                            <option key={diagnosis.id} value={diagnosis.id}>{diagnosis.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Симптомы:</label>
                    <textarea
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                    />
                </div>
                <div>
                    <label>Рекомендации:</label>
                    <textarea
                        value={recomendations}
                        onChange={(e) => setRecomendations(e.target.value)}
                    />
                </div>

                <div className="form-buttons">
                    <button type="button" onClick={onRequestClose}>Назад</button>
                    <button type="submit">Подтвердить</button>
                </div>
            </form>
        </div>
    );
};

DiagnosisForm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    doctorData: PropTypes.object,
    therapistData: PropTypes.object,
    patientId: PropTypes.string.isRequired,
    handleAddDiagnosis: PropTypes.func.isRequired,
};

export default DiagnosisForm;