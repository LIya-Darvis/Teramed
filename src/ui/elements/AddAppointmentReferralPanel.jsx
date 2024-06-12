import React, { useState, useEffect } from 'react'
import { addAppointmentReferral } from '../../api/fire_api';
import {
    getLdms, getDoctorLocationsByPositionId,
    findDoctorByPositionId, getAppointments, getLdmTypes
} from '../../api/fire_api';
import { DropdownList, DropdownListDoctors } from './components/DropdownLists';


function AddAppointmentReferralPanel({ id_patient, id_referral_maker, onSubmit }) {
    const [idPatient, setIdPatient] = useState(id_patient);
    const [idReferralMaker, setIdReferralMaker] = useState(id_referral_maker);

    const [ldmTypes, setLdmTypes] = useState([]);
    const [selectedLdmType, setSelectedLdmType] = useState(null);
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [doctorLocations, setDoctorLocations] = useState([]);
    const [appointments, setAppointments] = useState([]);
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

            } catch (error) {
                console.error("Ошибка при получении местоположений врачей или направлений: ", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addAppointmentReferral(doctorLocations[0].id, selectedEvent.id, idPatient, idReferralMaker);

        setDoctorLocations('');
        setSelectedEvent('');
        setSelectedLdmType('');
        setSelectedDoctor('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>

                <DropdownList
                    options={ldmTypes}
                    value={selectedLdmType || ''}
                    onChange={handleLdmTypeChange}
                    placeholder="Выберите тип мероприятия"
                />

                {selectedLdmType && (
                    <DropdownList
                        options={filteredEvents}
                        value={selectedEvent?.id || ''}
                        onChange={handleEventChange}
                        placeholder="Выберите мероприятие"
                    />
                )}
                {selectedEvent && (
                    <DropdownListDoctors
                        options={doctors}
                        value={selectedDoctor || ''}
                        onChange={handleDoctorChange}
                        placeholder="Выберите специалиста"
                    />
                )}
                {selectedDoctor && (
                    <>
                        <button type="submit">Добавить направление</button>
                    </>
                )}
            </div>

        </form>
    );
}

export default AddAppointmentReferralPanel