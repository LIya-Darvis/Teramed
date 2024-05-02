function getAppointmentTimePeriods() {
    const timePeriods = [];

    // Генерация 6 временных периодов
    for (let i = 0; i < 6; i++) {
        // Генерация случайного количества часов от 8 до 17
        const h = Math.floor(Math.random() * (17 - 8 + 1)) + 8;
        // Генерация случайного количества минут от 0 до 59
        const m = Math.floor(Math.random() * 60);

        // Добавление временного периода в массив
        timePeriods.push({ hours: h, minutes: m });
    }
    // console.log(timePeriods)

    // Сортировка массива по часам, а затем по минутам
    timePeriods.sort((a, b) => {
        if (a.hours !== b.hours) {
            return a.hours - b.hours;
        } else {
            return a.minutes - b.minutes;
        }
    });
 
    return timePeriods;
}

export {getAppointmentTimePeriods}