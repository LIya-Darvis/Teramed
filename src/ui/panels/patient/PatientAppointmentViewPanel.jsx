import React, { useEffect, useState } from 'react';
import { useData } from '../../../dataProviders/DataProvider';
import ContentLabel from '../../elements/components/ContentLabel'
import '../styles.css';
import PatientAppointmentsTable from '../../elements/tables/PatientAppointmentsTable';
import useRealtimeData from '../../../dataProviders/useRealtimeData';
import { AddButton } from '../../elements/components/Buttons';
import AppointmentModal from '../../elements/modals/AppointmentModal';

function PatientAppointmentViewPanel() {
  const { data, setData } = useData();
  const patientsData = useRealtimeData('get_patients').data;
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!patientsData) return null;

  const filteredPatientData = patientsData?.filter(patient => patient.user_id === data.userData.id)[0];

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleAddAppointment = (appointmentData) => {
    // Update the patient data or fetch the latest data
    console.log('Appointment added:', appointmentData);
    handleModalClose();
  };

  return (
    <div className='content_panel'>
      <ContentLabel title={"Назначения пациента"} />
      <div className="top-frame">
        <AddButton onClick={handleAddClick} title={"Записаться на прием"} />

      </div>
      <PatientAppointmentsTable patientData={filteredPatientData} />
      <AppointmentModal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        doctorId={filteredPatientData.doctor_id}
        patientId={filteredPatientData.patient_id}
        handleAddAppointment={handleAddAppointment}
      />
    </div>
  )
}

export default PatientAppointmentViewPanel

