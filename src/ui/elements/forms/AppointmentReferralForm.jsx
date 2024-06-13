import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useRealtimeData from '../../../dataProviders/useRealtimeData';
import { addAppointment, addAppointmentReferral } from '../../../api/supabaseApi';
import './styles.css';
import { generateTimeSlots } from '../../../dataProviders/generations';

const workHours = {
    startHour: 8,
    startMinute: 0,
    endHour: 17,
    endMinute: 0
};

const workDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const AppointmentReferralForm = ({ doctorId, patientId, handleAddAppointment }) => {
    const [ldmId, setLdmId] = useState('');
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [showTimeSlots, setShowTimeSlots] = useState(true);

    console.log(doctorId.doctor_id)
    console.log(patientId)

    const ldms = useRealtimeData('get_doctor_locations_with_ldms').data;
    const appointmentsData = useRealtimeData('get_appointments').data;

    if (!ldms || !appointmentsData) return null;

    const availableLdms = ldms;

    const handleLdmChange = (e) => {
        setLdmId(e.target.value);
        setSelectedDoctorId('');
        setTimeSlots([]);
        setSelectedTimeSlot(null);
        setShowTimeSlots(true);
    };

    const handleDoctorChange = (e) => {
        const selectedDoctor = e.target.value;
        setSelectedDoctorId(selectedDoctor);

        const doctorAppointments = appointmentsData.filter(appt => appt.doctor_id === selectedDoctor);
        const slots = generateTimeSlots(doctorAppointments, 30, workHours, workDays);
        setTimeSlots(slots);
        setShowTimeSlots(true);
    };

    const handleTimeSlotSelect = (slot) => {
        setSelectedTimeSlot(slot);
        setShowTimeSlots(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const doctorLocations = ldms.filter(ldm => ldm.doctor_id === selectedDoctorId)[0];
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
                <div className="form-group">
                    <label htmlFor="doctor">Выберите врача:</label>
                    <select id="doctor" value={selectedDoctorId} onChange={handleDoctorChange} required>
                        <option value="">Выберите врача</option>
                        {ldms.filter(ldm => ldm.ldm_id === ldmId && ldm.doctor_is_available).map(ldm => (
                            <option key={ldm.doctor_id} value={ldm.doctor_id}>
                                {ldm.doctor_lastname} {ldm.doctor_name} {ldm.doctor_surname}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {showTimeSlots && timeSlots.length > 0 && (
                <div className="form-group">
                    <label>Выберите время:</label>
                    <div className="time-slots">
                        {timeSlots.map(day => (
                            <div key={day.date}>
                                <h4>{day.date.toDateString()}</h4>
                                {day.slots.map((slot, idx) => (
                                    <button
                                        key={idx}
                                        style={slot.isAvailable ? availableSlotStyle : unavailableSlotStyle}
                                        onClick={() => slot.isAvailable && handleTimeSlotSelect(slot)}
                                        disabled={!slot.isAvailable}
                                    >
                                        {slot.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedTimeSlot && !showTimeSlots && (
                <div className="form-group">
                    <h4>Вы выбрали время: {selectedTimeSlot.start.toLocaleString()}</h4>
                    
                    <div className="form-buttons">
                        <button type="button" onClick={() => setShowTimeSlots(true)}>Назад</button>
                        <button type="submit">Записаться на прием</button>
                    </div>
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