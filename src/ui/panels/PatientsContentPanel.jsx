import React, { useState, useEffect } from 'react';
import { getPatients, getPatientSickHistoryById, getPatientAnalysesById } from "../../components/fire_api";
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


export default function PatientsContentPanel() {
    const [patientsData, setPatientsData] = useState([]);

    // для поиска
    const [searchData, setSearchData] = useState([]);
    const [searchText, setSearchText] = useState('');

    // для модальных окон
    const [isSickHistoryModalOpen, setIsSickHistoryModalOpen] = useState(false);
    const [isAnalysModalOpen, setIsAnalysModalOpen] = useState(false);

    // для данных пациента
    const [lastname, setLastname] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [isArchived, setIsArchived] = useState(false);

    const [patientId, setPatientId] = useState(null);
    const [patientDiagnoses, setPatientDiagnoses] = useState([]);
    const [patientAnalyses, setPatientAnalyses] = useState([]);

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
    };

    const handlePatientDiagnoses = async (idPatient) => {
        try {
            setPatientId(idPatient);

            const patientSickHistory = await getPatientSickHistoryById(idPatient);
            console.log(patientSickHistory);
            setPatientDiagnoses(patientSickHistory);
            setIsSickHistoryModalOpen(true);
        } catch (error) {
            console.error('Ошибка при обработке истории болезни пациента:', error);
        }
    };

    const handlePatientAnalyses = async (idPatient) => {
        try {
            setPatientId(idPatient);

            const patientAnalys = await getPatientAnalysesById(idPatient);
            console.log(patientAnalys);
            setPatientAnalyses(patientAnalys);
            setIsAnalysModalOpen(true);
        } catch (error) {
            console.error('Ошибка при обработке истории болезни пациента:', error);
        }
    };

    // закрытие модального окна
    const handleCloseClick = () => {
        clearData();
    };

    const handleDiagnosClick = () => {
        console.log(patientId)
    };

    const handleAnalysClick = () => {
        console.log(patientId)
    };

    return (
        <div className='content_panel'>
            <ContentLabel title="Пациенты" />
            <SearchPanel onChange={e => setSearchText(e.target.value)} value={searchText} />

            <div className='patient_cards_frame'>
                {patientsData.map((patient, index) => (
                    <PatientInfoCard key={index} patient={patient} />
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

            {/* {isSickHistoryModalOpen && (
                <ModalPanel >
                    <CloseButton title="Х" onClick={() => handleCloseClick()} />
                    <h3>Диагнозы</h3>
                    <ConfirmButton title="Установить диагноз" />
                    {patientDiagnoses.map((diagnos) => (
                        <SickHistoryViewCard key={diagnos.id} diagnos={diagnos.diagnos} symptoms={diagnos.symptoms}
                            doctor={diagnos.doctor.lastname} recomendations={diagnos.recomendations}
                            diagnosDate={diagnos.diagnosDate} onClick={() => handleDiagnosClick()} />
                    ))}

                </ModalPanel>
            )}
            */}

            {/* 
            {isAnalysModalOpen && (
                <ModalPanel >
                    <CloseButton title="Х" onClick={() => handleCloseClick()} />
                    <h3>Анализы</h3>

                    <ConfirmButton title="Добавить результаты анализа" />
                    <div className='card_list_frame'>
                        {patientAnalyses.map((analys) => (
                            <AnalysViewCard key={analys.id} analysName={analys.analysType.name} value={analys.value}
                                analysUnit={analys.analysType.unit} doctor={analys.doctor.lastname}
                                analysDate={analys.analysDate} comment={analys.comment} 
                                onClick={() => handleAnalysClick()} />
                        ))}
                    </div>

                </ModalPanel>
            )} */}

        </div >
    )



}
