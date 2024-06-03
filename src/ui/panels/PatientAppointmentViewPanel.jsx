import React, {useEffect, useState} from 'react';
import { useData } from '../../components/DataProvider';
import { getPatientAppointmentsByUserId } from '../../components/fire_api';
import ContentLabel from '../elements/ContentLabel'
import './styles.css';

function PatientAppointmentViewPanel() {
  const { data, setData } = useData();
  const [patientAppointmentsData, setPatientAppointmentsData] = useState([]);

  // ассинхронно получаем данные записей приема пациента
  useEffect(() => {
    async function fetchData() {
      try {
        const patientAppointments = await getPatientAppointmentsByUserId(data.userData.id);
        setPatientAppointmentsData(patientAppointments);
        console.log(" => ", patientAppointments)
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchData();
  }, []);

  return (
    <div className='content_panel'>
      <ContentLabel title="Назначенные приемы" />
      <div className='table_frame'>
        <table className='data_table'>
          <thead>
            <tr>
              <th>Процедура</th>
              <th>Специалист</th>
              <th>Кабинет</th>
              <th>Дата</th>
              <th>Время</th>
            </tr>
          </thead>
          <tbody>
            {patientAppointmentsData.map(patientAppointment => (
              <tr key={patientAppointment.id}>
                <td>{patientAppointment.ldm_name.name}</td>
                <td>{patientAppointment.doctor.lastname} {patientAppointment.doctor.name} {patientAppointment.doctor.surname}</td>
                <td>{patientAppointment.cabinet}</td>
                <td>{patientAppointment.ldm_date}</td>
                <td>{patientAppointment.ldm_time}</td>
                {/* <td>
                  <div className='table_buttons_frame'>
                    <EditButton onClick={() => handleEditDoctor(doctor.id)} />
                    <DeleteButton onClick={() => handleDeleteDoctor(doctor.id)} />
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PatientAppointmentViewPanel

