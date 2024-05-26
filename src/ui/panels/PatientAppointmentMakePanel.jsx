import React, { useState, useEffect } from 'react'
import { useData } from '../../components/DataProvider';
import ContentLabel from '../elements/ContentLabel'
import { ConfirmButton, CloseButton } from '../elements/Buttons';
import { getLdms, findPatientByUserId, getDoctorLocationsByPositionId, 
    uploadDataToAppointment } from '../../components/fire_api';
import LdmCard from '../elements/LdmCard';
import { TimeCard } from '../elements/TimeCard';
import ModalPanel from '../elements/ModalPanel';
import './styles.css';

import { getAppointmentTimePeriods } from '../../components/generations';


function PatientAppointmentMakePanel() {
    const { data, setData } = useData();

    

    const [selectedTime, setSelectedTime] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [appointmentTime, setAppointmentTime] = useState([]);


    // выбор специалиста
    const handleDoctorConfirm = async () => {
        
    };

    const handleCloseClick = () => {
        setIsModalOpen(false);
    };

    // выбор времени лдм
    const handleTimeCardClick = (time) => {
        setSelectedTime(time);
    };

    // подтверждение оформления записи на лдм
    const handleConfirm = async () => {

        const patients = await findPatientByUserId(data.userData.id)
        const doctorLocations = await getDoctorLocationsByPositionId(selectedLdm.id_position.id);

        if (patients && doctorLocations) {
            const patient = patients[0];
            const doctorLocation = doctorLocations[0];
            const ldmDateTime = new Date();
            ldmDateTime.setHours(selectedTime.hours);
            ldmDateTime.setMinutes(selectedTime.minutes);

            uploadDataToAppointment(patient.id, doctorLocation.id, selectedLdm.id, ldmDateTime);

            setIsModalOpen(false);
            setAppointmentTime([]);
            setSelectedTime(null);
        } else {
            console.log("Пользователь или должность специалиста не найдена")
        }
    };

    return (
        <div className='content_panel'>
            <ContentLabel title="Записаться на прием" />
            
            <div className='table_frame'>
                <table className='data_table'>
                    <thead>
                        <tr>
                            <th>Фамилия</th>
                            <th>Имя</th>
                            <th>Отчество</th>
                            <th>Должность</th>
                            <th>Доступен для записи</th>
                            <th>Архивирован</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctorsData.map(doctor => (
                            <tr key={doctor.id}>
                                <td>{doctor.lastname}</td>
                                <td>{doctor.name}</td>
                                <td>{doctor.surname}</td>
                                <td>{doctor.position.name}</td>
                                <td>{doctor.is_available ? 'Да' : 'Нет'}</td>
                                <td>{doctor.is_archived ? 'Да' : 'Нет'}</td>
                                <td>
                                    <div className='table_buttons_frame'>
                                        <ConfirmButton onClick={() => handleEditDoctor(doctor.id)} />
                                        <DeleteButton onClick={() => handleDeleteDoctor(doctor.id)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <ModalPanel >
                    <CloseButton title="Х" onClick={handleCloseClick}/>
                    <h3>{selectedLdm.name}</h3>
                    {appointmentTime.map((time) => (
                        <TimeCard hour={time.hours} minute={time.minutes}
                            onClick={() => handleTimeCardClick(time)} />
                    ))}

                    <ConfirmButton title={"Подтвердить"} onClick={handleConfirm}/>
                </ModalPanel>
            )}
        </div>
    )
}

export default PatientAppointmentMakePanel

