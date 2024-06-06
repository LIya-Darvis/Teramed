import { supabase } from "../supabaseClient";

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