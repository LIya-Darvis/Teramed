import { fetchData } from "./api";

export async function getUsers() {
    try {
        const { data, error, status } = await fetchData('get_users');

        if (error) {
            console.error('Ошибка получения данных пользователей:', error);
            return { error, status }; // Возвращаем объект с ошибкой и статусом
        }

        const usersData = data.map(user => ({
            ...user,
            role: {
                id: user.role_id,
                name: user.role_name,
            },
            photo: "",
        }));

        return { data: usersData, status }; // Возвращаем данные и статус ответа
    } catch (error) {
        console.error('Ошибка получения данных пользователей:', error);
        return { error: 'Ошибка сети', status: null }; // Возвращаем ошибку сети
    }
}

export async function fetchAccessiblePanelsForRole(roleId) {
    try {
        const { data, error, status } = await fetchData('fetch_accessible_panels', { role_id: roleId });

        if (error) {
            console.error('Ошибка при получении доступных панелей:', error);
            return { error, status };
        }

        return { data, status }; // Возвращаем данные и статус ответа
    } catch (error) {
        console.error('Ошибка при вызове функции fetch_accessible_panels:', error);
        return { error: 'Ошибка сети', status: null }; // Возвращаем ошибку сети
    }
}

export async function getDoctors() {
    try {
        const { data, error, status } = await fetchData('get_doctors');
        
        if (error) {
            console.error('Ошибка при получении данных о врачах:', error);
            return { error, status };
        }

        const doctorsData = data.map(doctor => ({
            id: doctor.doctor_id,
            id_position: doctor.position_id,
            position: {
                id: doctor.position_id,
                name: doctor.position_name
            },
            id_user: {
                id: doctor.user_id,
                username: doctor.username,
                login: doctor.login,
                password: doctor.password,
                photo: doctor.photo
            },
            is_archived: doctor.is_archived,
            is_available: doctor.is_available,
            lastname: doctor.lastname,
            name: doctor.name,
            surname: doctor.surname
        }));

        console.log("=> ", doctorsData)

        return { data: doctorsData, status };
    } catch (error) {
        console.error('Ошибка при вызове функции get_doctors:', error);
        return { error: 'Ошибка сети', status: null };
    }
}
