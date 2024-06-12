import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './styles.css';
import useRealtimeData from '../../../dataProviders/useRealtimeData';

function PatientAppointmentsTable({ patientData }) {
    const appointmentsData = useRealtimeData('get_appointments').data;

    if (!appointmentsData) return null;

    const today = new Date();

    const filteredAppointmentsData = appointmentsData
        ?.filter(appointment => {
            const appointmentDate = new Date(appointment.ldm_datetime);
            return appointment.id_patient === patientData.patient_id && appointmentDate >= today;
        })
        .sort((a, b) => new Date(a.ldm_datetime) - new Date(b.ldm_datetime));
    // console.log(filteredAppointmentsData)

    return (
        <div>
            <div className='table_frame'>
                {filteredAppointmentsData.length > 0 ? (
                    <table className='data_table'>
                        <thead>
                            <tr>
                                {/* <th>Пациент</th> */}
                                <th>Врач</th>
                                <th>Мероприятие</th>
                                <th>Кабинет</th>
                                <th>Дата и время</th>
                                {/* <th>Жалобы</th>
                                <th>Подтверждено</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointmentsData.map(appointment => (
                                <tr key={appointment.id}>
                                    {/* <td>{appointment.patient_lastname} {appointment.patient_name} {appointment.patient_surname}</td> */}
                                    <td>{appointment.doctor_lastname} {appointment.doctor_name} {appointment.doctor_surname}</td>
                                    <td>{appointment.ldm_name}</td>
                                    <td>{appointment.cabinet_num}</td>
                                    <td>{new Date(appointment.ldm_datetime).toLocaleString()}</td>
                                    {/* <td>{appointment.complaints}</td>
                                    <td>{appointment.is_confirmed ? 'Да' : 'Нет'}</td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Нет данных</p>
                )}
            </div>
        </div>
    );
}

PatientAppointmentsTable.propTypes = {
    patientsData: PropTypes.array.isRequired,
};

export default PatientAppointmentsTable;