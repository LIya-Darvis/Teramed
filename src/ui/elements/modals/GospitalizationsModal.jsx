import React, { useState } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import './styles.css';
import useRealtimeData from '../../../dataProviders/useRealtimeData';

const GospitalizationsModal = ({ isOpen, onRequestClose, patient, handleAddGospitalizations }) => {
    // const analysesData = useRealtimeData('get_analyses').data;
    // if (!analysesData) return null;
    if (!patient) return null;

    // const filteredAnalyses = analysesData.filter(analysis => analysis.patient_id === patient);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Patient Gospitalizations"
            className="modal"
            overlayClassName="overlay"
        >
            <div className="modal-content">
                <button className="close-button" onClick={onRequestClose}>×</button>
                <h2>Госпитализации пациента</h2>
                
            </div>
        </Modal>
    );
};


GospitalizationsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    patient: PropTypes.object,
    handleAddGospitalizations: PropTypes.func.isRequired
};

export default GospitalizationsModal;