import { workingHours } from './data';

export function getAppointmentTimePeriods() {
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




export const generateTimeSlots = (appointments, eventDuration) => {
    console.log(appointments)
    console.log(eventDuration)

    const timeSlots = [];
    const today = new Date();
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 7);

    for (let day = new Date(today); day <= endOfWeek; day.setDate(day.getDate() + 1)) {
        const daySlots = [];
        const startOfDay = new Date(day);
        startOfDay.setHours(8, 0, 0, 0); // 8:00 AM

        const endOfDay = new Date(day);
        endOfDay.setHours(20, 0, 0, 0); // 8:00 PM

        for (let slotStart = new Date(startOfDay); slotStart < endOfDay; slotStart.setMinutes(slotStart.getMinutes() + eventDuration)) {
            const slotEnd = new Date(slotStart);
            slotEnd.setMinutes(slotStart.getMinutes() + eventDuration);

            // Проверка, чтобы прием не выходил за границы рабочего дня
            if (slotEnd > endOfDay) {
                break;
            }

            const isSlotAvailable = !appointments.some(appointment => {
                const appointmentStart = new Date(appointment.datetime);
                const appointmentEnd = new Date(appointmentStart);
                appointmentEnd.setMinutes(appointmentStart.getMinutes() + eventDuration);
                return (slotStart < appointmentEnd && slotEnd > appointmentStart);
            });

            if (isSlotAvailable) {
                daySlots.push({
                    start: new Date(slotStart),
                    end: new Date(slotEnd)
                });
            }
        }

        timeSlots.push({
            date: new Date(day),
            slots: daySlots
        });
    }

    return timeSlots;
};


