import React, { useState } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import './styles.css';
import useRealtimeData from '../../../dataProviders/useRealtimeData';
import AddGospitalizationForm from '../forms/AddGospitalizationForm';

const GospitalizationsModal = ({ isOpen, onRequestClose, patient, doctorData, handleAddGospitalizations }) => {
    const gospitalizationsData = useRealtimeData('get_gospitalizations').data;
    if (!gospitalizationsData) return null;
    if (!patient) return null;

    console.log(doctorData.doctor_id)

    const today = new Date();

    const filteredGospitalizations = gospitalizationsData.filter(gospitalization => {    
        return gospitalization.patient_id === patient;
    });

    console.log(filteredGospitalizations)

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
                <h2>Госпитализировать пациента</h2>
                <AddGospitalizationForm
                    onRequestClose={onRequestClose}
                    patientId={patient}
                    terapevtId={doctorData.doctor_id}
                />
            </div>
        </Modal>
    );
};


GospitalizationsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    patient: PropTypes.object,
    doctorData: PropTypes.object,
    handleAddGospitalizations: PropTypes.func.isRequired
};

export default GospitalizationsModal;