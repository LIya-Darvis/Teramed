import React, { useState } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import './styles.css';
import AnalysisTable from '../tables/AnalysesTable';
import useRealtimeData from '../../../dataProviders/useRealtimeData';
import { AddButton, TopPanelButton } from '../components/Buttons';
import { motion, AnimatePresence } from 'framer-motion';
import AnalysisForm from '../forms/AnalysisForm';

const AnalysisModal = ({ isOpen, onRequestClose, patient, handleAddAnalysis, doctorData }) => {
    const analysesData = useRealtimeData('get_analyses').data;
    const [isAdding, setIsAdding] = useState(false);

    if (!analysesData) return null;
    if (!patient) return null;

    const filteredAnalyses = analysesData.filter(analysis => analysis.patient_id === patient);

    const handleAddClick = () => {
        setIsAdding(true);
    };

    const handleBackClick = () => {
        setIsAdding(false);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Patient Analysis"
            className="modal"
            overlayClassName="overlay"
        >
            <div className="modal-content">
                <button className="close-button" onClick={onRequestClose}>×</button>

                {/* <AnimatePresence> */}
                {isAdding ? (
                    // <motion.div
                    //     initial={{ x: '100%' }}
                    //     animate={{ x: 0 }}
                    //     exit={{ x: '100%' }}
                    //     transition={{ duration: 0.5 }}
                    //     className="form-container"
                    // >
                    <AnalysisForm
                        isOpen={isAdding}
                        onRequestClose={handleBackClick}
                        doctorId={doctorData.doctor_id}
                        patientId={patient}
                        handleAddAnalysis={handleAddAnalysis}
                    />
                    // </motion.div>
                ) : (
                    // <motion.div
                    //     initial={{ x: '-100%' }}
                    //     animate={{ x: 0 }}
                    //     exit={{ x: '-100%' }}
                    //     transition={{ duration: 0.5 }}
                    //     className="table-container"
                    // >
                    <div>
                        <h2>Анализы пациента</h2>
                        {doctorData.position_name === 'Лаборант' && !isAdding && (
                            <AddButton onClick={handleAddClick} title={"Добавить анализ"} />
                        )}
                        <AnalysisTable analysesData={filteredAnalyses} />

                    </div>

                    // </motion.div>
                )}
                {/* </AnimatePresence> */}
            </div>
        </Modal>
    );
};


AnalysisModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    patient: PropTypes.object,
    handleAddAnalysis: PropTypes.func.isRequired,
    doctorData: PropTypes.object,
};

export default AnalysisModal;