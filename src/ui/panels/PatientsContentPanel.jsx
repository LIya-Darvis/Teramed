import React, { useState, useEffect } from 'react';
import { getPatients } from "../../components/fire_api";
import { MedCardButton } from '../elements/Buttons';
import SearchPanel from '../elements/SearchPanel';
import ContentLabel from '../elements/ContentLabel';




export default function PatientsContentPanel() {

    const [patientsData, setPatientsData] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const [searchText, setSearchText] = useState('');

    // ассинхронно получаем данные врачей из апи
    useEffect(() => {
        async function fetchData() {
            try {
                const patients = await getPatients();
                setPatientsData(patients);
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchData();
    }, []);

    const handlePatientMedCard = (patientId) => {
        console.log("открываем мед карту пациента: ", patientId);
    };

    return (
        <div className='content_panel'>
            <ContentLabel title="Пациенты" />
            <SearchPanel onChange={e => setSearchText(e.target.value)} value={searchText} />

            <div className='table_frame'>
                <table className='data_table'>
                    <thead>
                        <tr>
                            <th>Фамилия</th>
                            <th>Имя</th>
                            <th>Отчество</th>
                            <th>Дата рождения</th>
                            <th>Пол</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patientsData.map(patient => (
                            <tr key={patient.id}>
                                <td>{patient.lastname}</td>
                                <td>{patient.name}</td>
                                <td>{patient.surname}</td>
                                <td>{patient.birthday}</td>
                                <td>{patient.gender.name}</td>
                                <td>
                                    <div className='table_buttons_frame'>
                                        <MedCardButton onClick={() => handlePatientMedCard(patient.id)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )



}
