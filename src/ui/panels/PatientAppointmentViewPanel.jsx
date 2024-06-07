import React, {useEffect, useState} from 'react';
import { useData } from '../../dataProviders/DataProvider';
import { findPatientByUserId, getPatientAppointmentsByUserId } from '../../api/fire_api';
import ContentLabel from '../elements/components/ContentLabel'
import './styles.css';
import PatientAppointmentsTable from '../elements/tables/PatientAppointmentsTable';

function PatientAppointmentViewPanel() {
  const { data, setData } = useData();
  const [patientData, setPatientData] = useState([]);

  // ассинхронно получаем данные записей приема пациента
  useEffect(() => {
    async function fetchData() {
      try {

        const patient = await findPatientByUserId(data.userData.id);
        setPatientData(patient[0]);
        console.log(patient[0].id);   // здесь есть данные и они корректны
        // const patientAppointments = await getPatientAppointmentsByUserId(data.userData.id);
        // setPatientAppointmentsData(patientAppointments);
        // console.log(" => ", patientAppointments)
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchData();
  }, []);

  if (!patientData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='content_panel'>
      {/* <ContentLabel title="Назначенные приемы" /> */}
      
      {/* а ниже уже проблема с id */}
      <PatientAppointmentsTable patientId={patientData} />  
    </div>
  )
}

export default PatientAppointmentViewPanel

