import React, { useEffect, useState } from 'react'
import ContentLabel from '../elements/ContentLabel'
import PatientAnalysesTable from '../elements/PatientAnalysesTable'
import PatientSickHystoriesTable from '../elements/PatientSickHistoriesTable'
import { useData } from '../../components/DataProvider';
import { findPatientByUserId } from '../../components/fire_api';

function PatientLdmViewPanel() {
  const [patientData, setPatientData] = useState(null);
  const { data, setData } = useData();

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const patient = await findPatientByUserId(data.userData.id);
        setPatientData(patient);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    fetchPatientData();
  }, [patientData]);
  if (!patientData) {
    return <p>Loading...</p>;
  }

  console.log(patientData[0].id)

  return (
    <div className='content_panel'>
      <ContentLabel title="Моя медицинская карта" />

      <PatientAnalysesTable patientId={patientData[0].id} />
      <PatientSickHystoriesTable patientId={patientData[0].id} />

    </div>
  )
}

export default PatientLdmViewPanel