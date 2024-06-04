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
    getDoctors,
    getPositions
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

    const [specialties, setSpecialties] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);

    const [ldmTypes, setLdmTypes] = useState([]);
    const [selectedLdmType, setSelectedLdmType] = useState(null);
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [doctorLocations, setDoctorLocations] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [showTimeSlots, setShowTimeSlots] = useState(true);
    const [loading, setLoading] = useState(false);

    async function fetchSpecialties() {
        try {
            const specialtiesData = await getPositions();
            setSpecialties(specialtiesData);
        } catch (error) {
            console.error("Ошибка при получении списка специальностей: ", error);
        }
    }
    fetchSpecialties();

    const loadDoctors = async () => {
        try {
            const doctorsData = await getDoctors();
            setDoctors(doctorsData);
        } catch (error) {
            console.error("Ошибка при получении данных о врачах: ", error);
        }
    };

    const loadPatient = async () => {
        try {
            const patientsData = await findPatientByUserId(data.userData.id);
            setPatients(patientsData);
        } catch (error) {
            console.error("Ошибка при получении данных о пациенте: ", error);
        }
    };

    useEffect(() => {
        fetchSpecialties();
        loadDoctors();
        loadPatient();
    }, []);


    const handleSpecialtyChange = (event) => {
        const selectedSpecialtyId = event.target.value;
        setSelectedSpecialty(selectedSpecialtyId);
        console.log(doctors);
        console.log(selectedSpecialtyId);
        const filtered = doctors.filter(doctor => doctor.id_position.id === selectedSpecialtyId);
        setFilteredDoctors(filtered);
        setSelectedDoctor(null);
    };

    const handleDoctorChange = async (event) => {
        const selectedDoctorId = event.target.value;
        const doctorData = doctors.find(d => d.id === selectedDoctorId);
        setSelectedDoctor(doctorData);
        if (doctorData) {
            setLoading(true);
            console.log("=> ", doctorData.id_position.id)
            try {
                const doctorLocationsData = await getDoctorLocationsByPositionId(doctorData.id_position.id);
                console.log(doctorLocationsData)
                setDoctorLocations(doctorLocationsData);
                const allAppointments = await getAppointments();
                const filteredAppointments = allAppointments.filter(appointment =>
                    doctorLocationsData.some(location => location.id === appointment.id_doctor_location.id) &&
                    new Date(appointment.datetime) >= new Date() &&
                    new Date(appointment.datetime) <= new Date(new Date().setDate(new Date().getDate() + 7))
                );
                setAppointments(filteredAppointments);

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

        console.log(data.userData.id, doctorLocations, selectedTimeSlot.start)
        try {
            await uploadDataToAppointment(
                patients[0].id,
                doctorLocations[0].id,
                '123',
                selectedTimeSlot.start,
                true,
                ''
            );
            setSelectedTimeSlot(null);
            setSelectedDoctor(null);
            console.log('Запись на прием успешно добавлена.');
        } catch (error) {
            console.error('Ошибка при добавлении записи на прием:', error);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className='content_panel'>
            <ContentLabel title="Записаться на прием" />

            <select onChange={handleSpecialtyChange}>
                <option value="">Выберите специальность</option>
                {specialties.map(specialty => (
                    <option key={specialty.id} value={specialty.id}>
                        {specialty.name}
                    </option>
                ))}
            </select>

            {selectedSpecialty && (
                <select onChange={handleDoctorChange}>
                    <option value="">Выберите врача</option>
                    {filteredDoctors.map(doctor => (
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
                                                    onClick={() => slot.isAvailable && handleTimeSlotClick(slot)}
                                                    disabled={!slot.isAvailable}
                                                    style={slot.isAvailable ? availableSlotStyle : unavailableSlotStyle}
                                                >
                                                    {`${slot.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
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
                            <p>Выбранное время: {selectedTimeSlot.start.toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
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

