import React from 'react';
import useRealtimeData from './useRealtimeData';

const DataDisplay = ({ endpoint, params, render }) => {
    const { data, loading, error } = useRealtimeData(endpoint, params);
    if (loading) {
        return <p>Загрузка...</p>;
    }
    if (error) {
        return <p>Ошибка: {error.message}</p>;
    }
    return render(data);
};

export default DataDisplay;
