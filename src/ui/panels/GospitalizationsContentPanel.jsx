import React, { useState, useEffect } from 'react';
import ContentLabel from '../elements/ContentLabel';
import {
    getLdms, getDoctorLocationsByPositionId,
    findDoctorByPositionId, getAppointments
} from '../../components/fire_api';
import { generateTimeSlots } from '../../components/generations';


export default function GospitalizationContentPanel() {

    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [doctorLocations, setDoctorLocations] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsData = await getLdms();
                setEvents(eventsData);
            } catch (error) {
                console.error("Ошибка при получении мероприятий: ", error);
            }
        };

        fetchEvents();
    }, []);


    const handleEventChange = async (event) => {
        const selectedEventId = event.target.value;
        const eventData = events.find(e => e.id === selectedEventId);
        setSelectedEvent(eventData);

        if (eventData) {
            try {
                const doctorsData = await findDoctorByPositionId(eventData.id_position);
                setDoctors(doctorsData);
                setSelectedDoctor(null); // Сброс выбранного врача при смене мероприятия
                setDoctorLocations([]); // Сброс местоположений врачей при смене мероприятия
                setAppointments([]); // Сброс направлений при смене мероприятия
                setTimeSlots([]);
            } catch (error) {
                console.error("Ошибка при получении врачей: ", error);
            }
        }
    };

    const handleDoctorChange = async (event) => {
        const selectedDoctorId = event.target.value;
        const doctorData = doctors.find(d => d.id === selectedDoctorId);
        setSelectedDoctor(doctorData);

        if (doctorData) {
            try {
                const doctorLocationsData = await getDoctorLocationsByPositionId(doctorData.id_position);
                setDoctorLocations(doctorLocationsData);

                const allAppointments = await getAppointments();
                const filteredAppointments = allAppointments.filter(appointment =>
                    doctorLocationsData.some(location => location.id === appointment.id_doctor_location.id) &&
                    new Date(appointment.datetime) >= new Date() &&
                    new Date(appointment.datetime) <= new Date(new Date().setDate(new Date().getDate() + 7))
                );
                setAppointments(filteredAppointments);

                const slots = generateTimeSlots(filteredAppointments, selectedEvent.time);
                setTimeSlots(slots);
            } catch (error) {
                console.error("Ошибка при получении местоположений врачей или направлений: ", error);
            }
        }
    };

    const sch_generate = () => {
        if (selectedEvent) {
            console.log("Выбранное мероприятие:", selectedEvent);
        } else {
            console.log("Мероприятие не выбрано");
        }

        if (selectedDoctor) {
            console.log("Выбранный врач:", selectedDoctor);
            console.log("Местоположения врача:", doctorLocations);
        } else {
            console.log("Врач не выбран");
        }

        console.log("Отфильтрованные направления:", appointments);
        console.log("Сгенерированные окна времени приема:", timeSlots);
    };

    return (
        <div>
            <ContentLabel title="Госпитализация" />

            <button onClick={() => sch_generate()}> расписание</button>

            <div>
                <select onChange={handleEventChange}>
                    <option value="">Выберите мероприятие</option>
                    {events.map(event => (
                        <option key={event.id} value={event.id}>
                            {event.name}
                        </option>
                    ))}
                </select>
                {selectedEvent && (
                    <select onChange={handleDoctorChange}>
                        <option value="">Выберите врача</option>
                        {doctors.map(doctor => (
                            <option key={doctor.id} value={doctor.id}>
                                {`${doctor.lastname} ${doctor.name} ${doctor.surname}`}
                            </option>
                        ))}
                    </select>
                )}
                {timeSlots.map((daySlot, index) => (
                    <div key={index}>
                        <h3>{daySlot.date.toDateString()}</h3>
                        <div>
                            {daySlot.slots.map((slot, idx) => (
                                <button key={idx}>{`${slot.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${slot.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>



        </div>
    )
}
