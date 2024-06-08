import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import './styles.css';
import useRealtimeData from '../../../dataProviders/useRealtimeData';
import DiagnosesTable from '../tables/DiagnosesTable';

const DiagnosisModal = ({ isOpen, onRequestClose, patient, handleAddDiagnosis }) => {
    const diagnosesData = useRealtimeData('get_sick_histories').data;
    if (!patient) return null;
    if (!diagnosesData) return null;

    const filteredDiagnoses = diagnosesData.filter(diagnosis => diagnosis.patient_id === patient);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Patient Diagnosis"
            className="modal"
            overlayClassName="overlay"
        >
            <div className="modal-content">
                <button className="close-button" onClick={onRequestClose}>×</button>
                <h2>Диагнозы пациента</h2>
                <DiagnosesTable diagnosesData={filteredDiagnoses} />
            </div>
        </Modal>
    );
};

DiagnosisModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    patient: PropTypes.object,
    handleAddDiagnosis: PropTypes.func.isRequired
};

export default DiagnosisModal;