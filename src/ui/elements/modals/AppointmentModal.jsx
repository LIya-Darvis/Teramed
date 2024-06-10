import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import './styles.css';
// import AnalysisForm from './AnalysisForm';
import PatientAppointmentForm from '../forms/PatientAppointmentForm';

const AppointmentModal = ({ isOpen, onRequestClose, doctorId, patientId, handleAddAppointment }) => {
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
                <h2>Записаться на прием</h2>
                <PatientAppointmentForm
                    doctorId={doctorId}
                    patientId={patientId}
                    handleAddAppointment={handleAddAppointment}
                />
            </div>
        </Modal>
    );
};

AppointmentModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    doctorId: PropTypes.string.isRequired,
    patientId: PropTypes.string.isRequired,
    handleAddAppointment: PropTypes.func.isRequired,
};

export default AppointmentModal;