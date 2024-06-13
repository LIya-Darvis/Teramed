import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import './styles.css';
// import AnalysisForm from './AnalysisForm';
import PatientAppointmentForm from '../forms/PatientAppointmentForm';
import AppointmentReferralForm from '../forms/AppointmentReferralForm';

const AppointmentReferralModal = ({ isOpen, onRequestClose, doctorData, patient, handleAddAppointmentReferral }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add Appointment"
            className="modal"
            overlayClassName="overlay"
        >
            <div className="modal-content">
                <button className="close-button" onClick={onRequestClose}>×</button>
                <h2>Создание направления</h2>
                <AppointmentReferralForm 
                    doctorId={doctorData}
                    patientId={patient}
                    handleAddAppointment={handleAddAppointmentReferral}
                />
            </div>
        </Modal>
    );
};

AppointmentReferralModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    doctorData: PropTypes.object,
    patient: PropTypes.object,
    handleAddAppointment: PropTypes.func.isRequired,
};

export default AppointmentReferralModal;