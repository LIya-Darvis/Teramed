import React, { useState, useEffect } from 'react';
import ModalEditText from '../components/ModalEditText';
import { DropdownListDiagnoses } from '../components/DropdownLists';
import { addAnalysis, getAnalysTypes } from '../../../api/fire_api';

export function AddAnalysisForm({ doctorId, patientId }) {
  const [analysTypes, setAnalysTypes] = useState([]);
  const [selectedAnalysType, setSelectedAnalysType] = useState('');
  const [comment, setComment] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    async function fetchAnalysTypes() {
      try {
        const types = await getAnalysTypes();
        setAnalysTypes(types);
      } catch (error) {
        console.error('Error fetching analysis types:', error);
      }
    }
    fetchAnalysTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addAnalysis({
        comment,
        analysTypeId: selectedAnalysType,
        doctorId,
        patientId,
        value
      });
      // Очистка формы или другое действие после успешного добавления
      setComment('');
      setValue('');
      setSelectedAnalysType('');
    } catch (error) {
      console.error('Error adding analysis:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DropdownListDiagnoses
        options={analysTypes}
        value={selectedAnalysType}
        onChange={(e) => setSelectedAnalysType(e.target.value)}
        placeholder="Выберите тип анализа"
      />
      <ModalEditText
        placeholder="Комментарий"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <ModalEditText
        placeholder="Значение"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button style={form_button} type="submit">Добавить анализ</button>
    </form>
  );
}

const form_button = {
  margin: '20px 0px',
  padding: '10px',
  backgroundColor: '#4B5672',
  color: '#fff',
  borderRadius: '4px'
}