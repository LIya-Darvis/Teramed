import React, { useEffect, useState } from 'react'
import ContentLabel from '../elements/components/ContentLabel'
import PatientAppointmentReferralsTable from '../elements/tables/PatientAppointmentReferralsTable'
import { findPatientByUserId } from '../../api/fire_api';
import { useData } from '../../dataProviders/DataProvider';

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
      <PatientAppointmentReferralsTable patientId={patients[0]}/>
    </div>
  )
}

export default PatientAppointmentReferralsViewPanel





