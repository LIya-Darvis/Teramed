import React, { useEffect, useState } from 'react'
import ContentLabel from '../elements/ContentLabel'
import PatientAppointmentReferralsTable from '../elements/PatientAppointmentReferralsTable'
import { findPatientByUserId } from '../../components/fire_api';
import { useData } from '../../components/DataProvider';

function PatientAppointmentReferralsViewPanel() {
  const { data, setData } = useData();

  const [patients, setPatients] = useState([]);

  const loadPatient = async () => {
    try {
      const patientsData = await findPatientByUserId(data.userData.id);
      setPatients(patientsData);
    } catch (error) {
      console.error("Ошибка при получении данных о пациенте: ", error);
    }
  };


  useEffect(() => {
    loadPatient();
  }, []);

  return (
    <div>
      <ContentLabel title="Мои направления на прием" />

      <PatientAppointmentReferralsTable patientId={'2'}/>
    </div>
  )
}

export default PatientAppointmentReferralsViewPanel