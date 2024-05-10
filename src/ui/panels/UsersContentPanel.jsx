import React, { useState, useEffect } from 'react'
import { getUsers } from '../../components/fire_api';
import { EditButton, DeleteButton } from '../elements/Buttons';
import SearchPanel from '../elements/SearchPanel';
import ContentLabel from '../elements/ContentLabel';

function UsersContentPanel() {
  const [usersData, setUsersData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [searchText, setSearchText] = useState('');

  // ассинхронно получаем данные пользователей
  useEffect(() => {
    async function fetchData() {
      try {
        const users = await getUsers();
        setUsersData(users);
        console.log(" => ", users)
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchData();
  }, []);

  const handleEditUser = (userId) => {
    console.log("редактирование пользователя: ", userId);
  };

  const handleDeleteUser = (userId) => {
    console.log("удаление пользователя: ", userId);
  };

  return (
    <div>
      <ContentLabel title="Пользователи" />
      <SearchPanel onChange={e => setSearchText(e.target.value)} value={searchText} />
      <div className='table_frame'>
        <table className='data_table'>
          <thead>
            <tr>
              <th>Пользователь</th>
              <th>Роль</th>
              <th>Логин</th>
              <th>Пароль</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {usersData.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.role.name}</td>
                <td>{user.login}</td>
                <td>{user.password}</td>
                <td>
                  <div className='table_buttons_frame'>
                    <EditButton onClick={() => handleEditUser(user.id)} />
                    <DeleteButton onClick={() => handleDeleteUser(user.id)} />
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

export default UsersContentPanel