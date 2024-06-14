import React, { useEffect, useState } from 'react'
import ContentLabel from '../elements/components/ContentLabel'
import { useData } from '../../dataProviders/DataProvider';
import DiagnosesTable from '../elements/tables/DiagnosesTable';
import AnalysisTable from '../elements/tables/AnalysesTable';
import useRealtimeData from '../../dataProviders/useRealtimeData';
import AnalysisChart from '../elements/components/AnalysesChart';
import './styles.css';


function PatientMedCardPanel() {
  const { data, setData } = useData();

  const [showAnalyses, setShowAnalyses] = useState(false);
  const [showDiagnoses, setShowDiagnoses] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const analysesData = useRealtimeData('get_analyses').data;
  const diagnosesData = useRealtimeData('get_sick_histories').data;
  const patients = useRealtimeData('get_patients').data;

  const doctor = { position_name: "" };

  const filteredPatients = patients ? patients.filter(patient => patient.user_id === data.userData.id)[0]
   : [];

  const filteredAnalyses = analysesData ? analysesData.filter(analys => analys.patient_id === filteredPatients.patient_id)
   : [];

   const filteredDiagnoses = diagnosesData ? diagnosesData.filter(diagnos => diagnos.patient_id === filteredPatients.patient_id)
   : [];



  return (
    <div className='content_panel'>
      <ContentLabel title="Моя медицинская карта" />
      <div className="buttons_panel">
        <button className='top_panel_button' onClick={() => { setShowAnalyses(true); setShowDiagnoses(false); setShowStatistics(false);}}>Анализы</button>
        <button className='top_panel_button' onClick={() => { setShowDiagnoses(true); setShowAnalyses(false); setShowStatistics(false);}}>Диагнозы</button>
        <button className='top_panel_button' onClick={() => { setShowStatistics(true); setShowAnalyses(false); setShowDiagnoses(false);}}>Статистика анализов</button>
      </div>
      {showAnalyses && <AnalysisTable analysesData={filteredAnalyses} />}
      {showDiagnoses && <DiagnosesTable diagnosesData={filteredDiagnoses} doctorData={doctor} />}
      {showStatistics && <AnalysisChart analysTypeId={'d809b8ed-d1cb-43a2-a1c9-d29ce85509ae'} /> }
    </div>
  )
}


export default PatientMedCardPanel