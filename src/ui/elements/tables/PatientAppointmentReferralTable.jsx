import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './styles.css';
import useRealtimeData from '../../../dataProviders/useRealtimeData';
import ConfirmAppointmentReferralModal from '../modals/ConfirmAppointmentReferralModal';

function PatientAppointmentReferralsTable({ patientData }) {
    const appointmentReferralsData = useRealtimeData('get_appointment_referrals').data;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    if (!appointmentReferralsData) return null;

    const patientAppointmentReferrals = appointmentReferralsData.filter(referral => referral.id_patient === patientData.patient_id && !referral.is_confirmed);
    if (!appointmentReferralsData) return null;

    // console.log(selectedAppointment)

    const handleOpenModal = (appointment) => {
        setSelectedAppointment(appointment);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedAppointment(null);
    };

    const handleAddAppointment = (appointmentData) => {
        console.log('Appointment added:', appointmentData);
        // Update the state or perform any additional actions after adding an appointment
    };

    return (
        <div>
            <div className='table_frame'>
                {patientAppointmentReferrals.length > 0 ? (
                    <table className='data_table'>
                        <thead>
                            <tr>
                                <th>Мероприятие</th>
                                <th>Пациент</th>
                                <th>Назначил</th>
                                <th>Подтверждено</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patientAppointmentReferrals.map(appointment => (
                                <tr key={appointment.id}>
                                    <td>{appointment.ldm_name}</td>
                                    <td>{appointment.patient_lastname} {appointment.patient_name} {appointment.patient_surname}</td>
                                    <td>{appointment.referral_maker_lastname} {appointment.referral_maker_name} {appointment.referral_maker_surname}</td>
                                    <td>
                                        {!appointment.is_confirmed && (
                                            <button onClick={() => handleOpenModal(appointment)}>Записаться</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Нет данных</p>
                )}
            </div>
            {selectedAppointment && (
                <ConfirmAppointmentReferralModal 
                    isOpen={isModalOpen} 
                    onClose={handleCloseModal} 
                    ldmId={selectedAppointment.id_ldm} 
                    patientId={patientData.patient_id} 
                    appointmentId={selectedAppointment.id}
                    handleAddAppointment={handleAddAppointment} 
                />
            )}
        </div>
    );
}

PatientAppointmentReferralsTable.propTypes = {
    patientData: PropTypes.shape({
        patient_id: PropTypes.string.isRequired
    }).isRequired
};

export default PatientAppointmentReferralsTable;