import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData, subscribeToData } from '../api/api';
import { updateData } from './dataSlice';

const useRealtimeData = (endpoint, params) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data[endpoint]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataInterval = async () => {
      try {
        const response = await fetchData(endpoint, params);
        if (response.error) {
          throw new Error(response.error.message);
        }
        dispatch(updateData({ endpoint, data: response.data }));
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchDataInterval();
    const intervalId = setInterval(fetchDataInterval, 3000);

    return () => clearInterval(intervalId);
  }, [dispatch, endpoint, params]);
  return { data, loading, error };
};

export default useRealtimeData;