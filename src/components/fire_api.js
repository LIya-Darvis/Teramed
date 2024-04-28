import { db } from "../firebase";
import { collection, getDocs, getDoc, doc, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


async function getUsers() {
    try {
        const usersCollectionRef = collection(db, 'Users');
        const usersSnapshot = await getDocs(usersCollectionRef);

        const usersData = [];
        for (const userDoc of usersSnapshot.docs) {
            const userData = userDoc.data();
            const roleId = userData.id_role;

            // Получаем данные о ролях пользователей
            const roleDoc = await getDoc(doc(db, 'Roles', roleId.id));
            const roleData = roleDoc.data();

            const storage = getStorage();
            const photoRef = ref(storage, userData.photo); 
            var photoUrl = await getDownloadURL(photoRef);


            const userWithRole = {
                id: userDoc.id,
                ...userData,
                role: roleData, // Добавляем данные о роли в объект пользователя
                photo: photoUrl, // Добавляем фотографию пользователя
            };
            usersData.push(userWithRole);
        }
        return usersData;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

async function fetchAccessiblePanelsForRole(roleName) {
    try {
        const rolesQuerySnapshot = await getDocs(query(collection(db, 'Roles'), where('name', '==', roleName)));
        if (rolesQuerySnapshot.empty) {
            console.log('Роль с именем ', roleName,' не найдена');
            return;
        }
        const roleId = rolesQuerySnapshot.docs[0].id;

        // Получаем доступы для роли "admin" из коллекции Access_Rights
        const accessRightsQuerySnapshot = await getDocs(query(collection(db, 'Access_Rights'), where('id_role', '==', doc(db, 'Roles', roleId))));

        // Получаем названия панелей на основе id_panel каждой записи в Access_Rights
        const panelNames = [];
        for (const docSnapshot of accessRightsQuerySnapshot.docs) {
            const accessRight = docSnapshot.data();
            const panelDoc = await getDoc(accessRight.id_panel);
            const panelName = panelDoc.data().name;
            panelNames.push(panelName);
        }

        return panelNames
    } catch (error) {
        console.error('Ошибка при получении доступных панелей:', error);
    }
};



export { getUsers, fetchAccessiblePanelsForRole }







