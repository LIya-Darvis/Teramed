import React, { useState } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import './styles.css';
import useRealtimeData from '../../../dataProviders/useRealtimeData';
import DiagnosesTable from '../tables/DiagnosesTable';
import { AddButton } from '../components/Buttons';
import DiagnosisForm from '../forms/DiagnosisForm';
import { getSickHistories } from '../../../api/supabaseApi';

const DiagnosisModal = ({ isOpen, onRequestClose, patient, handleAddDiagnosis, doctorData }) => {
    const diagnosesData = useRealtimeData('get_sick_histories').data;
    // const diagnosesData = getSickHistories();
    const [isAdding, setIsAdding] = useState(false);

    console.log(patient)
    console.log(diagnosesData)

    if (!patient) return null;
    if (!diagnosesData) return null;

    const filteredDiagnoses = diagnosesData.filter(diagnosis => diagnosis.patient_id === patient);
    

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
            contentLabel="Patient Diagnosis"
            className="modal"
            overlayClassName="overlay"
        >
            <div className="modal-content">
                <button className="close-button" onClick={onRequestClose}>×</button>
                {isAdding ? (
                    <DiagnosisForm
                        isOpen={isAdding}
                        onRequestClose={handleBackClick}
                        doctorData={doctorData}
                        patientId={patient}
                        handleAddDiagnosis={handleAddDiagnosis}
                    />
                ) : (
                    <div>
                        <h2>Диагнозы пациента</h2>
                        {doctorData.position_name != 'Лаборант' && !isAdding && (
                            <AddButton onClick={handleAddClick} title={"Добавить диагноз"} />
                        )}
                        <DiagnosesTable diagnosesData={filteredDiagnoses} />
                    </div>
                )}

            </div>
        </Modal>
    );
};

DiagnosisModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    patient: PropTypes.object,
    handleAddDiagnosis: PropTypes.func.isRequired,
    doctorData: PropTypes.object,
};

export default DiagnosisModal;