import React from 'react';
import Modal from 'react-modal';
import { CloseButton } from '../components/Buttons';
import './styles.css';

const PatientDetailsModal = ({ isOpen, onRequestClose, patient }) => {
    if (!patient) return null;

    console.log(patient)

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel=""
            className="modal"
            overlayClassName="overlay">
            <div className="modal-content">
            <button className="close-button" onClick={onRequestClose}>×</button>
                <h2>Детали пациента</h2>
                <div className="main-info">
                    <div className="patient-info">
                        <p><strong>Фамилия:</strong> {patient.lastname}</p>
                        <p><strong>Имя:</strong> {patient.name}</p>
                        <p><strong>Отчество:</strong> {patient.surname}</p>
                        <p><strong>Дата рождения:</strong> {patient.birthday}</p>
                        <p><strong>Телефон:</strong> {patient.phone}</p>
                        <p><strong>Email:</strong> {patient.email}</p>
                        <p><strong>Адрес:</strong> {patient.address}</p>
                    </div>
                    <div className="patient-photo">
                        {patient.patient_photo ? (
                            <img src={patient.patient_photo} alt="Фото пациента" />
                        ) : (
                            <div className="no-photo">Нет фотографии</div>
                        )}
                    </div>
                </div>
                <div className="additional-info">
                    <p><strong>Номер паспорта:</strong> {patient.passport_num}</p>
                    <p><strong>Серия паспорта:</strong> {patient.passport_series}</p>
                    <p><strong>Номер полиса:</strong> {patient.polis_num}</p>
                    <p><strong>Дата окончания полиса:</strong> {patient.polis_final_date}</p>
                </div>
            </div>
        </Modal>
    );
};

export default PatientDetailsModal;