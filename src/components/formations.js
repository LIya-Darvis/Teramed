export function formatUsername(lastname, name, surname) {
    const username = lastname + " " + name[0] + "." + surname[0] + ".";
    // изменяем входной формат на day.month.year
    return username;
}

export function formatDate(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    // изменяем входной формат на day.month.year
    return date.toLocaleDateString('en-GB', options).replace(/\./g, '/');
}

export function formatTime(time) {
    const date = new Date(time); // Преобразование в объект Date
    const hours = date.getHours(); // Получение часов
    const minutes = date.getMinutes(); // Получение минут

    // изменяем входной формат на hours:minutes
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return formattedTime;
}

export function calculateAges(time) {
    const firebaseDate = new Date(time);
    const currentDate = new Date();
    const yearsDifference = currentDate.getFullYear() - firebaseDate.getFullYear();

    // Учитываем месяцы и дни для точного вычисления
    const monthsDifference = currentDate.getMonth() - firebaseDate.getMonth();
    const daysDifference = currentDate.getDate() - firebaseDate.getDate();

    let adjustedYearsDifference = yearsDifference;

    // Если текущий месяц и день меньше, чем у даты из timestamp, уменьшаем количество лет на 1
    if (monthsDifference < 0 || (monthsDifference === 0 && daysDifference < 0)) {
        adjustedYearsDifference--;
    }

    return adjustedYearsDifference
}

export function formatAges(years) {
    if (years % 10 === 1 && years % 100 !== 11) {
        return `${years} год`;
    } else if ((years % 10 >= 2 && years % 10 <= 4) && !(years % 100 >= 12 && years % 100 <= 14)) {
        return `${years} года`;
    } else {
        return `${years} лет`;
    }
}






