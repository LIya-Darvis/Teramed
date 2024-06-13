import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useRealtimeData from '../../../dataProviders/useRealtimeData';
import { addAppointment, confirmAppointmentReferral } from '../../../api/supabaseApi';
import './styles.css';
import { generateTimeSlots } from '../../../dataProviders/generations';

const workHours = {
    startHour: 8,
    startMinute: 0,
    endHour: 17,
    endMinute: 0
};

const workDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const ConfirmAppointmentReferralForm = ({ ldmId, patientId, appointmentId, handleAddAppointment, onClose }) => {
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [showTimeSlots, setShowTimeSlots] = useState(true);

    const ldms = useRealtimeData('get_doctor_locations_with_ldms').data;
    const appointmentsData = useRealtimeData('get_appointments').data;

    if (!ldms || !appointmentsData) return null;

    const handleDoctorChange = (e) => {
        const selectedDoctor = e.target.value;
        setSelectedDoctorId(selectedDoctor);
        console.log(appointmentsData)

        const doctorAppointments = appointmentsData.filter(appt => appt.doctor_id === selectedDoctor);
        console.log(doctorAppointments)
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
            id_doctor_location: doctorLocations.doctor_location_id,
            id_ldm: ldmId,
            id_patient: patientId,
            complaints: "",
            ldm_datetime: selectedTimeSlot.start,
            is_confirmed: false
        };

        try {
            const newAppointmentId = await addAppointment(appointmentData);
            console.log('New appointment ID:', newAppointmentId);
            await confirmAppointmentReferral(appointmentId); // Вызов хранимой процедуры
            handleAddAppointment(appointmentData);
            onClose(); // Закрытие модального окна после отправки
        } catch (error) {
            console.error('Error adding appointment:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Врач:</label>
                <select value={selectedDoctorId} onChange={handleDoctorChange} required>
                    <option value="">Выберите врача</option>
                    {ldms.filter(ldm => ldm.ldm_id === ldmId && ldm.doctor_is_available).map(ldm => (
                        <option key={ldm.doctor_id} value={ldm.doctor_id}>
                            {ldm.doctor_lastname} {ldm.doctor_name} {ldm.doctor_surname}
                        </option>
                    ))}
                </select>
            </div>

            {showTimeSlots && timeSlots.length > 0 && (
                <div>
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
                <div>
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

ConfirmAppointmentReferralForm.propTypes = {
    ldmId: PropTypes.string.isRequired,
    patientId: PropTypes.string.isRequired,
    appointmentId: PropTypes.string.isRequired,
    handleAddAppointment: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
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

export default ConfirmAppointmentReferralForm;