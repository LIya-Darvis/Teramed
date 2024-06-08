import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { EditButton } from "../components/Buttons";
import DataDisplay from "../../../dataProviders/DataDisplay";

const UsersTable = ({ usersData, handleEditUser }) => {

  return (

    <DataDisplay
      endpoint="get_users"
      params={{}}
      render={(data) => (

        <div className='table_frame'>
          {usersData.length > 0 ? (
            <table className='data_table'>
              <thead>
                <tr>
                  <th>Пользователь</th>
                  <th>Роль</th>
                  <th>Должность (врача)</th>
                  <th>Логин</th>
                  <th>Пароль</th>
                  {/* <th style={thStyle}>Действия</th> */}
                </tr>
              </thead>
              <tbody>
                {usersData.map(user => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.role_name}</td>
                    <td>{user.position_name}</td>
                    <td>{user.login}</td>
                    <td>{user.password}</td>
                    {/* <td style={thTdStyle}> 
                  <div className='table_buttons_frame'>
                    <EditButton onClick={() => handleEditUser(user.id)} />
                  </div>
                </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Нет данных</p>
          )}
        </div>
      )}
    />
  );
};

UsersTable.propTypes = {
  usersData: PropTypes.array.isRequired,
  handleEditUser: PropTypes.func.isRequired,
};

export default UsersTable;