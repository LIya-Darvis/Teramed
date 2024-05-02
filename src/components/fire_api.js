import { db } from "../firebase";
import { collection, getDocs, getDoc, doc, query, where, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// для авторизации
async function getUsers() {
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

// для отображения панелей по доступу пользователя
async function fetchAccessiblePanelsForRole(roleName) {
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
async function getDoctors() {
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
                id_user: userData, // добавляем данные о роли пользователя
                position: positionData, // добавляем должность специалиста
            };
            doctorsData.push(totalDoctorData);
        }
        return doctorsData;
    } catch (error) {
        console.error('Error fetching doctors:', error);
    }
}

// для вывода данных пациентов
async function getPatients() {
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

            const patientBirthday = patientData.birthday.toDate().getDate() + "."
                + (patientData.birthday.toDate().getMonth() + 1) + "."
                + patientData.birthday.toDate().getFullYear();

            const totalPatientData = {
                id: patientsDoc.id,
                ...patientData,  // добавляем прочие данные с атрибутами по умолчанию
                birthday: patientBirthday,
                id_user: userData, // добавляем данные о роли в объект пользователя
                gender: genderData, // добавляем фотографию пользователя
                photo: photoUrl, // добавляем фото пациента
            };
            console.log("- пациент ", totalPatientData)
            patientsData.push(totalPatientData);
            console.log(patientsData)
        }
        console.log("- все ", patientsData)
        return patientsData;
    } catch (error) {
        console.error('Error fetching patients:', error);
    }
}

// для получения всез лдм
async function getLdms() {
    try {
        
        const ldmsCollectionRef = collection(db, 'Ldms');
        const ldmsSnapshot = await getDocs(ldmsCollectionRef);

        const ldmsData = [];
        for (const ldmDoc of ldmsSnapshot.docs) {
            const ldmData = ldmDoc.data();
            const positionId = ldmData.id_position;

            // получаем данные о ролях пользователей
            const positionDoc = await getDoc(doc(db, 'Positions', positionId.id));
            const positionData = positionDoc.data();

            const totalLdmData = {
                id: ldmDoc.id,
                ...ldmData,
                position: positionData, // добавляем данные о должности специалиста
            };
            ldmsData.push(totalLdmData);
        }
        return ldmsData;
    } catch (error) {
        console.error('Error fetching ldms:', error);
    }
}

// для добавления новой записи на прием
async function uploadDataToAppointment(idPatient, idDoctorLocation, idLdm, ldmDatetime) {
    try {
        // Добавляем новый документ в коллекцию Ldms
        await addDoc(collection(db, 'Appointments'), {
            id_patient: idPatient,
            id_doctor_location: idDoctorLocation,
            id_ldm: idLdm,
            ldm_datetime: ldmDatetime,
        });
        console.log('Данные успешно загружены в коллекцию Appointments');
    } catch (error) {
        console.error('Ошибка при загрузке данных в коллекцию Appointments:', error);
    }
}





export { getUsers, fetchAccessiblePanelsForRole, getDoctors, 
        getPatients, uploadDataToAppointment, getLdms }







