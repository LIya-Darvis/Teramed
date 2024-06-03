import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../components/DataProvider';
import ContentLabel from '../elements/ContentLabel';
import LoadingIcon from '../elements/LoadingIcon';
import { ConfirmButton, CloseButton, DeleteButton } from '../elements/Buttons';
import {
    getLdms, findPatientByUserId, getDoctorLocationsByPositionId,
    uploadDataToAppointment,
    getAppointments,
    getDoctors
} from '../../components/fire_api';
import LdmCard from '../elements/LdmCard';
import { TimeCard } from '../elements/TimeCard';
import ModalPanel from '../elements/ModalPanel';
import './styles.css';

import { generateTimeSlots, getAppointmentTimePeriods } from '../../components/generations';



const workHours = {
    startHour: 8, // Часы начала рабочего дня
    startMinute: 0, // Минуты начала рабочего дня
    endHour: 17, // Часы окончания рабочего дня
    endMinute: 0 // Минуты окончания рабочего дня
};

const workDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']; // Дни недели, в которые клиника работает



function PatientAppointmentMakePanel() {
    const { data, setData } = useData();

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

    const loadDoctors = async () => {
        try {
            const doctorsData = await getDoctors();
            console.log('Loaded doctors data:', doctorsData); // Логирование данных врачей для отладки
            setDoctors(doctorsData);
        } catch (error) {
            console.error("Ошибка при получении данных о врачах: ", error);
        }
    };

    const loadPatient = async () => {
        try {
            const doctorsData = await findPatientByUserId();
            console.log('Loaded doctors data:', doctorsData); // Логирование данных врачей для отладки
            setDoctors(doctorsData);
        } catch (error) {
            console.error("Ошибка при получении данных о врачах: ", error);
        }
    };

    useEffect(() => {
        loadDoctors(); // Загрузка данных о врачах при монтировании компонента
        loadPatient();
    }, []);


    const handleDoctorChange = async (event) => {
        const selectedDoctorId = event.target.value;
        const doctorData = doctors.find(d => d.id === selectedDoctorId);
        setSelectedDoctor(doctorData);
        if (doctorData) {
            setLoading(true);
            console.log(doctorData.id_position.id)
            try {
                const doctorLocationsData = await getDoctorLocationsByPositionId(doctorData.id_position.id);
                setDoctorLocations(doctorLocationsData);
                const allAppointments = await getAppointments();
                const filteredAppointments = allAppointments.filter(appointment =>                    
                    doctorLocationsData.some(location => location.id === appointment.id_doctor_location.id) &&
                    new Date(appointment.datetime) >= new Date() &&
                    new Date(appointment.datetime) <= new Date(new Date().setDate(new Date().getDate() + 7))
                );
                setAppointments(filteredAppointments);

                // console.log(filteredAppointments)

                const slots = generateTimeSlots(filteredAppointments, 15, workHours, workDays);
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

    const handleBookAppointment = async () => {
        if (!selectedDoctor || !selectedTimeSlot) {
            alert('Пожалуйста, выберите врача и время приема.');
            return;
        }
        setLoading(true);

        console.log(data.userData.id, doctorLocations.id, selectedTimeSlot.start)
        try {
            // await uploadDataToAppointment(
            //     data.userData.id, // ID пациента (предполагается, что он хранится в data)
            //     doctorLocations.id,
            //     123,
            //     selectedTimeSlot.start,
            //     true,
            //     ''
            // );
            console.log('Запись на прием успешно добавлена.');
        } catch (error) {
            console.error('Ошибка при добавлении записи на прием:', error);
            console.log('Произошла ошибка при добавлении записи на прием.');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className='content_panel'>
            <ContentLabel title="Записаться на прием" />


            <select onChange={handleDoctorChange}>
                <option value="">Выберите врача</option>
                {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                        {`${doctor.lastname} ${doctor.name} ${doctor.surname} (${doctor.position.name})`}
                    </option>
                ))}
            </select>

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
                            <button style={form_button} onClick={handleBookAppointment}>Записаться</button>
                        </div>
                    )}
                </>
            )}

        </div>
    )
}

export default PatientAppointmentMakePanel

const form_button = {
    margin: '20px 0px',
    padding: '10px',
    backgroundColor: '#4B5672',
    color: '#fff',
    borderRadius: '4px'
}

const dop_button = {
    margin: '20px 0px',
    padding: '10px',
    backgroundColor: '#fff',
    color: '#4B5672',
    borderRadius: '4px'
}

