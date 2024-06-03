import React, {useEffect, useState} from 'react';
import { useData } from '../../components/DataProvider';
import { findPatientByUserId, getPatientAppointmentsByUserId } from '../../components/fire_api';
import ContentLabel from '../elements/ContentLabel'
import './styles.css';
import PatientAppointmentsTable from '../elements/PatientAppointmentsTable';

function PatientAppointmentViewPanel() {
  const { data, setData } = useData();
  const [patientData, setPatientData] = useState([]);

  // ассинхронно получаем данные записей приема пациента
  useEffect(() => {
    async function fetchData() {
      try {

        const patient = await findPatientByUserId(data.userData.id);
        setPatientData(patient);
        // const patientAppointments = await getPatientAppointmentsByUserId(data.userData.id);
        // setPatientAppointmentsData(patientAppointments);
        // console.log(" => ", patientAppointments)
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchData();
  }, []);

  return (
    <div className='content_panel'>
      {/* <ContentLabel title="Назначенные приемы" /> */}
      
      <PatientAppointmentsTable patientId={patientData[0].id} />
    </div>
  )
}

export default PatientAppointmentViewPanel

