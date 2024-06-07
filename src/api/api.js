import { supabase } from "./supabaseClient";

export async function fetchData(endpoint, params = {}) {
    try {
        const { data, error, status } = await supabase.rpc(endpoint, params);

        if (error) {
            console.error(`Ошибка получения данных с сервера (${endpoint}):`, error);
            return { data: null, error, status }; // Возвращаем объект с данными, ошибкой и статусом
        }

        return { data, error: null, status }; // Возвращаем данные, ошибку и статус ответа
    } catch (error) {
        console.error(`Ошибка получения данных с сервера (${endpoint}):`, error);
        return { data: null, error: 'Ошибка сети', status: null }; // Возвращаем ошибку сети
    }
}

export function subscribeToData(endpoint, params, dispatch) {
    const subscription = supabase
        .from(endpoint)
        .on('*', async () => {
            const { data, error, status } = await fetchData(endpoint, params);

            if (error) {
                dispatch({ type: 'data/fetchError', payload: { endpoint, error } });
            } else {
                dispatch({ type: 'data/fetchSuccess', payload: { endpoint, data } });
            }
        })
        .subscribe();

    return subscription;
}