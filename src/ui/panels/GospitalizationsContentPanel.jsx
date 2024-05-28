import React, { useState, useEffect } from 'react';
import ContentLabel from '../elements/ContentLabel';
import { generateSchedule, getAvailableSlots } from '../../components/generations';
import { events, doctors, existingAppointments, workingHours } from '../../components/data';

export default function GospitalizationContentPanel() {

    const [selectedEvent, setSelectedEvent] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [schedule, setSchedule] = useState(() => generateSchedule(doctors, events, existingAppointments));

    const handleEventChange = (event) => {
        setSelectedEvent(event.target.value);
        setSelectedDoctor('');
        setAvailableSlots([]);
        setSelectedSlot('');
    };

    const handleDoctorChange = (event) => {
        const doctorId = event.target.value;
        setSelectedDoctor(doctorId);
        const duration = events.find(e => e.name === selectedEvent).duration;
        const doctor = doctors.find(d => d.id === parseInt(doctorId));

        const newSlots = getAvailableSlots(doctor.room, duration, existingAppointments, workingHours);
        setAvailableSlots(newSlots);
    };

    const handleSlotChange = (event) => {
        setSelectedSlot(event.target.value);
    };

    const handleAddAppointment = () => {
        const duration = events.find(e => e.name === selectedEvent).duration;
        const doctor = doctors.find(d => d.id === parseInt(selectedDoctor));
        const newAppointment = {
            doctorId: doctor.id,
            room: doctor.room,
            event: selectedEvent,
            start: selectedSlot,
            end: formatTime(parseTime(selectedSlot) + duration)
        };

        existingAppointments.push(newAppointment);
        const newSchedule = generateSchedule(doctors, events, existingAppointments);
        setSchedule(newSchedule);
    };

    // вспомогательные функции парсинга и форматирования времени
    const parseTime = timeStr => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };
    const formatTime = minutes => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };


    const sch_generate = () => {
        console.log(schedule);
        console.log(existingAppointments);
    };

    return (
        <div>
            <ContentLabel title="Госпитализация" />

            <button onClick={() => sch_generate()}> расписание</button>

            <div>
                <label>Мероприятие: </label>
                <select value={selectedEvent} onChange={handleEventChange}>
                    <option value="">Выберите мероприятие</option>
                    {events.map(event => (
                        <option key={event.name} value={event.name}>
                            {event.name}
                        </option>
                    ))}
                </select>
            </div>
            {selectedEvent && (
                <div>
                    <label>Врач: </label>
                    <select value={selectedDoctor} onChange={handleDoctorChange}>
                        <option value="">Выберите врача</option>
                        {doctors.filter(doctor => !doctor.available && doctor.specialties.includes(selectedEvent)).map(doctor => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {selectedDoctor && (
                <div>
                    <label>Временное окно: </label>
                    <select value={selectedSlot} onChange={handleSlotChange}>
                        <option value="">Выберите временное окно</option>
                        {availableSlots.map(slot => (
                            <option key={slot} value={slot}>
                                {slot}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {selectedSlot && (
                <button onClick={handleAddAppointment}>Добавить направление</button>
            )}
        </div>
    )
}
