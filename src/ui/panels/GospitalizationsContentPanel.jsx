import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContentLabel from '../elements/ContentLabel';
import {
    getLdms, getDoctorLocationsByPositionId,
    findDoctorByPositionId, getAppointments, getLdmTypes
} from '../../components/fire_api';
import { generateTimeSlots } from '../../components/generations';
import LoadingIcon from '../elements/LoadingIcon';

const workHours = {
    startHour: 8, // Часы начала рабочего дня
    startMinute: 0, // Минуты начала рабочего дня
    endHour: 17, // Часы окончания рабочего дня
    endMinute: 0 // Минуты окончания рабочего дня
};

const workDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']; // Дни недели, в которые клиника работает



export default function GospitalizationContentPanel() {

    const [ldmTypes, setLdmTypes] = useState([]);
    const [selectedLdmType, setSelectedLdmType] = useState(null);
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [doctorLocations, setDoctorLocations] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [showTimeSlots, setShowTimeSlots] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLdmTypes = async () => {
            try {
                const typesData = await getLdmTypes();
                setLdmTypes(typesData);
            } catch (error) {
                console.error("Ошибка при получении типов ЛДМ: ", error);
            }
        };

        const fetchEvents = async () => {
            try {
                const eventsData = await getLdms();
                setEvents(eventsData);
            } catch (error) {
                console.error("Ошибка при получении мероприятий: ", error);
            }
        };

        fetchLdmTypes();
        fetchEvents();
    }, []);

    const handleLdmTypeChange = (event) => {
        const selectedTypeId = event.target.value;
        setSelectedLdmType(selectedTypeId);

        const filtered = events.filter(e => e.id_ldm_type.id === selectedTypeId);
        setFilteredEvents(filtered);

        setSelectedEvent(null);
        setDoctors([]);
        setSelectedDoctor(null);
        setDoctorLocations([]);
        setAppointments([]);
        setTimeSlots([]);
        setSelectedTimeSlot(null);
        setShowTimeSlots(true);
    };

    const handleEventChange = async (event) => {
        const selectedEventId = event.target.value;
        const eventData = filteredEvents.find(e => e.id === selectedEventId);
        setSelectedEvent(eventData);

        if (eventData) {
            try {
                const doctorsData = await findDoctorByPositionId(eventData.id_position);
                setDoctors(doctorsData);
                setSelectedDoctor(null);
                setDoctorLocations([]);
                setAppointments([]);
                setTimeSlots([]);
                setSelectedTimeSlot(null);
                setShowTimeSlots(true);
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
            setLoading(true);
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

                const slots = generateTimeSlots(filteredAppointments, selectedEvent.time, workHours, workDays);
                setTimeSlots(slots);
                setSelectedTimeSlot(null);
                setShowTimeSlots(true);
            } catch (error) {
                console.error("Ошибка при получении местоположений врачей или направлений: ", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleTimeSlotClick = (slot) => {
        setSelectedTimeSlot(slot);
        setShowTimeSlots(false);
    };

    const handleChangeTimeClick = () => {
        setShowTimeSlots(true);
        setSelectedTimeSlot(null);
    };

    const sch_generate = () => {

        if (selectedLdmType) {
            console.log("Выбранный тип мероприятия:", selectedLdmType);
        } else {
            console.log("Тип мероприятия не выбран");
        }

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

        if (selectedTimeSlot) {
            console.log("Выбранное время:", selectedTimeSlot);
        } else {
            console.log("Время не выбрано");
        }
    };

    return (
        <div>
            <ContentLabel title="Госпитализация" />

            <button onClick={() => sch_generate()}> расписание</button>

            <div>

                <select onChange={handleLdmTypeChange} value={selectedLdmType || ''}>
                    <option value="" disabled>Выберите тип мероприятия</option>
                    {ldmTypes.map(type => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </select>

                {selectedLdmType && (
                    <select onChange={handleEventChange} value={selectedEvent?.id || ''}>
                        <option value="" disabled>Выберите мероприятие</option>
                        {filteredEvents.map(event => (
                            <option key={event.id} value={event.id}>
                                {event.name}
                            </option>
                        ))}
                    </select>
                )}
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
                {selectedDoctor && (
                    <>
                        <AnimatePresence>
                            {loading && <LoadingIcon />}
                        </AnimatePresence>
                        <AnimatePresence>
                            {!loading && showTimeSlots && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                >
                                    {timeSlots.map((daySlot, index) => (
                                        <div key={index}>
                                            <h3>{daySlot.date.toDateString()}</h3>
                                            <div>
                                                {daySlot.slots.map((slot, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleTimeSlotClick(slot)}
                                                    >
                                                        {`${slot.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${slot.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {selectedTimeSlot && (
                            <div>
                                <p>Выбранное время: {selectedTimeSlot.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                <button onClick={handleChangeTimeClick}>Изменить время приема</button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
