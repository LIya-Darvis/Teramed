import React, { useState, useEffect } from 'react'
import { EditButton, DeleteButton, AddButton, CloseButton, TopPanelButton } from '../../elements/components/Buttons';
import SearchPanel from '../../elements/SearchPanel';
import ContentLabel from '../../elements/components/ContentLabel';
import UserTable from '../../elements/tables/UsersTable';
import ModalPanel from '../../elements/components/ModalPanel';
import AddDoctorUserForm from '../../elements/forms/AddDoctorUserForm';
import AddPatientUserForm from '../../elements/forms/AddPatientUserForm';
import useRealtimeData from '../../../dataProviders/useRealtimeData';

function UsersContentPanel() {
  const usersData = useRealtimeData('get_users').data;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('patientInfo');
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Фильтрация данных на основе поискового запроса
  const filteredUsers = usersData?.filter(user => {
    const searchString = searchQuery.toLowerCase();
    return (
      user.username.toLowerCase().includes(searchString) ||
      user.position_name.toLowerCase().includes(searchString) ||
      user.role_name.toLowerCase().includes(searchString)
    );
  });

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'patientAddPanel':
        return (
          <div>
            <div style={containerStyle} className="custom_scrollbar">
              <AddPatientUserForm onClose={handleCloseModal} />
            </div>
          </div>
        )
      case 'doctorAddPanel':
        return (
          <div>
            <div style={containerStyle} className="custom_scrollbar">
              <AddDoctorUserForm onClose={handleCloseModal} />
            </div>
          </div>
        )
      default:
        return null;
    }
  };

  // открытие окна для добавления пользователя 
  const handleAddUser = () => {
    setIsModalOpen(true);

  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveTab('patientAddPanel');
  };

  const handleEditUser = (userId) => {
    console.log("редактирование пользователя: ", userId);
  };

  const handleDoctorUserSubmit = async (user) => {
    try {


      setIsModalOpen(false);
      // обновить состояние пользователей
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handlePatientUserSubmit = async (user) => {
    try {

      setIsModalOpen(false);
      // обновить состояние пользователей
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <div>
      <ContentLabel title="Пользователи" />
      <div className='func_frame'>
        <SearchPanel onChange={handleSearchChange}/>
        <AddButton title="Добавить пользователя" onClick={() => handleAddUser()} />
      </div>
      {usersData ? (
        <UserTable usersData={filteredUsers} handleEditUser={handleEditUser} />
      ) : (
        <p>Загрузка...</p>
      )}
      {isModalOpen && (
        <ModalPanel>
          <CloseButton title="Х" onClick={handleCloseModal} />

          <div className='buttons_panel'>
            <TopPanelButton onClick={() => setActiveTab('patientAddPanel')} title="Добавить пациента" />
            <TopPanelButton onClick={() => setActiveTab('doctorAddPanel')} title="Добавить специалиста" />
          </div>

          <div>
            {renderContent()}
          </div>

        </ModalPanel>
      )}
    </div>
  )
}

export default UsersContentPanel

const containerStyle = {
  maxHeight: '65vh',
  minHeight: '65vh',
  minWidth: '75vw',
  overflowY: 'hidden',
  padding: '0px 15px',
  margin: '0px 0px 30px 0px',
};


