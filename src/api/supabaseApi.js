import { fetchData } from "./api";

export async function getUsers() {
    try {
        const { data, error, status } = await fetchData('get_users');
        if (error) {
            console.error('Ошибка получения данных пользователей:', error);
            return { error, status };
        }
        const usersData = data.map(user => ({
            ...user,
            id: user.iser_id,
            role: {
                id: user.role_id,
                name: user.role_name,
            },
            position: user.position_name,
            photo: "",
        }));
        return { data: usersData, status };
    } catch (error) {
        console.error('Ошибка получения данных пользователей:', error);
        return { error: 'Ошибка сети', status: null };
    }
}

export async function fetchAccessiblePanelsForRole(roleId) {
    try {
        const { data, error, status } = await fetchData('fetch_accessible_panels', { role_id: roleId });

        if (error) {
            console.error('Ошибка при получении доступных панелей:', error);
            return { error, status };
        }

        return { data, status };
    } catch (error) {
        console.error('Ошибка при вызове функции fetch_accessible_panels:', error);
        return { error: 'Ошибка сети', status: null };
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

        return { data: doctorsData, status };
    } catch (error) {
        console.error('Ошибка при вызове функции get_doctors:', error);
        return { error: 'Ошибка сети', status: null };
    }
}

export async function getPatients() {
    try {
        const { data, error, status } = await fetchData('get_patients');

        if (error) {
            console.error('Ошибка при получении данных о пациентах:', error);
            return { error, status };
        }

        const patientsData = data.map(patient => ({
            id: patient.patient_id,
            lastname: patient.lastname,
            name: patient.name,
            surname: patient.surname,
            address: patient.address,
            birthday: patient.birthday,
            email: patient.email,
            phone: patient.phone,
            gender: patient.gender_name,
            user: {
                id: patient.user_id,
                username: patient.username,
                login: patient.login,
                password: patient.password,
                photo: patient.user_photo,
                role: {
                    id: patient.role_id,
                    name: patient.role_name,
                },
            },
            is_archived: patient.is_archived,
            med_date: patient.med_date,
            passport_num: patient.passport_num,
            passport_series: patient.passport_series,
            photo: patient.patient_photo,
            polis_final_date: patient.polis_final_date,
            polis_num: patient.polis_num,
        }));

        return { data: patientsData, status };
    } catch (error) {
        console.error('Ошибка получения данных пациентов:', error);
        return { error: 'Ошибка сети', status: null };
    }
}


