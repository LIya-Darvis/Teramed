import axios from 'axios';
import { fetchData } from "./api";
import { supabase } from "./supabaseClient";

export async function uploadPhoto(file) {

    const folder = 'user_avatars';
    const fileName = `${Date.now()}_${file.name}`;
    const url = `https://eqldiylnpfriitiycqga.supabase.co/storage/v1/object/public/TeramedStorage/${folder}/${fileName}`;

    const anonKey = '4440dcf4cef2b7ecf29154e706a1598b';

    console.log(url)

    const headers = {
        'Content-Type': file.type,
        Authorization: `Bearer ${anonKey}`,
    };

    // const { data, error } = await supabase.storage.from('public/TeramedStorage').upload('user_avatars', file)
    try {
        const response = await axios.put(url, file, { headers }); // Используйте put вместо post
        console.log('File uploaded successfully:', response.data);
        return url; // Верните URL загруженного файла
    } catch (error) {
        console.error('Error uploading file:', error.message);
        console.error('Error response:', error.response);
    }

    // const folder = 'user_avatars';
    // const fileName = `${Date.now()}_${file.name}`;
    // const url = `https://eqldiylnpfriitiycqga.supabase.co/storage/v1/object/public/TeramedStorage/${folder}/${fileName}`;

    // const anonKey = '4440dcf4cef2b7ecf29154e706a1598b';

    // console.log("=> ", url);

    // const headers = {
    //     'Content-Type': file.type,
    //     Authorization: `${anonKey}`,
    // };

    // try {
    //     const response = await axios.post(url, file, { headers });
    //     console.log('File uploaded successfully:', response.data);
    //   } catch (error) {
    //     console.error('Error uploading file:', error.message);
    //     console.error('Error response:', error.response);
    //   }

    // try {
    //     const { data, error } = await supabase.storage
    //         .from("public/TeramedStorage/user_avatars") // Название папки в хранилище
    //         .upload(fileName, file); // Загружаем файл

    //     if (error) {
    //         throw error;
    //     }

    //     console.log('File uploaded successfully:', data);
    // } catch (error) {
    //     console.error('Error uploading file:', error.message);
    // }
}

export async function getUsers() {
    try {
        const { data, error, status } = await fetchData('get_users');
        if (error) {
            console.error('Ошибка получения данных пользователей:', error);
            return { error, status };
        }
        const usersData = data.map(user => ({
            ...user,
            id: user.user_id,
            role: {
                id: user.role_id,
                name: user.role_name,
            },
            position: user.position_name,
            photo: user.photo,
        }));
        console.log("=> ", usersData);
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

export async function fetchPositions() {
    const { data, error } = await fetchData('get_positions');
    if (error) {
        console.error('Error fetching positions:', error);
        throw error;
    }
    return data;
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

export async function getSickHistories() {
    const { data, error } = await fetchData('get_sick_histories');

    if (error) {
        console.error('Error fetching sick histories:', error);
        return [];
    }

    return data;
}

export async function addAnalysis(analysisData) {
    const { data, error } = await fetchData('add_analysis', {
        p_analys_date: analysisData.analys_date,
        p_comment: analysisData.comment,
        p_id_analys_type: analysisData.id_analys_type,
        p_id_doctor: analysisData.id_doctor,
        p_id_patient: analysisData.id_patient,
        p_value: analysisData.value,
    });

    if (error) {
        console.error('Error adding analysis:', error);
    } else {
        console.log('Analysis added successfully:', data);
    }
};

export async function addUserAndDoctor(userDetails, doctorDetails, photoURL) {
    const { username, login, password } = userDetails;
    const { id_position, is_archived, is_available, lastname, name, surname } = doctorDetails;

    console.log(id_position, is_archived, is_available, lastname, name, surname);

    try {
        const { data, error } = await supabase.rpc('add_user_and_doctor', {
            _username: username,
            _login: login,
            _password: password,
            _photo: photoURL || '',
            _id_position: id_position,
            _is_archived: false,
            _is_available: is_available,
            _lastname: lastname,
            _name: name,
            _surname: surname
        });

        if (error) {
            console.error('RPC Error:', error);
            throw new Error(error.message);
        }

        const { user_id: userId, doctor_id: doctorId } = data[0];
        console.log('User ID:', userId);
        console.log('Doctor ID:', doctorId);

        return { userId, doctorId };
    } catch (error) {
        console.error('Error adding user and doctor:', error.message);
        return null;
    }


}

export async function addUserAndPatient(userDetails, patientDetails, photoURL) {
    const { username, login, password } = userDetails;
    const { id_gender, is_archived, lastname, name, surname, address, birthday, email, phone, med_date, passport_num, passport_series, polis_final_date, polis_num } = patientDetails;

    const today = new Date();

    try {
        const { data, error } = await supabase.rpc('add_user_and_patient', {
            _username: username,
            _login: login,
            _password: password,
            _photo: photoURL || '',
            _id_gender: id_gender,
            _is_archived: is_archived,
            _lastname: lastname,
            _name: name,
            _surname: surname,
            _address: address,
            _birthday: birthday,
            _email: email,
            _phone: phone,
            _med_date: today,
            _passport_num: passport_num,
            _passport_series: passport_series,
            _polis_final_date: polis_final_date,
            _polis_num: polis_num
        });

        if (error) {
            console.error('RPC Error:', error);
            throw new Error(error.message);
        }

        const { user_id: userId, patient_id: patientId } = data[0];
        console.log('User ID:', userId);
        console.log('Patient ID:', patientId);

        return { userId, patientId };
    } catch (error) {
        console.error('Error adding user and patient:', error.message);
        return null;
    }
}

export async function addDiagnosis(diagnosisData) {
    const { data, error } = await fetchData('add_diagnosis', {
        p_diagnos_date: diagnosisData.diagnos_date,
        p_id_diagnos: diagnosisData.id_diagnos,
        p_id_doctor: diagnosisData.id_doctor,
        p_id_patient: diagnosisData.id_patient,
        p_is_confirmed: diagnosisData.is_confirmed,
        p_recomendations: diagnosisData.recomendations,
        p_symptoms: diagnosisData.symptoms,
        p_id_therapist: 'f1663231-7522-4d07-a12c-bb59b332626f',
    });

    if (error) {
        console.error('Error adding diagnosis:', error);
    } else {
        console.log('Diagnosis added successfully:', data);
    }
}

export async function updateSickHistory(id, isConfirmed, therapistId) {
    const { data, error } = await supabase.rpc('update_sick_history', {
        p_id: id,
        p_is_confirmed: isConfirmed,
        p_id_therapist: therapistId
    });

    if (error) {
        console.error('Error updating sick history:', error);
        return null;
    }

    return data;
}

export const addAppointment = async (appointmentData) => {
    const { complaints, id_doctor_location, id_ldm, id_patient, is_confirmed, ldm_datetime } = appointmentData;

    const { data, error } = await supabase
        .rpc('add_appointment', {
            p_complaints: complaints,
            p_id_doctor_location: id_doctor_location,
            p_id_ldm: id_ldm,
            p_id_patient: id_patient,
            p_is_confirmed: is_confirmed,
            p_ldm_datetime: ldm_datetime
        });

    if (error) {
        console.error('Error adding appointment:', error);
        throw error;
    }

    return data;
};

export async function addAppointmentReferral(appointmentData) {
    try {
        const { data, error } = await supabase.rpc('add_appointment_referral', appointmentData);
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        throw error;
    }
}

