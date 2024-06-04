import React, { useState, useEffect } from 'react';
import { getPatientSickHistoryById } from "../../components/fire_api";

function PatientSickHystoriesTable({ patientId }) {
    const [sickHystories, setSickHystories] = useState([]);

    useEffect(() => {
        async function fetchAppointments() {
            const data = await getPatientSickHistoryById(patientId);
            setSickHystories(data);
        }

        fetchAppointments();
    }, [patientId]);

    const tableStyle = {
        width: '90%',
        borderCollapse: 'collapse',
        margin: '16px 0',
        fontSize: '16px',
    };

    const thTdStyle = {
        border: '1px solid #ddd',
        padding: '8px',
        textAlign: 'left',
    };

    const thStyle = {
        ...thTdStyle,
        backgroundColor: '#f2f2f2',
    };

    return (
        <div>
            <h5>Диагнозы пациента</h5>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Диагноз</th>
                        <th style={thStyle}>Симптомы</th>
                        <th style={thStyle}>Установлен</th>
                        <th style={thStyle}>Подтвержден</th>
                        <th style={thStyle}>Дата установки</th>
                        <th style={thStyle}>Рекомендации</th>
                    </tr>
                </thead>
                <tbody>
                    {sickHystories.length > 0 ? (
                        sickHystories.map((sickHystory) => (
                            <tr key={sickHystory.id}>
                                <td style={thTdStyle}>{sickHystory.diagnos}</td>
                                <td style={thTdStyle}>{sickHystory.symptoms}</td>
                                <td style={thTdStyle}>{sickHystory.doctor.lastname} {sickHystory.doctor.name} {sickHystory.doctor.surname}</td>
                                <td style={thTdStyle}>{sickHystory.is_confirmed}</td>
                                <td style={thTdStyle}>{sickHystory.diagnosDate}</td>
                                <td style={thTdStyle}>{sickHystory.recomendations}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td style={thTdStyle} colSpan="6">Нет истории болезни данного пациента.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default PatientSickHystoriesTable;