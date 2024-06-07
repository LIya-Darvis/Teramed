import React, { useEffect, useState } from "react";
import { EditButton } from "./components/Buttons";
import { getDoctorByUserId } from "../../api/fire_api";

const UserTable = ({ usersData, handleEditUser }) => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [positionsData, setPositionsData] = useState({});
    const [availableData, setAvailableData] = useState({});

    useEffect(() => {
        const fetchDoctorsData = async () => {
            const positionsData = {};
            const availableData = {};
            for (const user of usersData) {
                try {
                    const doctorData = await getDoctorByUserId(user.id);
                    positionsData[user.id] = doctorData.position.name;
                    availableData[user.id] = doctorData.is_available;
                    console.log(availableData[user.id])
                } catch (error) {
                    console.error(`Error fetching doctor data for user ${user.id}:`, error);
                }
            }
            setPositionsData(positionsData);
        };

        fetchDoctorsData();
    }, [usersData]);


    const tableStyle = {
        backgroundColor: '#fff',
        width: '100%',
        borderCollapse: 'collapse',
        margin: '16px 0',
        fontSize: '16px',
        borderRadius: '4px',
    };

    const thTdStyle = {
        border: '1px solid #ddd',
        padding: '6px 16px',
        textAlign: 'left',
    };

    const thStyle = {
        ...thTdStyle,
        backgroundColor: '#f0f5fa',
    };

    return (
      <div >
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Пользователь</th>
              <th style={thStyle}>Роль</th>
              <th style={thStyle}>Должность (врача)</th>
              {/* <th style={thStyle}>Доступен для записи (врач)</th> */}
              <th style={thStyle}>Логин</th>
              <th style={thStyle}>Пароль</th>
              {/* <th style={thStyle}>Действия</th> */}
            </tr>
          </thead>
          <tbody>
            {usersData.map(user => (
              <tr key={user.id}>
                <td style={thTdStyle}>{user.username}</td>
                <td style={thTdStyle}>{user.role.name}</td>
                <td style={thTdStyle}>{positionsData[user.id] || '-'}</td>
                {/* <td style={thTdStyle}>{availableData[user.id] || '-'}</td> */}
                <td style={thTdStyle}>{user.login}</td>
                <td style={thTdStyle}>{user.password}</td>
                {/* <td style={thTdStyle}> 
                  <div className='table_buttons_frame'>
                    <EditButton onClick={() => handleEditUser(user.id)} />
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default UserTable;