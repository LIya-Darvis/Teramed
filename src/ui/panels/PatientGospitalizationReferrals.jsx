import React from 'react'
import { useData } from '../../dataProviders/DataProvider';
import ContentLabel from '../elements/components/ContentLabel';
import useRealtimeData from '../../dataProviders/useRealtimeData';
import GospitalizationReferralTable from '../elements/tables/GospitalizationReferralTable';

function PatientGospitalizationReferrals() {
    const { data, setData } = useData();
    const patientData = useRealtimeData('get_patients').data;

    if (!patientData) return null;
    // console.log(patientData)
    const patient = patientData.filter(patient => patient.user_id === data.userData.id)[0];

    // console.log(patient)

    return (
      <div className='content_panel'>
        <ContentLabel title="Моя направления на госпитализацию" />
        <GospitalizationReferralTable patientId={patient.patient_id} />
      </div>
    )
}

export default PatientGospitalizationReferrals