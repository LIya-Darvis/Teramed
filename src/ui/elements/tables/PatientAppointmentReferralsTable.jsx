import { useEffect, useState } from "react";
import { getAppointmentReferrals } from "../../../api/fire_api";

const PatientAppointmentReferralsTable = ({ patientId }) => {
    const [appointmentReferrals, setAppointmentReferrals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const referrals = await getAppointmentReferrals();
                const filteredReferrals = referrals.filter(referral => referral.id_patient.id === patientId && referral.is_confirmed === false);
                setAppointmentReferrals(filteredReferrals);
            } catch (error) {
                console.error('Error fetching appointment referrals:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [patientId]);

    if (loading) {
        return <p>Загрузка...</p>;
    }

    return (
        <div>
            <h5>Мои направления на прием</h5>
            {appointmentReferrals.length > 0 ? (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Мероприятие</th>
                            <th style={thStyle}>Создано</th>
                            <th style={thStyle}>Подтверждение</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointmentReferrals.map((referral) => (
                            <tr key={referral.id}>
                                <td style={thTdStyle}>{referral.ldm ? referral.ldm.name : 'N/A'}</td>
                                <td style={thTdStyle}>{referral.referral_maker ? `${referral.referral_maker.lastname} ${referral.referral_maker.name} ${referral.referral_maker.surname}` : 'N/A'}</td>
                                <td style={thTdStyle}>{referral.is_confirmed ? 'Да' : 'Нет'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Нет данных</p>
            )}
        </div>
    );
};

export default PatientAppointmentReferralsTable;


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






