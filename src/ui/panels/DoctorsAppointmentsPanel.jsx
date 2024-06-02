import React, { useState, useEffect } from 'react'
import ContentLabel from '../elements/ContentLabel'
import { useData } from '../../components/DataProvider';
import { getDoctorByUserId, getFilteredAppointmentsByDoctorId, getPatientAnalysesById, getPatientById, getPatientSickHistoryById, getPatients } from '../../components/fire_api';
import AppointmentCard from '../elements/AppointmentCard';
import ModalPanel from '../elements/ModalPanel';
import { AddButton, CloseButton, TopPanelButton } from '../elements/Buttons';
import './styles.css';
import SickHistoryViewCard from '../elements/SickHistoryViewCard';
import AnalysViewCard from '../elements/AnalysViewCard';


function DoctorsAppointmentsPanel() {
  const { data, setData } = useData();
  const [doctorsData, setDoctorsData] = useState([]);
  const [doctorAppointmentsData, setDoctorAppointmentsData] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [patientId, setPatientId] = useState([]);
  const [activeTab, setActiveTab] = useState('patientInfo');
  const [patientInfo, setPatientInfo] = useState(null);
  const [sickHistory, setSickHistory] = useState(null);
  const [analyses, setAnalyses] = useState(null);


  // ассинхронно получаем данные врачей по id авторизованного пользователя
  useEffect(() => {
    async function fetchData() {
      try {
        const doctors = await getDoctorByUserId(data.userData.id);
        setDoctorsData(doctors);
        const doctorAppointments = await getFilteredAppointmentsByDoctorId(doctors.id);
        setDoctorAppointmentsData(doctorAppointments);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchData();
  }, []);

  const fetchPatientInfo = async () => {
    try {
      console.log(selectedAppointment)
      const data = await getPatientById(selectedAppointment.id_patient.id);
      setPatientId(selectedAppointment.id_patient.id);
      setPatientInfo(data);
    } catch (error) {
      console.error('Ошибка при получении информации о пациенте:', error);
    }
  };

  const fetchSickHistory = async () => {
    try {
      const data = await getPatientSickHistoryById(patientId);
      console.log(data)
      setSickHistory(data);
    } catch (error) {
      console.error('Ошибка при получении истории болезней пациента:', error);
    }
  };

  const fetchAnalyses = async () => {
    try {
      const data = await getPatientAnalysesById(patientId);
      setAnalyses(data);
    } catch (error) {
      console.error('Ошибка при получении анализов пациента:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'patientInfo':
        if (!patientInfo) fetchPatientInfo();
        return patientInfo ? (
          <div>
            <h2>Информация о пациенте</h2>
            <p>{`ФИО: ${patientInfo.lastname} ${patientInfo.name} ${patientInfo.surname}`}</p>
            <p>{`Дата рождения: ${patientInfo.birthday} (${patientInfo.age})`}</p>
            <p>{`Пол: ${patientInfo.gender.name}`}</p>
          </div>
        ) : <p>Загрузка...</p>;
      case 'sickHistory':
        if (!sickHistory) fetchSickHistory();
        return sickHistory ? (
          <div>
            <h2>Информация о диагнозах</h2>
            {sickHistory.length > 0 ? (
              sickHistory.map((diagnos) => (
                <SickHistoryViewCard key={diagnos.id} diagnos={diagnos.diagnos} symptoms={diagnos.symptoms}
                  doctor={diagnos.doctor} recomendations={diagnos.recomendations}
                  diagnosDate={diagnos.diagnosDate} onClick={() => console.log('Card clicked')} />
              ))
            ) : (
              <p>История болезни отсутствует.</p>
            )}

          </div>
        ) : <p>Загрузка...</p>;
      case 'analyses':
        if (!analyses) fetchAnalyses();
        return analyses ? (
          <div>
            <h2>Информация об анализах</h2>
            {analyses.length > 0 ? (
              analyses.map((analysis) => (
                <AnalysViewCard key={analysis.id}
                  analysName={analysis.analysType.name} value={analysis.value}
                  analysUnit={analysis.analysType.unit} doctor={analysis.doctor}
                  analysDate={analysis.analysDate} comment={analysis.comment}
                  onClick={() => console.log('Card clicked')} />
              ))
            ) : (
              <p>История анализов отсутствует.</p>
            )}
          </div>
        ) : <p>Загрузка...</p>;
      default:
        return null;
    }
  };

  const handleOpenModal = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null);
    setActiveTab('patientInfo');
  };



  return (
    <div>
      <ContentLabel title="Текущий прием" />



      <ContentLabel title="Назначенные приемы" />

      {doctorAppointmentsData.map(appointment => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onClick={handleOpenModal}
        />
      ))}

      {selectedAppointment && (
        <ModalPanel>
          <CloseButton title="Х" onClick={handleCloseModal} />

          <div className='buttons_panel'>
            <TopPanelButton onClick={() => setActiveTab('patientInfo')} title="Пациент" />
            <TopPanelButton onClick={() => setActiveTab('sickHistory')} title="История болезни" />
            <TopPanelButton onClick={() => setActiveTab('analyses')} title="Анализы" />
          </div>

          <div>
            {renderContent()}
          </div>

        </ModalPanel>
      )}



    </div>
  )
}

export default DoctorsAppointmentsPanel