import React, { useState } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import './styles.css';
import AnalysisTable from '../tables/AnalysesTable';
import useRealtimeData from '../../../dataProviders/useRealtimeData';

const AnalysisModal = ({ isOpen, onRequestClose, patient, handleAddAnalysis }) => {
    const analysesData = useRealtimeData('get_analyses').data;
    if (!analysesData) return null;
    if (!patient) return null;

    const filteredAnalyses = analysesData.filter(analysis => analysis.patient_id === patient);

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
                <h2>Анализы пациента</h2>
                <AnalysisTable analysesData={filteredAnalyses}/>
            </div>
        </Modal>
    );
};


AnalysisModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    patient: PropTypes.object,
    handleAddAnalysis: PropTypes.func.isRequired
};

export default AnalysisModal;