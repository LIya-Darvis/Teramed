import React, { useState, useEffect } from 'react'
import { useData } from '../../components/DataProvider';
import { SideMenu } from '../elements/SideMenu';
import { MenuButton } from '../elements/MenuButton';
import { DoctorsContentPanel } from '../panels/DoctorsContentPanel';
import GospitalizationsContentPanel from '../panels/GospitalizationsContentPanel';
import { PatientsContentPanel } from '../panels/PatientsContentPanel';
import PatientLdmViewPanel from '../panels/PatientLdmViewPanel';
import UsersContentPanel from '../panels/UsersContentPanel';

import { fetchAccessiblePanelsForRole } from '../../components/fire_api';


const components = [
  { 'DoctorsContentPanel': { component: <DoctorsContentPanel />, title: "Сотрудники" } },
  { 'GospitalizationsContentPanel': { component: <GospitalizationsContentPanel />, title: "Госпитализация" } },
  { 'PatientsContentPanel': { component: <PatientsContentPanel />, title: "Пациенты" } },
  { 'PatientLdmViewPanel': { component: <PatientLdmViewPanel />, title: "Моя мед карта" } },
  { 'UsersContentPanel': { component: <UsersContentPanel />, title: "Пользователи" } },
];

export default function UserPage() {

  const { data, setData } = useData();
  var user = data.userData.role;

  const [activePanel, setActivePanel] = useState(null);
  const [accessiblePanels, setAccessiblePanels] = useState([]);

  const handlePanelChange = (panelName) => {
    setActivePanel(panelName);
    console.log(panelName);
  };

  useEffect(() => {

    const fetchData = async () => {
      try {
        const panels = await fetchAccessiblePanelsForRole(user);
        setAccessiblePanels(panels);
      } catch (error) {
        console.error('Ошибка при получении доступных панелей:', error);
      }
    };

    fetchData();
  }, [])


  return (
    <>
      <div className='user_page_back_frame'>
        <SideMenu>

          {accessiblePanels.map((panelName, index) => {
            const { component, title } = components.find((item) => Object.keys(item)[0] === panelName)[panelName];
            return (
              <MenuButton key={index} title={title} onClick={() => handlePanelChange(panelName)} />
            );
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
    </>
  )
}
