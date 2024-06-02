import React, { useState, useEffect } from 'react';
import { getFilteredAppointmentsByPatientId } from "../../components/fire_api";

function PatientAppointmentsTable({ patientId }) {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        async function fetchAppointments() {
            const data = await getFilteredAppointmentsByPatientId(patientId);
            console.log(data)
            setAppointments(data);
        }

        fetchAppointments();
    }, [patientId]);

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        margin: '16px 0',
        fontSize: '16px',
    };

    const thTdStyle = {
        border: '1px solid #ddd',
        padding: '8px',
        textAlign: 'left',
    };

    const thStyle = {
        ...thTdStyle,
        backgroundColor: '#f2f2f2',
    };

    return (
        <div>
            <h2>Назначения пациента</h2>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Дата и время</th>
                        <th style={thStyle}>Врач</th>
                        <th style={thStyle}>Кабинет</th>
                        <th style={thStyle}>ЛДМ</th>
                        <th style={thStyle}>Жалобы</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.length > 0 ? (
                        appointments.map((appointment) => (
                            <tr key={appointment.id}>
                                <td style={thTdStyle}>{new Date(appointment.datetime).toLocaleString()}</td>
                                <td style={thTdStyle}>{`${appointment.doctor.lastname} ${appointment.doctor.name} ${appointment.doctor.surname}`}</td>
                                <td style={thTdStyle}>{appointment.room.num}</td>
                                <td style={thTdStyle}>{appointment.event.name}</td>
                                <td style={thTdStyle}>{appointment.complaints}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td style={thTdStyle} colSpan="5">Нет назначений для данного пациента.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default PatientAppointmentsTable;