import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';
import useRealtimeData from '../../../dataProviders/useRealtimeData';

function PatientAppointmentReferralsTable({ patientData }) {
    const appointmentReferralsData = useRealtimeData('get_appointment_referrals').data;
    if (!appointmentReferralsData) return null;
    
    const patientAppointmentReferrals = appointmentReferralsData.filter(referral => referral.id_patient === patientData.patient_id);
    if (!appointmentReferralsData) return null;

    return (
        <div>
            <div className='table_frame'>
                {patientAppointmentReferrals.length > 0 ? (
                    <table className='data_table'>
                        <thead>
                            <tr>
                                <th>Мероприятие</th>
                                <th>Пациент</th>
                                <th>Врач-назначивший</th>
                                <th>Подтверждено</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patientAppointmentReferrals.map(appointment => (
                                <tr key={appointment.id}>
                                    <td>{appointment.ldm_name}</td>
                                    <td>{appointment.patient_lastname} {appointment.patient_name} {appointment.patient_surname}</td>
                                    <td>{appointment.referral_maker_lastname} {appointment.referral_maker_name} {appointment.referral_maker_surname}</td>
                                    <td>{appointment.is_confirmed ? 'Да' : 'Нет'}</td>
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

export default PatientAppointmentReferralsTable;