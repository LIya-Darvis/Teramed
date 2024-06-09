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

const AnalysisForm = ({ isOpen, onRequestClose, doctorId, patientId, handleAddAnalysis }) => {
    const [analysDate, setAnalysDate] = useState('');
    const [comment, setComment] = useState('');
    const [analysTypeId, setAnalysTypeId] = useState('');
    const [value, setValue] = useState('');
    const analysisTypes = useRealtimeData('get_analysis_types').data;

    if (!analysisTypes) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const analysisData = {
            analys_date: new Date(),
            comment,
            id_analys_type: analysTypeId,
            id_doctor: doctorId,
            id_patient: patientId,
            value,
        };
        // await handleAddAnalysis(analysisData);
        console.log(analysisData);
        addAnalysis(analysisData);

        onRequestClose();
    };

    return (

        <div>
            <h2>Добавить анализ</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    {/* <label>Дата анализа:</label>
                    <input
                        type="datetime-local"
                        value={analysDate}
                        onChange={(e) => setAnalysDate(e.target.value)}
                        required
                    /> */}
                </div>
                <div>
                    <label>Тип анализа:</label>
                    <select
                        value={analysTypeId}
                        onChange={(e) => setAnalysTypeId(e.target.value)}
                        required
                    >
                        <option value="">Выберите тип анализа</option>
                        {analysisTypes.map(type => (
                            <option key={type.analysis_id} value={type.analysis_id}>
                                {type.name} {type.unit} ({type.lower_limit}-{type.upper_limit})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Значение:</label>
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Комментарий:</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
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

AnalysisForm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    doctorId: PropTypes.string.isRequired,
    patientId: PropTypes.string.isRequired,
    handleAddAnalysis: PropTypes.func.isRequired,
};

export default AnalysisForm;
