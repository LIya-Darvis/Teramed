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
