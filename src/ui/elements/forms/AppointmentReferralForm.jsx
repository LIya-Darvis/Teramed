import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useRealtimeData from '../../../dataProviders/useRealtimeData';
import { addAppointment, addAppointmentReferral } from '../../../api/supabaseApi';
import './styles.css';

const AppointmentReferralForm = ({ doctorId, patientId, handleAddAppointment }) => {
    const [ldmId, setLdmId] = useState('');

    console.log(doctorId.doctor_id)
    console.log(patientId)

    const ldms = useRealtimeData('get_doctor_locations_with_ldms').data;
    const appointmentsData = useRealtimeData('get_appointments').data;

    if (!ldms || !appointmentsData) return null;

    const availableLdms = ldms;

    const handleLdmChange = (e) => {
        setLdmId(e.target.value);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const appointmentData = {
            _id_ldm: ldmId,
            _id_patient: patientId,
            _id_referral_maker: doctorId.doctor_id,
            _is_confirmed: false,
        };

        console.log(appointmentData);

        try {
            const newAppointmentId = await addAppointmentReferral(appointmentData);
            console.log('New appointment ID:', newAppointmentId);
            handleAddAppointment(appointmentData);
        } catch (error) {
            console.error('Error adding appointment:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="appointment-form">
            <div className="form-group">
                <label htmlFor="ldm">Выберите мероприятие:</label>
                <select id="ldm" value={ldmId} onChange={handleLdmChange} required>
                    <option value="">Выберите мероприятие</option>
                    {availableLdms.map(ldm => (
                        <option key={ldm.ldm_id} value={ldm.ldm_id}>
                            {ldm.ldm_name}
                        </option>
                    ))}
                </select>
            </div>

            {ldmId && (
                <div className="form-buttons">
                    <button type="submit">Создать направление на прием</button>
                </div>
            )}

        </form>
    );
};

AppointmentReferralForm.propTypes = {
    doctorId: PropTypes.string.isRequired,
    patientId: PropTypes.string.isRequired,
    handleAddAppointment: PropTypes.func.isRequired,
};

const availableSlotStyle = {
    backgroundColor: '#4CAF50',
    cursor: 'pointer',
    color: '#fff',
    border: 'none',
    padding: '10px',
    margin: '5px',
    borderRadius: '4px'
};

const unavailableSlotStyle = {
    backgroundColor: '#D3D3D3',
    color: '#666',
    border: 'none',
    padding: '10px',
    margin: '5px',
    borderRadius: '4px'
};

export default AppointmentReferralForm;