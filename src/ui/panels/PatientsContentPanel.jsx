import React, { useState, useEffect } from 'react';
import SearchPanel from '../elements/SearchPanel';
import ContentLabel from '../elements/components/ContentLabel';
import "./styles.css";
import { useData } from '../../dataProviders/DataProvider';
import AddGospitalizationForm from '../elements/forms/AddGospitalizationForm';
import PatientsTable from '../elements/tables/PatientsTable';
import useRealtimeData from '../../dataProviders/useRealtimeData';
import PatientDetailsModal from '../elements/modals/PatientDetailsModal';
import DiagnosisModal from '../elements/modals/DiagnosisModal';
import AnalysisModal from '../elements/modals/AnalysisModal';
import GospitalizationsModal from '../elements/modals/GospitalizationsModal';
import AppointmentReferralModal from '../elements/modals/AppointmentReferralModal';


export default function PatientsContentPanel() {
    const { data, setData } = useData();
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false);
    const [gospitalizationsModalIsOpen, setGospitalizationsModalIsOpen] = useState(false);
    const [analysisModalIsOpen, setAnalysisModalIsOpen] = useState(false);
    const [diagnosisModalIsOpen, setDiagnosisModalIsOpen] = useState(false);
    const [appointmentReferralModalIsOpen, setAppointmentReferralModalIsOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const patientsData = useRealtimeData('get_patients').data;
    const doctorsData = useRealtimeData('get_doctors').data;
    const [searchQuery, setSearchQuery] = useState('');

    // Фильтрация данных на основе поискового запроса
    const filteredPatients = patientsData?.filter(patient => {
        const searchString = searchQuery.toLowerCase();
        return (
            patient.lastname.toLowerCase().includes(searchString) ||
            patient.name.toLowerCase().includes(searchString) ||
            patient.surname.toLowerCase().includes(searchString)
        );
    });

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredDoctorData = doctorsData?.filter(doctor => doctor.user_id === data.userData.id)[0];

    const handleDiagnosPatient = (patient) => {
        setSelectedPatient(patient);
        setDiagnosisModalIsOpen(true);
    };

    const handleAnalysPatient = (patient) => {
        setSelectedPatient(patient);
        setAnalysisModalIsOpen(true);
    };

    const handleAppointmentReferralPatient = (patient) => {
        setSelectedPatient(patient);
        setAppointmentReferralModalIsOpen(true);
    };

    const handleGospitalizationsPatient = (patient) => {
        setSelectedPatient(patient);
        setGospitalizationsModalIsOpen(true);
    };

    const handleOpenDetailsModal = (patient) => {
        setSelectedPatient(patient);
        setDetailsModalIsOpen(true);
    };

    const handleCloseModals = () => {
        setDetailsModalIsOpen(false);
        setAnalysisModalIsOpen(false);
        setDiagnosisModalIsOpen(false);
        setAppointmentReferralModalIsOpen(false);
        setGospitalizationsModalIsOpen(false);
        setSelectedPatient(null);
    };

    const handleAddAnalysis = async (patientId, newAnalysis) => {
        // console.log(patientId, newAnalysis);
        // await addAnalysis(patientId, newAnalysis);
        // fetchData(); // Обновляем данные после добавления нового анализа
    };

    const handleAddDiagnosis = async (patientId, newAnalysis) => {
        // console.log(patientId, newAnalysis);
        // await addAnalysis(patientId, newAnalysis);
        // fetchData(); // Обновляем данные после добавления нового анализа
    };

    const handleAddAppointmentReferral = async (patientId, newAnalysis) => {

    };

    return (
        <div className='content_panel'>
            <ContentLabel title="Пациенты" />
            <div className='func_frame'>
                <SearchPanel onChange={handleSearchChange} />
            </div>

            {patientsData ? (
                <PatientsTable patientsData={filteredPatients}
                    handleDiagnosPatient={handleDiagnosPatient}
                    handleAnalysPatient={handleAnalysPatient}
                    handleAppointmentReferralPatient={handleAppointmentReferralPatient}
                    handleOpenModal={handleOpenDetailsModal}
                    handleGospitalizationsPatient={handleGospitalizationsPatient}
                    doctorData={filteredDoctorData} />
            ) : (
                <p>Загрузка...</p>
            )}
            <PatientDetailsModal
                isOpen={detailsModalIsOpen}
                onRequestClose={handleCloseModals}
                patient={selectedPatient}
            />
            <GospitalizationsModal
                isOpen={gospitalizationsModalIsOpen}
                onRequestClose={handleCloseModals}
                patient={selectedPatient}
                doctorData={filteredDoctorData} />
            <AnalysisModal
                isOpen={analysisModalIsOpen}
                onRequestClose={handleCloseModals}
                patient={selectedPatient}
                handleAddAnalysis={handleAddAnalysis}
                doctorData={filteredDoctorData}
            />
            <AppointmentReferralModal
                isOpen={appointmentReferralModalIsOpen}
                onRequestClose={handleCloseModals}
                patient={selectedPatient}
                handleAddAppointmentReferral={handleAddAppointmentReferral}
                doctorData={filteredDoctorData}
            />
            <DiagnosisModal
                isOpen={diagnosisModalIsOpen}
                onRequestClose={handleCloseModals}
                patient={selectedPatient}
                handleAddDiagnosis={handleAddDiagnosis}
                doctorData={filteredDoctorData}
            />
        </div >
    )
};

const containerStyle = {
    maxHeight: '65vh',
    minHeight: '50vh',
    overflowY: 'scroll',
    padding: '0px 15px',
};


