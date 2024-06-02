import React, { useState, useEffect } from 'react'
import ContentLabel from '../elements/ContentLabel'
import { useData } from '../../components/DataProvider';
import { getDoctorByUserId, getFilteredAppointmentsByDoctorId, getPatientAnalysesById, getPatientById, getPatientSickHistoryById, getPatients } from '../../components/fire_api';
import AppointmentCard from '../elements/AppointmentCard';
import ModalPanel from '../elements/ModalPanel';
import { AddButton, CloseButton, TopPanelButton, TopPanelDopButton } from '../elements/Buttons';
import './styles.css';
import PatientAppointmentsTable from '../elements/PatientAppointmentsTable';
import PatientAnalysesTable from '../elements/PatientAnalysesTable';
import PatientSickHystoriesTable from '../elements/PatientSickHistoriesTable';
import AddAppointmentReferralPanel from '../elements/AddAppointmentReferralPanel';


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
          <div style={containerStyle} className="custom_scrollbar">
            <h2>Информация о пациенте</h2>
            <p>{`ФИО: ${patientInfo.lastname} ${patientInfo.name} ${patientInfo.surname}`}</p>
            <p>{`Дата рождения: ${patientInfo.birthday} (${patientInfo.age})`}</p>
            <p>{`Пол: ${patientInfo.gender.name}`}</p>
            <PatientAppointmentsTable patientId={selectedAppointment.id_patient.id} />
          </div>
        ) : <p>Загрузка...</p>;
      case 'sickHistory':
        if (!sickHistory) fetchSickHistory();
        return sickHistory ? (
          <div>
            <div style={containerStyle} className="custom_scrollbar">
              <PatientSickHystoriesTable patientId={selectedAppointment.id_patient.id} />
            </div>
          </div>
        ) : <p>Загрузка...</p>;
      case 'analyses':
        if (!analyses) fetchAnalyses();
        return analyses ? (
          <div>
            <div style={containerStyle} className="custom_scrollbar">
              <PatientAnalysesTable patientId={selectedAppointment.id_patient.id} />
            </div>
          </div>
        ) : <p>Загрузка...</p>;
      case 'makeAppointmentRefferal':
        return (
          <div>
            <AddAppointmentReferralPanel
              id_patient={selectedAppointment.id_patient.id}
              id_referral_maker={doctorsData.id}
              onSubmit={handleFormSubmit} />
          </div>
        )
      case 'makeGospitalizationRefferal':
        return (
          <div>
            хыхы
          </div>
        )
      default:
        return null;
    }
  };

  const handleFormSubmit = async (formData) => {
    // Здесь можно обработать данные формы или выполнить другие действия после успешного добавления
    console.log('Form submitted with data:', formData);
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
            <TopPanelDopButton onClick={() => setActiveTab('makeAppointmentRefferal')} title="Направление на прием" />

            {doctorsData?.position?.name === "Терапевт" && (
              <TopPanelDopButton
                onClick={() => setActiveTab('makeGospitalizationRefferal')}
                title="Направление на госпитализацию"
              />
            )}
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

const containerStyle = {
  maxHeight: '65vh',
  overflowY: 'scroll',
  padding: '0px 15px',
};

