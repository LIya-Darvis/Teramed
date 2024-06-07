import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData, subscribeToData } from '../api/api';
import { updateData } from './dataSlice';

const useRealtimeData = (endpoint) => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.data[endpoint]);
  
    useEffect(() => {
      const fetchDataInterval = async () => {
        try {
          const { data } = await fetchData(endpoint);
          dispatch(updateData({ endpoint, data }));
        } catch (error) {
          console.error('Ошибка получения данных:', error);
        }
      };
  
      fetchDataInterval(); // Сразу получаем данные при монтировании компонента
      const intervalId = setInterval(fetchDataInterval, 3000); // Обновление каждые 3 секунды
  
      return () => clearInterval(intervalId); // Очистка интервала при размонтировании
    }, [dispatch, endpoint]);
  
    return data;
  };

export default useRealtimeData;