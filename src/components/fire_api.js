import { db } from "../firebase";
import { collection, getDocs, getDoc, doc, query, where, addDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { formatUsername, formatDate, formatTime, formatAges, calculateAges } from "./formations";
import { string } from "prop-types";

// для получения списка пользователей (в основном для авторизации)
export async function getUsers() {
    try {
        const usersCollectionRef = collection(db, 'Users');
        const usersSnapshot = await getDocs(usersCollectionRef);

        const usersData = [];
        for (const userDoc of usersSnapshot.docs) {
            const userData = userDoc.data();
            const roleId = userData.id_role;

            // получаем данные о ролях пользователей
            const roleDoc = await getDoc(doc(db, 'Roles', roleId.id));
            const roleData = roleDoc.data();

            const storage = getStorage();
            const photoRef = ref(storage, userData.photo);
            var photoUrl = await getDownloadURL(photoRef);

            const userWithRole = {
                id: userDoc.id,
                ...userData,
                role: roleData, // добавляем данные о роли в объект пользователя
                photo: photoUrl, // добавляем фотографию пользователя
            };
            usersData.push(userWithRole);
        }
        return usersData;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// добавление пользователя
export const addUser = async ({ roleId, login, password, photo, username }) => {
    console.log(roleId);
    console.log(doc(db, 'Roles', roleId.toString()))
    try {
        const userRef = await addDoc(collection(db, 'Users'), {
            id_role: doc(db, 'Roles', roleId.toString()),
            login,
            password,
            photo,
            username,
        });
        return userRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};

// для отображения панелей по доступу пользователя
export async function fetchAccessiblePanelsForRole(roleName) {
    try {
        const rolesQuerySnapshot = await getDocs(query(collection(db, 'Roles'), where('name', '==', roleName)));
        if (rolesQuerySnapshot.empty) {
            console.log('Роль ', roleName, ' не найдена');
            return;
        }
        const roleId = rolesQuerySnapshot.docs[0].id;

        // получаем доступы для заданной роли 
        const accessRightsQuerySnapshot = await getDocs(query(collection(db, 'Access_Rights'),
            where('id_role', '==', doc(db, 'Roles', roleId))));

        // получаем названия панелей на основе id_panel каждой записи в Access_Rights
        const panelNames = [];
        for (const docSnapshot of accessRightsQuerySnapshot.docs) {
            const accessRight = docSnapshot.data();
            const panelDoc = await getDoc(accessRight.id_panel);
            const panelName = panelDoc.data().name;
            panelNames.push(panelName);
        }
        return panelNames
    } catch (error) {
        console.error('Ошибка при получении доступных панелей: ', error);
    }
};

// для вывода всех врачей 
export async function getDoctors() {
    try {
        const doctorsCollectionRef = collection(db, 'Doctors');
        const doctorsSnapshot = await getDocs(doctorsCollectionRef);

        const doctorsData = [];
        for (const doctorsDoc of doctorsSnapshot.docs) {
            const doctorData = doctorsDoc.data();

            const userId = doctorData.id_user;
            const positionId = doctorData.id_position;

            // получаем пользовательские данные врачей
            const userDoc = await getDoc(doc(db, 'Users', userId.id));
            const userData = userDoc.data();

            // получаем должности врачей
            const positionDoc = await getDoc(doc(db, 'Positions', positionId.id));
            const positionData = positionDoc.data();

            const totalDoctorData = {
                id: doctorsDoc.id,
                ...doctorData,  // добавляем прочие данные с атрибутами по умолчанию
                id_user: userData, // добавляем пользовательские данные
                position: positionData, // добавляем должность специалиста
                is_archived: doctorData.is_archived,
            };
            doctorsData.push(totalDoctorData);
        }
        return doctorsData;
    } catch (error) {
        console.error('Error fetching doctors:', error);
    }
}

// добавление врача
export const addDoctor = async ({ positionId, userId, isArchived, isAvailable, lastname, name, surname }) => {
    try {
        const doctor = {
            id_position: doc(db, 'Positions', positionId),
            id_user: doc(db, 'Users', userId),
            is_archived: isArchived,
            id_available: isAvailable,
            lastname: lastname,
            name: name,
            surname: surname,
        };
        const docRef = await addDoc(collection(db, "Doctors"), doctor);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};

// для получения всех должностей врачей
export async function getPositions() {
    try {
        const positionsCollectionRef = collection(db, 'Positions');
        const positionsSnapshot = await getDocs(positionsCollectionRef);

        const positionsData = [];
        for (const positionDoc of positionsSnapshot.docs) {
            const positionData = positionDoc.data();

            const totalPositionData = {
                id: positionDoc.id,
                name: positionData.name,
            };
            positionsData.push(totalPositionData);
        }
        return positionsData;
    } catch (error) {
        console.error('Error fetching positions:', error);
    }
}

// для получения пола
export async function getGenders() {
    try {
        const gendersCollectionRef = collection(db, 'Genders');
        const gendersSnapshot = await getDocs(gendersCollectionRef);

        const gendersData = [];
        for (const genderDoc of gendersSnapshot.docs) {
            const genderData = genderDoc.data();

            const totalGendersData = {
                id: genderDoc.id,
                name: genderData.name,
            };
            gendersData.push(totalGendersData);
        }
        return gendersData;
    } catch (error) {
        console.error('Error fetching genders:', error);
    }
}

// для получения данных пациентов
export async function getPatients() {
    try {
        const patientsCollectionRef = collection(db, 'Patients');
        const patientsSnapshot = await getDocs(patientsCollectionRef);

        const patientsData = [];
        for (const patientsDoc of patientsSnapshot.docs) {
            const patientData = patientsDoc.data();

            const userId = patientData.id_user;
            const genderId = patientData.id_gender;

            // получаем пользовательские данные пациентов
            const userDoc = await getDoc(doc(db, 'Users', userId.id));
            const userData = userDoc.data();

            // получаем пользовательские данные пациентов
            const genderDoc = await getDoc(doc(db, 'Genders', genderId.id));
            const genderData = genderDoc.data();

            const storage = getStorage();
            const photoRef = ref(storage, patientData.photo);
            var photoUrl = await getDownloadURL(photoRef);

            // форматирование даты
            const patientBirthday = formatDate(patientData.birthday.toDate());

            const age = formatAges(calculateAges(patientData.birthday.toDate()))

            const totalPatientData = {
                id: patientsDoc.id,
                ...patientData,  // добавляем прочие данные с атрибутами по умолчанию
                birthday: patientBirthday,
                age: age,
                med_date: formatDate(patientData.med_date.toDate()),
                polis_final_date: formatDate(patientData.polis_final_date.toDate()),
                id_user: userData, // добавляем данные о роли в объект пользователя
                gender: genderData, // добавляем фотографию пользователя
                photo: photoUrl, // добавляем фото пациента
            };
            patientsData.push(totalPatientData);
        }
        return patientsData;
    } catch (error) {
        console.error('Error fetching patients:', error);
    }
}

// добавление пациента
export const addPatient = async ({
    address, birthday, email, genderId, userId, isArchived, lastname,
    medDate, name, passportNum, passportSeries, phone, photo, polisFinalDate, polisNum, surname
}) => {
    try {
        const patient = {
            address: address,
            birthday: new Date(birthday),
            email: email,
            id_gender: doc(db, 'Genders', genderId),
            id_user: doc(db, 'Users', userId),
            is_archived: false,
            lastname: lastname,
            med_date: new Date(medDate),
            name: name,
            passport_num: passportNum,
            passport_series: passportSeries,
            phone: phone,
            photo: 'patients_photo/49fbsk4.jfif',
            polis_final_date: new Date(polisFinalDate),
            polis_num: polisNum,
            surname: surname,
        };
        const docRef = await addDoc(collection(db, "Patients"), patient);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};

// получение пациента по id
export async function getPatientById(patientId) {
    try {
        // Получаем данные всех пациентов
        const patientsData = await getPatients();

        // Ищем данные пациента по patientId
        const patient = patientsData.find(p => p.id === patientId);

        if (!patient) {
            throw new Error(`Patient with id ${patientId} not found.`);
        }

        return patient;
    } catch (error) {
        console.error('Error fetching patient by ID:', error);
        return null;
    }
}

// получение типов анализов
export const getAnalysTypes = async () => {
    try {
        const analysTypesCollectionRef = collection(db, 'Analys_Types');
        const analysTypesSnapshot = await getDocs(analysTypesCollectionRef);
        const analysTypesData = analysTypesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return analysTypesData;
    } catch (error) {
        console.error('Error fetching analysis types:', error);
        throw error;
    }
};

// добавление анализа пациента
export const addAnalysis = async ({ comment, analysTypeId, doctorId, patientId, value }) => {
    try {
        const analysis = {
            analys_date: Timestamp.fromDate(new Date()), // Текущая дата
            comment: comment,
            id_analys_type: doc(db, 'Analys_Types', analysTypeId), // Преобразование в ссылку
            id_doctor: doc(db, 'Doctors', doctorId), // Преобразование в ссылку
            id_patient: doc(db, 'Patients', patientId), // Преобразование в ссылку
            value: value
        };
        const docRef = await addDoc(collection(db, "Analyses"), analysis);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};

// для выгрузки всех типов лдм
export async function getLdmTypes() {
    try {
        const ldmTypesCollectionRef = collection(db, 'Ldm_Types');
        const ldmTypesSnapshot = await getDocs(ldmTypesCollectionRef);
        const ldmTypesData = [];
        ldmTypesSnapshot.forEach(doc => {
            ldmTypesData.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return ldmTypesData;
    } catch (error) {
        console.error('Ошибка при получении типов ЛДМ:', error);
        return [];
    }
}

// для получения всех лдм
export async function getLdms() {
    try {
        const ldmsCollectionRef = collection(db, 'Ldms');
        const ldmsSnapshot = await getDocs(ldmsCollectionRef);

        const ldmsData = [];
        for (const ldmDoc of ldmsSnapshot.docs) {
            const ldmData = ldmDoc.data();
            const positionId = ldmData.id_position;
            const ldmTypeId = ldmData.id_ldm_type;

            // получаем данные о специальности врачей
            const positionDoc = await getDoc(doc(db, 'Positions', positionId.id));
            const positionData = positionDoc.data();

            // получаем данные о типам лдм
            const ldmTypeDoc = await getDoc(doc(db, 'Ldm_Types', ldmTypeId.id));
            const ldmTypeData = ldmTypeDoc.data();

            // console.log(ldmTypeData.name)

            const totalLdmData = {
                id: ldmDoc.id,
                ...ldmData,
                id_position: positionId,
                time: ldmData.time,
                position: positionData, // добавляем данные о должности специалиста
                ldm_type: ldmTypeData, // добавляем данные о типе лдм
            };
            ldmsData.push(totalLdmData);
        }

        // console.log(ldmsData);
        return ldmsData;
    } catch (error) {
        console.error('Error fetching ldms:', error);
    }
}

// для получения пациента по id пользователя
export async function findPatientByUserId(userId) {
    try {
        const patientsQuery = query(collection(db, 'Patients'), where('id_user', '==', doc(db, 'Users', userId)));
        const patientsSnapshot = await getDocs(patientsQuery);
        const patients = [];
        patientsSnapshot.forEach((doc) => {
            const patientData = doc.data();
            patients.push({
                id: doc.id,
                ...patientData
            });
        });
        return patients;
    } catch (error) {
        console.error('Ошибка при поиске пациента по id пользователя:', error);
        return [];
    }
}

// для получения специалиста по id должности
export async function findDoctorByPositionId(positionId) {
    try {
        // console.log(positionId)
        const doctorsQuery = query(collection(db, 'Doctors'), where('id_position', '==', doc(db, 'Positions', positionId.id)));
        const doctorsSnapshot = await getDocs(doctorsQuery);
        const doctors = [];
        doctorsSnapshot.forEach((doc) => {
            const doctorData = doc.data();
            doctors.push({
                id: doc.id,
                ...doctorData
            });
        });
        return doctors;
    } catch (error) {
        console.error('Ошибка при поиске специалиста по id должности:', error);
        return [];
    }
}

// получаем расположение специалистов и кабинетов
export async function getDoctorLocationsByPositionId(positionId) {
    try {
        const doctors = await findDoctorByPositionId(positionId);
        console.log(doctors[0].id)
        const doctorLocationsQuery = query(collection(db, 'Doctor_Locations'),
            where('id_doctor', '==', doc(db, 'Doctors', doctors[0].id)));
        const doctorLocationsSnapshot = await getDocs(doctorLocationsQuery);
        const doctorLocations = [];

        doctorLocationsSnapshot.forEach((doc) => {
            const doctorLocationData = doc.data();
            doctorLocations.push({
                id: doc.id,
                ...doctorLocationData
            });
        });

        return doctorLocations;
    } catch (error) {
        console.error('Ошибка при получении записей Doctor_Locations:', error);
        return [];
    }
}

// получить все записи о приемах
export async function getAppointments() {
    try {
        const appointmentsCollectionRef = collection(db, 'Appointments');
        const appointmentsSnapshot = await getDocs(appointmentsCollectionRef);
        const appointmentsData = [];

        for (const appointmentDoc of appointmentsSnapshot.docs) {
            const appointmentData = appointmentDoc.data();
            const doctorLocationDoc = await getDoc(appointmentData.id_doctor_location);
            const doctorLocationData = doctorLocationDoc.data();
            const doctorDoc = await getDoc(doctorLocationData.id_doctor);
            const doctorData = doctorDoc.data();
            const cabinetDoc = await getDoc(doctorLocationData.id_cabinet);
            const cabinetData = cabinetDoc.data();
            const ldmDoc = await getDoc(appointmentData.id_ldm);
            const ldmData = ldmDoc.data();
            const patientDoc = await getDoc(appointmentData.id_patient);
            const patientData = patientDoc.data();

            const appointmentDate = appointmentData.ldm_datetime.toDate();

            appointmentsData.push({
                id: appointmentDoc.id,
                doctor: doctorData,
                room: cabinetData,
                datetime: appointmentDate,
                event: ldmData,
                patient: patientData,
                doctor_location: doctorLocationData,
                id_patient: appointmentData.id_patient.id,
                ...appointmentData
            });
        }

        return appointmentsData;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return [];
    }
}

// для добавления новой записи на прием
export async function uploadDataToAppointment(idPatient, idDoctorLocation, idLdm, ldmDatetime, isConfirmed, complaints) {
    try {
        // создаем ссылки на другие объекты
        const patientRef = doc(db, 'Patients', idPatient);
        const doctorLocationRef = doc(db, 'Doctor_Locations', idDoctorLocation);
        const ldmRef = doc(db, 'Ldms', idLdm);

        // Добавляем новый документ в коллекцию Ldms
        await addDoc(collection(db, 'Appointments'), {
            id_patient: patientRef,
            id_doctor_location: doctorLocationRef,
            id_ldm: ldmRef,
            ldm_datetime: ldmDatetime,
            is_confirmed: isConfirmed,
            complaints: complaints
        });
        console.log('Данные успешно загружены в коллекцию Appointments');
    } catch (error) {
        console.error('Ошибка при загрузке данных в коллекцию Appointments:', error);
    }
}

// для получения записей приема для определенного пациента (по id пользователя)
export async function getPatientAppointmentsByUserId(userId) {
    try {
        const patients = await findPatientByUserId(userId);

        const appointmentsCollectionRef = collection(db, 'Appointments');
        const q = query(appointmentsCollectionRef, where('id_patient', '==', doc(db, 'Patients', patients[0].id)));
        const appointmentsSnapshot = await getDocs(q);

        // console.log(appointmentsSnapshot.docs)

        const appointmentsData = [];
        for (const appointmentDoc of appointmentsSnapshot.docs) {
            const appointmentData = appointmentDoc.data();

            const doctorLocationId = appointmentData.id_doctor_location;
            const doctorLocationDoc = await getDoc(doc(db, 'Doctor_Locations', doctorLocationId.id));
            const doctorLocationData = doctorLocationDoc.data();

            const idCabinet = doctorLocationData.id_cabinet;
            const cabinetDoc = await getDoc(doc(db, 'Cabinets', idCabinet.id));
            const cabinetData = cabinetDoc.data();

            const idDoctor = doctorLocationData.id_doctor;
            const doctorDoc = await getDoc(doc(db, 'Doctors', idDoctor.id));
            const doctorData = doctorDoc.data();

            const idLdm = appointmentData.id_ldm;
            const ldmDoc = await getDoc(doc(db, 'Ldms', idLdm.id));
            const ldmData = ldmDoc.data();

            const idPatient = appointmentData.id_patient;
            const patientDoc = await getDoc(doc(db, 'Patients', idPatient.id));
            const patientData = patientDoc.data();

            console.log(appointmentData.ldm_datetime)

            const ldmDate = formatDate(appointmentData.ldm_datetime.toDate());
            const ldmTime = formatTime(appointmentData.ldm_datetime.toDate());

            const appointment = {
                id: appointmentDoc.id,
                patient: patientData,
                doctor: doctorData,
                cabinet: cabinetData.num,
                ldm_name: ldmData,
                ldm_date: ldmDate,
                ldm_time: ldmTime,
            };
            appointmentsData.push(appointment);
        }

        return appointmentsData;
    } catch (error) {
        console.error('Ошибка при получении записей Appointments пациента:', error);
        return [];
    }
}

// для получения данных врача по id пользователя
export const getDoctorByUserId = async (userId) => {
    try {
        // Запрос на получение всех документов из коллекции Doctors, где id_user равно userId
        const doctorsQuerySnapshot = await getDocs(
            query(collection(db, "Doctors"), where("id_user", "==", doc(db, "Users", userId)))
        );

        if (doctorsQuerySnapshot.empty) {
            throw new Error("Doctor not found");
        }

        // Предполагается, что один пользователь соответствует одному врачу
        const doctorDoc = doctorsQuerySnapshot.docs[0];
        const doctorData = doctorDoc.data();

        // Получение данных из коллекции Positions
        const positionRef = doctorData.id_position;
        const positionDoc = await getDoc(positionRef);
        const positionData = positionDoc.exists() ? positionDoc.data() : null;

        // Получение данных из коллекции Users
        const userRef = doctorData.id_user;
        const userDoc = await getDoc(userRef);
        const userData = userDoc.exists() ? userDoc.data() : null;

        return {
            id: doctorDoc.id,
            doctor: doctorData,
            position: positionData,
            user: userData,
            ...doctorData
        };
    } catch (error) {
        console.error("Error getting doctor by user ID:", error);
        throw error;
    }
};

// для фильтрации лдм для каждого врача и времени
export async function getFilteredAppointmentsByDoctorId(doctorId) {
    try {
        // Получение всех назначений
        const allAppointments = await getAppointments();

        // Фильтрация назначений по id врача и дате
        const filteredAppointments = allAppointments.filter(appointment => {
            const appointmentDate = new Date(appointment.datetime);
            const today = new Date();
            const oneWeekAhead = new Date();
            oneWeekAhead.setDate(today.getDate() + 7);

            return appointment.doctor_location.id_doctor.id === doctorId &&
                appointmentDate >= today &&
                appointmentDate <= oneWeekAhead;
        });

        // Преобразование данных в нужный формат
        const formattedAppointments = filteredAppointments.map(appointment => ({
            id: appointment.id,
            doctor: appointment.doctor,
            room: appointment.room,
            datetime: appointment.datetime,
            event: appointment.event,
            patient: appointment.patient,
            id_patient: appointment.id_patient
        }));

        return formattedAppointments;
    } catch (error) {
        console.error('Error filtering appointments:', error);
        return [];
    }
}

// для фильтрации лдм для каждого пациента
export async function getFilteredAppointmentsByPatientId(patientId) {
    console.log(patientId)
    try {
        // Получение всех назначений
        const allAppointments = await getAppointments();

        // Фильтрация назначений по id врача и дате
        const filteredAppointments = allAppointments.filter(appointment => {
            return appointment.id_patient.id === patientId;
        });

        console.log(filteredAppointments)

        // Преобразование данных в нужный формат
        const formattedAppointments = filteredAppointments.map(appointment => ({
            id: appointment.id,
            doctor: appointment.doctor,
            room: appointment.room,
            datetime: appointment.datetime,
            event: appointment.event,
            patient: appointment.patient,
            id_patient: appointment.id_patient
        }));

        return formattedAppointments;
    } catch (error) {
        console.error('Error filtering appointments:', error);
        return [];
    }
}

// для добавления нового врача
export async function uploadDoctorData(lastname, name, surname, idPosition, isAvailable, login, password) {
    try {
        // создаем ссылки на другие объекты
        const positionRef = doc(db, 'Positions', idPosition);
        const roleRef = doc(db, 'Roles', '2');
        const doctorPhoto = 'users_avatar/doctor.png';
        const username = formatUsername(lastname, name, surname);
        var newUserId = null;

        // добавляем новый документ в коллекцию пользователей
        const userRef = await addDoc(collection(db, 'Users'), {
            id_role: roleRef,
            username: username,
            login: login,
            password: password,
            photo: doctorPhoto,
        });

        // добавляем новый документ в коллекцию врачей
        await addDoc(collection(db, 'Doctors'), {
            lastname: lastname,
            name: name,
            surname: surname,
            id_position: positionRef,
            id_user: userRef,
            id_available: isAvailable,
        });
        console.log('Данные успешно загружены в коллекцию Doctors');
    } catch (error) {
        console.error('Ошибка при загрузке данных в коллекцию Doctors:', error);
    }
}

// для обновления записи в коллекции врачей
export async function updateDoctorData(doctorId, lastname, name, surname, idPosition, isAvailable) {
    try {
        const positionRef = doc(db, 'Positions', idPosition);

        const newData = {
            lastname: lastname,
            name: name,
            surname: surname,
            id_position: positionRef,
            is_available: isAvailable,
        };

        const doctorRef = doc(db, 'Doctors', doctorId);
        await updateDoc(doctorRef, newData);

        console.log('Данные успешно обновлены для врача с Id:', doctorId);
    } catch (error) {
        console.error('Ошибка при обновлении данных для врача:', error);
    }
}

// для архивации записи врача (полное удаление приведет к некорректным связям в других таблицах)
export async function deleteDoctorData(doctorId) {
    try {
        const newData = {
            is_archived: true,
        };

        const doctorRef = doc(db, "Doctors", doctorId);
        await updateDoc(doctorRef, newData);

        console.log("Доктор успешно удален(архивирован)");
    } catch (error) {
        console.error("Ошибка при удалении(архивации) врача:", error);
    }
}

// для получения истории болезней определенного пациента
export async function getPatientSickHistoryById(patientId) {
    console.log(patientId)
    try {

        const sickHistoriesQuery = query(collection(db, 'Sick_Histories'), where('id_patient', '==', doc(db, 'Patients', patientId)));
        const sickHistoriesSnapshot = await getDocs(sickHistoriesQuery);

        console.log(sickHistoriesSnapshot.docs)
        const sickHistories = [];

        for (const eachDoc of sickHistoriesSnapshot.docs) {
            const sickHistoryData = eachDoc.data();

            const idDoctor = sickHistoryData.id_doctor;
            const doctorDoc = await getDoc(doc(db, 'Doctors', idDoctor.id));
            const doctorData = doctorDoc.data();

            const idDiagnos = sickHistoryData.id_diagnos;
            const diagnosDoc = await getDoc(doc(db, 'Diagnoses', idDiagnos.id));
            const diagnosData = diagnosDoc.data();

            const diagnosDate = formatDate(sickHistoryData.diagnos_date.toDate());

            sickHistories.push({
                id: eachDoc.id,
                doctor: doctorData,
                diagnos: diagnosData.name,
                diagnosDate: diagnosDate,
                ...sickHistoryData
            });
        };
        return sickHistories;
    } catch (error) {
        console.error('Ошибка при получении записей Sick_Histories:', error);
        return [];
    }
}

// для получения всех анализов определенного пациента
export async function getPatientAnalysesById(patientId) {
    try {

        const analysesQuery = query(collection(db, 'Analyses'), where('id_patient', '==', doc(db, 'Patients', patientId)));
        const analysesSnapshot = await getDocs(analysesQuery);

        console.log(analysesSnapshot.docs)
        const analyses = [];

        for (const eachDoc of analysesSnapshot.docs) {
            const analysData = eachDoc.data();

            const idDoctor = analysData.id_doctor;
            const doctorDoc = await getDoc(doc(db, 'Doctors', idDoctor.id));
            const doctorData = doctorDoc.data();

            const idAnalysType = analysData.id_analys_type;
            const analysTypeDoc = await getDoc(doc(db, 'Analys_Types', idAnalysType.id));
            const analysTypeData = analysTypeDoc.data();

            const analysDate = formatDate(analysData.analys_date.toDate());

            analyses.push({
                id: eachDoc.id,
                doctor: doctorData,
                analysType: analysTypeData,
                analysDate: analysDate,
                ...analysData
            });
        };
        return analyses;
    } catch (error) {
        console.error('Ошибка при получении записей Analyses:', error);
        return [];
    }
}

export async function addAppointmentReferral(idDoctorLocation, idLdm, idPatient, idReferralMaker) {
    try {
        // Создаем ссылки на документы
        const doctorLocationRef = doc(db, 'Doctor_Locations', idDoctorLocation);
        const ldmRef = doc(db, 'Ldms', idLdm);
        const patientRef = doc(db, 'Patients', idPatient);
        const referralMakerRef = doc(db, 'Doctors', idReferralMaker);

        // Создаем новый документ в коллекции Appointments
        await addDoc(collection(db, 'Appointment_Referrals'), {
            id_doctor_location: doctorLocationRef,
            id_ldm: ldmRef,
            id_patient: patientRef,
            id_referral_maker: referralMakerRef,
            is_confirmed: false
        });

        console.log('Referral successfully added!');
    } catch (error) {
        console.error('Error adding referral: ', error);
    }
}

export const addGospitalizationReferral = async ({ patientId, statusId, terapevtId, reason, startDate }) => {
    try {
        const gospitalizationReferral = {
            creation_date: Timestamp.fromDate(new Date()), // Текущая дата
            id_patient: doc(db, 'Patients', patientId), // Преобразование в ссылку
            id_status: doc(db, 'Referral_Statuses', statusId), // Преобразование в ссылку
            id_terapevt: doc(db, 'Doctors', terapevtId), // Преобразование в ссылку
            reason: reason,
            start_date: Timestamp.fromDate(new Date(startDate)), // Преобразование startDate в Timestamp
        };
        const docRef = await addDoc(collection(db, "Gospitalization_Referrals"), gospitalizationReferral);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};





