import React, { useState, useEffect } from 'react'
import { useData } from '../../dataProviders/DataProvider';
import { SideMenu } from '../elements/SideMenu';
import { MenuButton } from '../elements/components/MenuButton';
import DoctorsContentPanel from '../panels/admin/DoctorsContentPanel';
import GospitalizationsContentPanel from '../panels/GospitalizationsContentPanel';
import PatientsContentPanel from '../panels/PatientsContentPanel';
import PatientLdmViewPanel from '../panels/PatientLdmViewPanel';
import UsersContentPanel from '../panels/admin/UsersContentPanel';
import PatientAppointmentMakePanel from '../panels/PatientAppointmentMakePanel';
import PatientAppointmentViewPanel from '../panels/patient/PatientAppointmentViewPanel';
import './styles.css';
import { fetchAccessiblePanelsForRole } from '../../api/supabaseApi';
import DoctorsAppointmentsPanel from '../panels/DoctorsAppointmentsPanel';
import PatientAppointmentReferralsViewPanel from '../panels/PatientAppointmentReferralsViewPanel';

const components = [
  { 'DoctorsContentPanel': { component: <DoctorsContentPanel />, title: "Сотрудники" } },
  { 'GospitalizationsContentPanel': { component: <GospitalizationsContentPanel />, title: "Госпитализация" } },
  { 'PatientsContentPanel': { component: <PatientsContentPanel />, title: "Пациенты" } },
  { 'PatientLdmViewPanel': { component: <PatientLdmViewPanel />, title: "Моя мед карта" } },
  { 'UsersContentPanel': { component: <UsersContentPanel />, title: "Пользователи" } },
  { 'PatientAppointmentMakePanel': { component: <PatientAppointmentMakePanel />, title: "Записаться на прием" } },
  { 'PatientAppointmentViewPanel': { component: <PatientAppointmentViewPanel />, title: "Мои назначенные приемы" } },
  { 'DoctorsAppointmentsPanel': { component: <DoctorsAppointmentsPanel />, title: "Назначенные приемы" } },
  { 'PatientAppointmentReferralsViewPanel': { component: <PatientAppointmentReferralsViewPanel />, title: "Мои направления на прием" } },
];

export default function UserPage() {

  const { data, setData } = useData();
  var roleId = data.userData.role;

  const [activePanel, setActivePanel] = useState(null);
  const [accessiblePanels, setAccessiblePanels] = useState([]);

  const handlePanelChange = (panelName) => {
    setActivePanel(panelName);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const panels = (await fetchAccessiblePanelsForRole(roleId)).data;
        setAccessiblePanels(panels || []);
      } catch (error) {
        console.error('Ошибка при получении доступных панелей:', error);
      }
    };
    fetchData();
  }, [])


  return (
    <div>
      <div className='user_page_back_frame'>
        <SideMenu>
          {accessiblePanels.map((panelName, index) => {
            const componentData = components.find((item) => Object.keys(item)[0] === panelName.panel_name);
            if (componentData) { // Проверяем наличие компонента в components
              const { component, title } = componentData[panelName.panel_name];
              return (
                <MenuButton key={index} title={title} onClick={() => handlePanelChange(panelName.panel_name)} />
              );
            }
            return null;
          })}
        </SideMenu>
        <div className='user_page_content_frame'>
          {activePanel && components.map(item => {
            const panelName = Object.keys(item)[0];
            if (panelName === activePanel) {
              return item[activePanel].component;
            }
            return null;
          })}
        </div>
      </div>
    </div>
  )
}


