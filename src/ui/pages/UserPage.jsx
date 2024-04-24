import React, { useState } from 'react'
import { useData } from '../../components/DataProvider';
import { SideMenu } from '../elements/SideMenu';
import { MenuButton } from '../elements/MenuButton';
import UserAccountPanel from '../elements/UserAccountPanel';
import { DoctorsContentPanel } from '../elements/DoctorsContentPanel';
import GospitalizationContentPanel from '../elements/GospitalizationContentPanel';
import { PatientsContentPanel } from '../elements/PatientsContentPanel';
import { MenuPoint } from '../../components/classes';



// const components = {
//   "admin": [DoctorsContentPanel, GospitalizationContentPanel],
//   "doctor": [PatientsContentPanel, GospitalizationContentPanel]
// };

const components = {
  "admin": [{ doctorsPanel: { component: <DoctorsContentPanel />, title: "Сотрудники" } },
  { gospitalizationPanel: { component: <GospitalizationContentPanel />, title: "Госпитализация" } }],
  "doctor": [{ patientsPanel: { component: <PatientsContentPanel />, title: "Пациенты" } },
  { gospitalizationPanel: { component: <GospitalizationContentPanel />, title: "Госпитализация" } }]
};

export default function UserPage() {

  // const [activePanel, setActivePanel] = useState('');
  const [activePanel, setActivePanel] = useState(null);

  const handlePanelChange = (panelName) => {
    setActivePanel(panelName);
    console.log(panelName);
  };
  // const handlePanelChange = (panel) => {
  //   setActivePanel(panel);
  // };

  const { data, setData } = useData();
  var user = data.userData.role
  const userComponents = components[user];

  return (
    <>

      <div className='user_page_back_frame'>
        <SideMenu>
          {userComponents.map((componentGroup, index) => (
            Object.entries(componentGroup).map(([panelName, { component, title }]) => (
              <MenuButton key={panelName} title={title} onClick={() => handlePanelChange(panelName)} />
            ))
          ))}
        </SideMenu>

        <div className='user_page_content_frame'>

          {activePanel && components[user].find(panel => panel[activePanel])?.[activePanel].component}
          
        </div>
      </div>
    </>
  )
}
