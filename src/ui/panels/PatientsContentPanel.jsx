import React, { useState, useEffect } from 'react';
import { getPatients, getPatientSickHistoryById, getPatientAnalysesById, getDoctorByUserId } from "../../components/fire_api";
import { SickHistoryViewButton, AnalysViewButton, ConfirmButton, CloseButton } from '../elements/Buttons';
import SearchPanel from '../elements/SearchPanel';
import ContentLabel from '../elements/ContentLabel';
import ModalPanel from '../elements/ModalPanel';
import ModalEditText from '../elements/ModalEditText';
import ModalCheckBox from '../elements/ModalCheckBox';
import "./styles.css";
import SickHistoryViewCard from '../elements/SickHistoryViewCard';
import AnalysViewCard from '../elements/AnalysViewCard';
import PatientInfoCard from '../elements/PatientInfoCard';
import { generateSchedule } from '../../components/generations';
import { useData } from '../../components/DataProvider';
import PatientSickHystoriesTable from '../elements/PatientSickHistoriesTable';
import PatientAnalysesTable from '../elements/PatientAnalysesTable';
import { AddAnalysisForm } from '../elements/AddAnalysisForm';
import PatientAppointmentsTable from '../elements/PatientAppointmentsTable';
import AddGospitalizationForm from '../elements/AddGospitalizationForm';


export default function PatientsContentPanel() {
    const [patientsData, setPatientsData] = useState([]);

    // для поиска
    const [searchData, setSearchData] = useState([]);
    const [searchText, setSearchText] = useState('');

    // для модальных окон
    const [isSickHistoryModalOpen, setIsSickHistoryModalOpen] = useState(false);
    const [isAnalysModalOpen, setIsAnalysModalOpen] = useState(false);
    const [isGospitalizationModalOpen, setIsGospitalizationModalOpen] = useState(false);

    // для данных пациента
    const [lastname, setLastname] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [isArchived, setIsArchived] = useState(false);

    const [patientId, setPatientId] = useState(null);
    const [patientDiagnoses, setPatientDiagnoses] = useState([]);
    const [patientAnalyses, setPatientAnalyses] = useState([]);
    const [patientAppointments, setPatientAppointments] = useState([]);

    const { data, setData } = useData();
    const [doctorsData, setDoctorsData] = useState([]);

    const [showAddAnalysisForm, setShowAddAnalysisForm] = useState(false);
    const [showAddGospitalizationsForm, setShowAddGospitalizationsForm] = useState(false);

    // ассинхронно получаем данные пациентов из апи
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

    useEffect(() => {
        async function fetchData() {
            try {
                const doctors = await getDoctorByUserId(data.userData.id);
                setDoctorsData(doctors);
                console.log(doctors.position.name);
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchData();
    }, []);

    // для очистки и обнуления статичных переменных
    const clearData = () => {
        setLastname('');
        setName('');
        setSurname('');
        setIsArchived(false);
        setPatientId(null);
        setIsSickHistoryModalOpen(false);
        setIsAnalysModalOpen(false);
        setPatientDiagnoses([]);
        setPatientAnalyses([]);
        setIsGospitalizationModalOpen(false);
    };

    const handlePatientDiagnoses = async (patient) => {
        try {
            setPatientId(patient.id);
            const patientSickHistory = await getPatientSickHistoryById(patient.id);
            setPatientDiagnoses(patientSickHistory);
            setIsSickHistoryModalOpen(true);
        } catch (error) {
            console.error('Ошибка при обработке истории болезни пациента:', error);
        }
    };

    const handlePatientAnalyses = async (patient) => {
        try {
            setPatientId(patient.id);
            const patientAnalys = await getPatientAnalysesById(patient.id);
            setPatientAnalyses(patientAnalys);
            setIsAnalysModalOpen(true);
        } catch (error) {
            console.error('Ошибка при обработке истории болезни пациента:', error);
        }
    };

    const handlePatientGospitalization = async (patient) => {
        try {
            setPatientId(patient.id);
            setIsGospitalizationModalOpen(true);
        } catch (error) {
            console.error('Ошибка при обработке госпитализации пациента:', error);
        }
    };

    const handleAddAnalysisClick = () => {
        setShowAddAnalysisForm(true);
    };

    const handleAddGospitalizationClick = () => {

    };

    const handleBackClick = () => {
        setShowAddAnalysisForm(false);
    };

    // закрытие модального окна
    const handleCloseClick = () => {
        clearData();
    };

    return (
        <div className='content_panel'>
            <ContentLabel title="Пациенты" />
            <div className='func_frame'>
                <SearchPanel onChange={e => setSearchText(e.target.value)} value={searchText} />
            </div>

            <div className='patient_cards_frame'>
                {patientsData.map((patient, index) => (
                    <PatientInfoCard key={index} patient={patient}
                        position={doctorsData.position.name}
                        onClickSickHistory={handlePatientDiagnoses}
                        onClickAnalises={handlePatientAnalyses}
                        onClickGospitalization={handlePatientGospitalization}
                    />
                ))}
            </div>

            {/* <div className='table_frame'>
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
                                        <SickHistoryViewButton title={"Диагнозы"} onClick={() => handlePatientDiagnoses(patient.id)} />
                                        <AnalysViewButton title={"Анализы"} onClick={() => handlePatientAnalyses(patient.id)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> */}

            {isSickHistoryModalOpen && (
                <ModalPanel >
                    <CloseButton title="Х" onClick={() => handleCloseClick()} />
                    <ConfirmButton title="Установить диагноз" />
                    {patientDiagnoses ? (
                        <div>
                            <div style={containerStyle} className="custom_scrollbar">
                                <PatientSickHystoriesTable patientId={patientId} />
                            </div>
                        </div>
                    ) : <p>Загрузка...</p>}
                </ModalPanel>
            )}

            {isAnalysModalOpen && (
                <ModalPanel >
                    <CloseButton title="Х" onClick={() => handleCloseClick()} />
                    {doctorsData.position.name === 'Лаборант' && (
                        <ConfirmButton title="Добавить результаты анализа" onClick={handleAddAnalysisClick} />)}
                    {!showAddAnalysisForm ? (
                        patientAnalyses ? (
                            <div>
                                <div style={containerStyle} className="custom_scrollbar">
                                    <PatientAnalysesTable patientId={patientId} />
                                </div>
                            </div>
                        ) : (
                            <p>Загрузка...</p>
                        )
                    ) : (
                        <div>
                            <AddAnalysisForm doctorId={doctorsData.id} patientId={patientId} />
                            <button onClick={handleBackClick}>Назад</button>
                        </div>
                    )}

                </ModalPanel>
            )}

            {isGospitalizationModalOpen && (
                <ModalPanel >
                    <CloseButton title="Х" onClick={() => handleCloseClick()} />
                    {doctorsData.position.name === 'Терапевт' && (
                        <AddGospitalizationForm patientId={patientId} terapevtId={doctorsData.id} />

                        // <ConfirmButton title="Добавить направление на госпитализацию" onClick={handleAddGospitalizationClick} />)

                    )}




                </ModalPanel>
            )}

        </div >
    )
};

const containerStyle = {
    maxHeight: '65vh',
    minHeight: '50vh',
    overflowY: 'scroll',
    padding: '0px 15px',
};


