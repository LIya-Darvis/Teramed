import React, { useState, useEffect } from 'react';
import { getPatientAnalysesById } from "../../components/fire_api";

function PatientAnalysesTable({ patientId }) {
    const [analyses, setAnalyses] = useState([]);

    useEffect(() => {
        async function fetchAppointments() {
            const data = await getPatientAnalysesById(patientId);
            console.log(data)
            setAnalyses(data);
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
            <h5>Анализы пациента</h5>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Анализ</th>
                        <th style={thStyle}>Результат</th>
                        <th style={thStyle}>Проведен</th>
                        <th style={thStyle}>Дата</th>
                        <th style={thStyle}>Комментарий</th>
                    </tr>
                </thead>
                <tbody>
                    {analyses.length > 0 ? (
                        analyses.map((analysis) => (
                            <tr key={analysis.id}>
                                <td style={thTdStyle}>{analysis.analysType.name}</td>
                                <td style={thTdStyle}>{`${analysis.value} ${analysis.analysType.unit}`}</td>
                                <td style={thTdStyle}>{analysis.doctor.lastname} {analysis.doctor.name} {analysis.doctor.surname}</td>
                                <td style={thTdStyle}>{analysis.analysDate}</td>
                                <td style={thTdStyle}>{analysis.comment}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td style={thTdStyle} colSpan="5">Нет анализов для данного пациента.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default PatientAnalysesTable;