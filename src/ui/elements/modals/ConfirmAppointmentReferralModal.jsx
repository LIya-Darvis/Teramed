import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import './styles.css';
import ConfirmAppointmentReferralForm from '../forms/ConfirmAppointmentReferralForm';

const ConfirmAppointmentReferralModal = ({ isOpen, onClose, ldmId, patientId, appointmentId, handleAddAppointment }) => {

    // console.log(ldmId)
    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Patient Analysis"
            className="modal"
            overlayClassName="overlay">

            <div className="modal-content">
                <button className="close-button" onClick={onClose}>×</button>
                
                <ConfirmAppointmentReferralForm 
                    ldmId={ldmId} 
                    patientId={patientId} 
                    appointmentId={appointmentId}
                    handleAddAppointment={handleAddAppointment} 
                    onClose={onClose} 
                />
                
            </div>


        </Modal>
    );
};

ConfirmAppointmentReferralModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    ldmId: PropTypes.string.isRequired,
    patientId: PropTypes.string.isRequired,
    appointmentId: PropTypes.string.isRequired,
    handleAddAppointment: PropTypes.func.isRequired,
};

export default ConfirmAppointmentReferralModal;