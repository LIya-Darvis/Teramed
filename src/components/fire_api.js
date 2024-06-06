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

        const roleIds = usersSnapshot.docs.map(userDoc => userDoc.data().id_role.id);
        const rolesSnapshot = await getDocs(query(collection(db, 'Roles'), where('__name__', 'in', roleIds)));

        const roles = {};
        rolesSnapshot.forEach(doc => {
            roles[doc.id] = doc.data();
        });

        const usersData = await Promise.all(usersSnapshot.docs.map(async (userDoc) => {
            const userData = userDoc.data();
            const roleId = userData.id_role.id;
            const roleData = roles[roleId];

            return {
                id: userDoc.id,
                ...userData,
                role: roleData,
                photo: "",
            };
        }));

        return usersData;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// добавление пользователя
export const addUser = async ({ roleId, login, password, photo, username }) => {
    try {
        const userRef = await addDoc(collection(db, 'Users'), {
            id_role: doc(db, 'Roles', roleId.toString()),
            login,
            password,
            photo: "",
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
            return [];
        }
        const roleId = rolesQuerySnapshot.docs[0].id;

        // Получаем доступы для заданной роли 
        const accessRightsQuerySnapshot = await getDocs(query(collection(db, 'Access_Rights'), where('id_role', '==', doc(db, 'Roles', roleId))));

        // Собираем все id панелей
        const panelIds = accessRightsQuerySnapshot.docs.map(docSnapshot => docSnapshot.data().id_panel.id);
        if (panelIds.length === 0) return [];

        // Получаем данные всех панелей за один запрос
        const panelsSnapshot = await getDocs(query(collection(db, 'Panels'), where('__name__', 'in', panelIds)));

        // Создаем массив названий панелей
        const panelNames = panelsSnapshot.docs.map(panelDoc => panelDoc.data().name);

        return panelNames;
    } catch (error) {
        console.error('Ошибка при получении доступных панелей: ', error);
        return [];
    }
};

// для вывода всех врачей 
export async function getDoctors() {
    try {
        const doctorsCollectionRef = collection(db, 'Doctors');
        const doctorsSnapshot = await getDocs(doctorsCollectionRef);

        const userIds = [];
        const positionIds = [];
        doctorsSnapshot.docs.forEach(doc => {
            const doctorData = doc.data();
            userIds.push(doctorData.id_user.id);
            positionIds.push(doctorData.id_position.id);
        });

        const [usersSnapshot, positionsSnapshot] = await Promise.all([
            getDocs(query(collection(db, 'Users'), where('__name__', 'in', userIds))),
            getDocs(query(collection(db, 'Positions'), where('__name__', 'in', positionIds))),
        ]);

        const usersMap = {};
        usersSnapshot.forEach(doc => {
            usersMap[doc.id] = doc.data();
        });

        const positionsMap = {};
        positionsSnapshot.forEach(doc => {
            positionsMap[doc.id] = doc.data();
        });

        const doctorsData = doctorsSnapshot.docs.map(doc => {
            const doctorData = doc.data();
            return {
                id: doc.id,
                ...doctorData,
                id_user: usersMap[doctorData.id_user.id],
                position: positionsMap[doctorData.id_position.id],
                is_archived: doctorData.is_archived,
            };
        });

        return doctorsData;
    } catch (error) {
        console.error('Error fetching doctors:', error);
        return [];
    }
}

// добавление врача
export const addDoctor = async ({ positionId, userId, isArchived, isAvailable, lastname, name, surname }) => {
    try {
        const doctor = {
            id_position: doc(db, 'Positions', positionId),
            id_user: doc(db, 'Users', userId),
            is_archived: isArchived,
            is_available: isAvailable,
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

        const positionsData = positionsSnapshot.docs.map(positionDoc => ({
            id: positionDoc.id,
            name: positionDoc.data().name,
        }));

        return positionsData;
    } catch (error) {
        console.error('Error fetching positions:', error);
        return [];
    }
}

// для получения пола
export async function getGenders() {
    try {
        const gendersCollectionRef = collection(db, 'Genders');
        const gendersSnapshot = await getDocs(gendersCollectionRef);

        const gendersData = gendersSnapshot.docs.map(genderDoc => ({
            id: genderDoc.id,
            name: genderDoc.data().name,
        }));

        return gendersData;
    } catch (error) {
        console.error('Error fetching genders:', error);
        return [];
    }
}

// для получения данных пациентов
export async function getPatients() {
    try {
        const patientsCollectionRef = collection(db, 'Patients');
        const patientsSnapshot = await getDocs(patientsCollectionRef);
        const userIds = new Set();
        const genderIds = new Set();
        patientsSnapshot.docs.forEach(patientDoc => {
            const patientData = patientDoc.data();
            userIds.add(patientData.id_user.id);
            genderIds.add(patientData.id_gender.id);
        });
        const userPromises = Array.from(userIds).map(userId => getDoc(doc(db, 'Users', userId)));
        const genderPromises = Array.from(genderIds).map(genderId => getDoc(doc(db, 'Genders', genderId)));
        const [userDocs, genderDocs] = await Promise.all([
            Promise.all(userPromises),
            Promise.all(genderPromises),
        ]);
        const usersMap = Object.fromEntries(userDocs.map(doc => [doc.id, doc.data()]));
        const gendersMap = Object.fromEntries(genderDocs.map(doc => [doc.id, doc.data()]));
        const patientsData = patientsSnapshot.docs.map(patientDoc => {
            const patientData = patientDoc.data();
            return {
                id: patientDoc.id,
                ...patientData,
                birthday: formatDate(patientData.birthday.toDate()),
                age: formatAges(calculateAges(patientData.birthday.toDate())),
                med_date: formatDate(patientData.med_date.toDate()),
                polis_final_date: formatDate(patientData.polis_final_date.toDate()),
                id_user: usersMap[patientData.id_user.id],
                gender: gendersMap[patientData.id_gender.id],
                photo: ""
            };
        });
        return patientsData;
    } catch (error) {
        console.error('Error fetching patients:', error);
        return [];
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
        const patientDoc = await getDoc(doc(db, 'Patients', patientId));
        if (!patientDoc.exists()) {
            throw new Error(`Patient with id ${patientId} not found.`);
        }
        const patientData = patientDoc.data();

        const userDoc = await getDoc(patientData.id_user);
        const userData = userDoc.data();

        const genderDoc = await getDoc(patientData.id_gender);
        const genderData = genderDoc.data();

        const storage = getStorage();
        const photoRef = ref(storage, patientData.photo);
        const photoUrl = await getDownloadURL(photoRef);

        const formattedPatientData = {
            id: patientDoc.id,
            ...patientData,
            birthday: formatDate(patientData.birthday.toDate()),
            age: formatAges(calculateAges(patientData.birthday.toDate())),
            med_date: formatDate(patientData.med_date.toDate()),
            polis_final_date: formatDate(patientData.polis_final_date.toDate()),
            id_user: userData,
            gender: genderData,
            photo: photoUrl,
        };

        return formattedPatientData;
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

        const positionIds = new Set();
        const ldmTypeIds = new Set();

        ldmsSnapshot.docs.forEach(ldmDoc => {
            const ldmData = ldmDoc.data();
            positionIds.add(ldmData.id_position.id);
            ldmTypeIds.add(ldmData.id_ldm_type.id);
        });

        const positionPromises = Array.from(positionIds).map(id => getDoc(doc(db, 'Positions', id)));
        const ldmTypePromises = Array.from(ldmTypeIds).map(id => getDoc(doc(db, 'Ldm_Types', id)));

        const [positionDocs, ldmTypeDocs] = await Promise.all([
            Promise.all(positionPromises),
            Promise.all(ldmTypePromises)
        ]);

        const positionsMap = Object.fromEntries(positionDocs.map(doc => [doc.id, doc.data()]));
        const ldmTypesMap = Object.fromEntries(ldmTypeDocs.map(doc => [doc.id, doc.data()]));

        const ldmsData = ldmsSnapshot.docs.map(ldmDoc => {
            const ldmData = ldmDoc.data();
            return {
                id: ldmDoc.id,
                ...ldmData,
                id_position: ldmData.id_position,
                time: ldmData.time,
                position: positionsMap[ldmData.id_position.id],
                ldm_type: ldmTypesMap[ldmData.id_ldm_type.id]
            };
        });

        return ldmsData;
    } catch (error) {
        console.error('Error fetching ldms:', error);
        return [];
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
    console.log(positionId)
    try {
        const doctorsQuery = query(collection(db, 'Doctors'), where('id_position', '==', doc(db, 'Positions', positionId.id)));
        const doctorsSnapshot = await getDocs(doctorsQuery);
        return doctorsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Ошибка при поиске специалиста по id должности:', error);
        return [];
    }
}

// получаем расположение специалистов и кабинетов
export async function getDoctorLocationsByPositionId(positionId) {
    try {
        const doctors = await findDoctorByPositionId(positionId);
        if (doctors.length === 0) {
            return [];
        }

        const doctorIds = doctors.map(doctor => doctor.id);
        const doctorLocationsPromises = doctorIds.map(id => 
            getDocs(query(collection(db, 'Doctor_Locations'), where('id_doctor', '==', doc(db, 'Doctors', id))))
        );

        const doctorLocationsSnapshots = await Promise.all(doctorLocationsPromises);
        const doctorLocations = doctorLocationsSnapshots.flat().map(snapshot => snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))).flat();

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

        const doctorLocationIds = appointmentsSnapshot.docs.map(doc => doc.data().id_doctor_location.id);
        const doctorLocationsSnapshot = await getDocs(query(collection(db, 'Doctor_Locations'), where('__name__', 'in', doctorLocationIds)));

        const doctorLocationMap = Object.fromEntries(doctorLocationsSnapshot.docs.map(doc => [doc.id, doc.data()]));

        const doctorIds = new Set();
        const cabinetIds = new Set();
        const ldmIds = new Set();
        const patientIds = new Set();

        doctorLocationsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            doctorIds.add(data.id_doctor.id);
            cabinetIds.add(data.id_cabinet.id);
        });

        appointmentsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            ldmIds.add(data.id_ldm.id);
            patientIds.add(data.id_patient.id);
        });

        const [doctorsSnapshot, cabinetsSnapshot, ldmsSnapshot, patientsSnapshot] = await Promise.all([
            getDocs(query(collection(db, 'Doctors'), where('__name__', 'in', Array.from(doctorIds)))),
            getDocs(query(collection(db, 'Cabinets'), where('__name__', 'in', Array.from(cabinetIds)))),
            getDocs(query(collection(db, 'Ldms'), where('__name__', 'in', Array.from(ldmIds)))),
            getDocs(query(collection(db, 'Patients'), where('__name__', 'in', Array.from(patientIds))))
        ]);

        const doctorsMap = Object.fromEntries(doctorsSnapshot.docs.map(doc => [doc.id, doc.data()]));
        const cabinetsMap = Object.fromEntries(cabinetsSnapshot.docs.map(doc => [doc.id, doc.data()]));
        const ldmsMap = Object.fromEntries(ldmsSnapshot.docs.map(doc => [doc.id, doc.data()]));
        const patientsMap = Object.fromEntries(patientsSnapshot.docs.map(doc => [doc.id, doc.data()]));

        const appointmentsData = appointmentsSnapshot.docs.map(doc => {
            const data = doc.data();
            const doctorLocationData = doctorLocationMap[data.id_doctor_location.id];
            return {
                id: doc.id,
                ...data,
                doctor: doctorsMap[doctorLocationData.id_doctor.id],
                room: cabinetsMap[doctorLocationData.id_cabinet.id],
                event: ldmsMap[data.id_ldm.id],
                patient: patientsMap[data.id_patient.id],
                doctor_location: doctorLocationData,
                datetime: data.ldm_datetime.toDate()
            };
        });

        return appointmentsData;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return [];
    }
}

// для добавления новой записи на прием
export async function uploadDataToAppointment(idPatient, idDoctorLocation, idLdm, ldmDatetime, isConfirmed, complaints) {
    try {
        const patientRef = doc(db, 'Patients', idPatient);
        const doctorLocationRef = doc(db, 'Doctor_Locations', idDoctorLocation);
        const ldmRef = doc(db, 'Ldms', idLdm);

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
        if (patients.length === 0) {
            throw new Error(`Patient with userId ${userId} not found.`);
        }
        const patientId = patients[0].id;
        
        const appointmentsQuery = query(collection(db, 'Appointments'), where('id_patient', '==', doc(db, 'Patients', patientId)));
        const appointmentsSnapshot = await getDocs(appointmentsQuery);

        const doctorLocationIds = appointmentsSnapshot.docs.map(doc => doc.data().id_doctor_location.id);
        const doctorLocationsSnapshot = await getDocs(query(collection(db, 'Doctor_Locations'), where('__name__', 'in', doctorLocationIds)));

        const doctorLocationMap = {};
        doctorLocationsSnapshot.forEach(doc => {
            doctorLocationMap[doc.id] = doc.data();
        });

        const doctorIds = new Set();
        const cabinetIds = new Set();
        const ldmIds = new Set();
        const patientIds = new Set([patientId]);

        doctorLocationsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            doctorIds.add(data.id_doctor.id);
            cabinetIds.add(data.id_cabinet.id);
        });

        appointmentsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            ldmIds.add(data.id_ldm.id);
        });

        const [doctorsSnapshot, cabinetsSnapshot, ldmsSnapshot, patientsSnapshot] = await Promise.all([
            getDocs(query(collection(db, 'Doctors'), where('__name__', 'in', Array.from(doctorIds)))),
            getDocs(query(collection(db, 'Cabinets'), where('__name__', 'in', Array.from(cabinetIds)))),
            getDocs(query(collection(db, 'Ldms'), where('__name__', 'in', Array.from(ldmIds)))),
            getDocs(query(collection(db, 'Patients'), where('__name__', 'in', Array.from(patientIds))))
        ]);

        const doctorsMap = Object.fromEntries(doctorsSnapshot.docs.map(doc => [doc.id, doc.data()]));
        const cabinetsMap = Object.fromEntries(cabinetsSnapshot.docs.map(doc => [doc.id, doc.data()]));
        const ldmsMap = Object.fromEntries(ldmsSnapshot.docs.map(doc => [doc.id, doc.data()]));
        const patientsMap = Object.fromEntries(patientsSnapshot.docs.map(doc => [doc.id, doc.data()]));

        const appointmentsData = appointmentsSnapshot.docs.map(appointmentDoc => {
            const appointmentData = appointmentDoc.data();
            const doctorLocationData = doctorLocationMap[appointmentData.id_doctor_location.id];
            const doctorData = doctorsMap[doctorLocationData.id_doctor.id];
            const cabinetData = cabinetsMap[doctorLocationData.id_cabinet.id];
            const ldmData = ldmsMap[appointmentData.id_ldm.id];
            const patientData = patientsMap[appointmentData.id_patient.id];

            const ldmDate = formatDate(appointmentData.ldm_datetime.toDate());
            const ldmTime = formatTime(appointmentData.ldm_datetime.toDate());

            return {
                id: appointmentDoc.id,
                patient: patientData,
                doctor: doctorData,
                cabinet: cabinetData.num,
                ldm_name: ldmData,
                ldm_date: ldmDate,
                ldm_time: ldmTime,
                ...appointmentData
            };
        });

        return appointmentsData;
    } catch (error) {
        console.error('Ошибка при получении записей Appointments пациента:', error);
        return [];
    }
}

// для обновления данных лдм (жалобы)
export const updateAppointmentComplaints = async (appointmentId, complaints) => {
    if (!appointmentId || !complaints) {
        throw new Error('Invalid appointment ID or complaints');
    }
    try {
        const appointmentRef = doc(db, 'Appointments', appointmentId);
        await updateDoc(appointmentRef, { complaints });
        console.log('Appointment updated successfully');
    } catch (error) {
        console.error('Error updating appointment: ', error);
        throw error;
    }
};

// для обновления данных лдм (подтверждение посещения приема пациентом)
export const updateAppointmentIsConfirmed = async (appointmentId, isConfirmed) => {
    if (!appointmentId || typeof isConfirmed !== 'boolean') {
        throw new Error('Invalid appointment ID or isConfirmed status');
    }
    try {
        const appointmentRef = doc(db, 'Appointments', appointmentId);
        await updateDoc(appointmentRef, { is_confirmed: isConfirmed });
        console.log('Appointment updated successfully');
    } catch (error) {
        console.error('Error updating appointment: ', error);
        throw error;
    }
};

// для получения данных направлений на прием
export async function getAppointmentReferrals() {
    try {
        const appointmentReferralsSnapshot = await getDocs(collection(db, 'Appointment_Referrals'));

        const ldmRefs = new Set();
        const patientRefs = new Set();
        const referralMakerRefs = new Set();

        appointmentReferralsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            ldmRefs.add(data.id_ldm.id);
            patientRefs.add(data.id_patient.id);
            referralMakerRefs.add(data.id_referral_maker.id);
        });

        const [ldmsSnapshot, patientsSnapshot, referralMakersSnapshot] = await Promise.all([
            getDocs(query(collection(db, 'Ldms'), where('__name__', 'in', Array.from(ldmRefs)))),
            getDocs(query(collection(db, 'Patients'), where('__name__', 'in', Array.from(patientRefs)))),
            getDocs(query(collection(db, 'Doctors'), where('__name__', 'in', Array.from(referralMakerRefs))))
        ]);

        const ldmsMap = Object.fromEntries(ldmsSnapshot.docs.map(doc => [doc.id, doc.data()]));
        const patientsMap = Object.fromEntries(patientsSnapshot.docs.map(doc => [doc.id, doc.data()]));
        const referralMakersMap = Object.fromEntries(referralMakersSnapshot.docs.map(doc => [doc.id, doc.data()]));

        console.log(referralMakersMap)

        const appointmentReferralsData = appointmentReferralsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                ldm: ldmsMap[data.id_ldm.id],
                patient: patientsMap[data.id_patient.id],
                referral_maker: referralMakersMap[data.id_referral_maker.id]
            };
        });

        return appointmentReferralsData;
    } catch (error) {
        console.error('Error fetching appointment referrals:', error);
        return [];
    }
}

// для получения данных врача по id пользователя
export const getDoctorByUserId = async (userId) => {
    try {
        const doctorsQuerySnapshot = await getDocs(
            query(collection(db, "Doctors"), where("id_user", "==", doc(db, "Users", userId)))
        );

        if (doctorsQuerySnapshot.empty) {
            throw new Error("Doctor not found");
        }

        const doctorDoc = doctorsQuerySnapshot.docs[0];
        const doctorData = doctorDoc.data();

        const [positionDoc, userDoc] = await Promise.all([
            getDoc(doctorData.id_position),
            getDoc(doctorData.id_user)
        ]);

        const positionData = positionDoc.exists() ? positionDoc.data() : null;
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
    console.log(doctorId)
    try {
        const allAppointments = await getAppointments();
        const today = new Date();
        const oneWeekAhead = new Date();
        oneWeekAhead.setDate(today.getDate() + 7);

        const filteredAppointments = allAppointments.filter(appointment => {
            const appointmentDate = new Date(appointment.datetime);
            return appointment.doctor_location.id_doctor.id === doctorId &&
                appointmentDate >= today &&
                appointmentDate <= oneWeekAhead;
        });

        console.log(filteredAppointments)

        return filteredAppointments.map(appointment => ({
            id: appointment.id,
            doctor: appointment.doctor,
            room: appointment.room,
            datetime: appointment.datetime,
            event: appointment.event,
            patient: appointment.patient,
            id_patient: appointment.id_patient
        }));
    } catch (error) {
        console.error('Error filtering appointments:', error);
        return [];
    }
}

// для фильтрации лдм для каждого врача и времени
export async function getFilteredCurrentAppointmentsByDoctorId(doctorId) {
    try {
        const allAppointments = await getAppointments();
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        const filteredAppointments = allAppointments.filter(appointment => {
            const appointmentDate = new Date(appointment.datetime);
            return appointment.doctor_location.id_doctor.id === doctorId &&
                appointmentDate >= startOfDay &&
                appointmentDate <= endOfDay;
        });

        return filteredAppointments.map(appointment => ({
            id: appointment.id,
            doctor: appointment.doctor,
            room: appointment.room,
            datetime: appointment.datetime,
            event: appointment.event,
            patient: appointment.patient,
            id_patient: appointment.id_patient
        }));
    } catch (error) {
        console.error('Error filtering appointments:', error);
        return [];
    }
};

// для фильтрации лдм для каждого пациента
export async function getFilteredAppointmentsByPatientId(patientId) {
    try {
        const allAppointments = await getAppointments();
        const filteredAppointments = allAppointments.filter(appointment => appointment.id_patient.id === patientId);

        return filteredAppointments.map(appointment => ({
            id: appointment.id,
            doctor: appointment.doctor,
            room: appointment.room,
            datetime: appointment.datetime,
            event: appointment.event,
            patient: appointment.patient,
            id_patient: appointment.id_patient
        }));
    } catch (error) {
        console.error('Error filtering appointments:', error);
        return [];
    }
}

// для добавления нового врача
export async function uploadDoctorData(lastname, name, surname, idPosition, isAvailable, login, password) {
    try {
        const positionRef = doc(db, 'Positions', idPosition);
        const roleRef = doc(db, 'Roles', '2');
        const doctorPhoto = 'users_avatar/doctor.png';
        const username = formatUsername(lastname, name, surname);

        const userRef = await addDoc(collection(db, 'Users'), {
            id_role: roleRef,
            username: username,
            login: login,
            password: password,
            photo: doctorPhoto,
        });

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
        const doctorRef = doc(db, 'Doctors', doctorId);

        const newData = {
            lastname,
            name,
            surname,
            id_position: positionRef,
            is_available: isAvailable,
        };

        await updateDoc(doctorRef, newData);

        console.log('Данные успешно обновлены для врача с Id:', doctorId);
    } catch (error) {
        console.error('Ошибка при обновлении данных для врача:', error);
    }
}

// для архивации записи врача (полное удаление приведет к некорректным связям в других таблицах)
export async function deleteDoctorData(doctorId) {
    try {
        const doctorRef = doc(db, "Doctors", doctorId);
        await updateDoc(doctorRef, { is_archived: true });

        console.log("Доктор успешно удален(архивирован)");
    } catch (error) {
        console.error("Ошибка при удалении(архивации) врача:", error);
    }
}

// для получения истории болезней определенного пациента
export async function getPatientSickHistoryById(patientId) {
    try {
        const sickHistoriesQuery = query(collection(db, 'Sick_Histories'), where('id_patient', '==', doc(db, 'Patients', patientId)));
        const sickHistoriesSnapshot = await getDocs(sickHistoriesQuery);
        const sickHistories = [];

        const doctorsCache = new Map();
        const diagnosesCache = new Map();

        for (const eachDoc of sickHistoriesSnapshot.docs) {
            const sickHistoryData = eachDoc.data();

            let doctorData = doctorsCache.get(sickHistoryData.id_doctor.id);
            if (!doctorData) {
                const doctorDoc = await getDoc(doc(db, 'Doctors', sickHistoryData.id_doctor.id));
                doctorData = doctorDoc.data();
                doctorsCache.set(sickHistoryData.id_doctor.id, doctorData);
            }

            let diagnosData = diagnosesCache.get(sickHistoryData.id_diagnos.id);
            if (!diagnosData) {
                const diagnosDoc = await getDoc(doc(db, 'Diagnoses', sickHistoryData.id_diagnos.id));
                diagnosData = diagnosDoc.data();
                diagnosesCache.set(sickHistoryData.id_diagnos.id, diagnosData);
            }

            const diagnosDate = formatDate(sickHistoryData.diagnos_date.toDate());

            sickHistories.push({
                id: eachDoc.id,
                doctor: doctorData,
                diagnos: diagnosData.name,
                diagnosDate,
                ...sickHistoryData
            });
        }
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
        const analyses = [];

        const doctorsCache = new Map();
        const analysTypesCache = new Map();

        for (const eachDoc of analysesSnapshot.docs) {
            const analysData = eachDoc.data();

            let doctorData = doctorsCache.get(analysData.id_doctor.id);
            if (!doctorData) {
                const doctorDoc = await getDoc(doc(db, 'Doctors', analysData.id_doctor.id));
                doctorData = doctorDoc.data();
                doctorsCache.set(analysData.id_doctor.id, doctorData);
            }

            let analysTypeData = analysTypesCache.get(analysData.id_analys_type.id);
            if (!analysTypeData) {
                const analysTypeDoc = await getDoc(doc(db, 'Analys_Types', analysData.id_analys_type.id));
                analysTypeData = analysTypeDoc.data();
                analysTypesCache.set(analysData.id_analys_type.id, analysTypeData);
            }

            const analysDate = formatDate(analysData.analys_date.toDate());

            analyses.push({
                id: eachDoc.id,
                doctor: doctorData,
                analysType: analysTypeData,
                analysDate,
                ...analysData
            });
        }
        return analyses;
    } catch (error) {
        console.error('Ошибка при получении записей Analyses:', error);
        return [];
    }
}

export async function addAppointmentReferral(idDoctorLocation, idLdm, idPatient, idReferralMaker) {
    try {
        const doctorLocationRef = doc(db, 'Doctor_Locations', idDoctorLocation);
        const ldmRef = doc(db, 'Ldms', idLdm);
        const patientRef = doc(db, 'Patients', idPatient);
        const referralMakerRef = doc(db, 'Doctors', idReferralMaker);

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

// для получения данных из коллекции Referral_Statuses
export const getReferralStatuses = async () => {
    try {
        const statusesSnapshot = await getDocs(collection(db, 'Referral_Statuses'));
        return statusesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching referral statuses:', error);
        throw error;
    }
};

export const addGospitalizationReferral = async ({ patientId, statusId, terapevtId, reason, startDate }) => {
    try {
        const gospitalizationReferral = {
            creation_date: Timestamp.fromDate(new Date()),
            id_patient: doc(db, 'Patients', patientId),
            id_status: doc(db, 'Referral_Statuses', statusId),
            id_terapevt: doc(db, 'Doctors', terapevtId),
            reason,
            start_date: Timestamp.fromDate(new Date(startDate)),
        };
        const docRef = await addDoc(collection(db, "Gospitalization_Referrals"), gospitalizationReferral);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};





