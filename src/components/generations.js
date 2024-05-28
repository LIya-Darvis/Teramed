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




export const generateSchedule = (doctors, events, existingAppointments) => {
    const schedule = {};
    const timeSlots = {};

    doctors.forEach(doctor => {
        if (!timeSlots[doctor.room]) {
            timeSlots[doctor.room] = [];
        }
    });

    existingAppointments.forEach(appointment => {
        const start = parseTime(appointment.start);
        const end = parseTime(appointment.end);
        timeSlots[appointment.room].push({ start, end });
    });

    const getNextAvailableSlot = (room, duration) => {
        const startTime = parseTime(workingHours.start);
        const endTime = parseTime(workingHours.end);

        for (let time = startTime; time <= endTime - duration; time += 15) {
            if (!timeSlots[room].some(slot => (time >= slot.start && time < slot.end) || (time + duration > slot.start && time + duration <= slot.end))) {
                return time;
            }
        }

        return null;
    };

    doctors.forEach(doctor => {
        schedule[doctor.name] = [];
        let duration = doctor.available ? 15 : null;

        if (!doctor.available) {
            const doctorAppointments = events.filter(app => app.doctorId === doctor.id);
            doctorAppointments.forEach(app => {
                duration = app.duration;
                let nextSlot = getNextAvailableSlot(doctor.room, duration);

                while (nextSlot !== null) {
                    schedule[doctor.name].push({
                        event: app.name,
                        start: formatTime(nextSlot),
                        end: formatTime(nextSlot + duration)
                    });
                    timeSlots[doctor.room].push({ start: nextSlot, end: nextSlot + duration });
                    nextSlot = getNextAvailableSlot(doctor.room, duration);
                }
            });
        } else {
            let nextSlot = getNextAvailableSlot(doctor.room, duration);
            while (nextSlot !== null) {
                schedule[doctor.name].push({
                    event: "Standard Appointment",
                    start: formatTime(nextSlot),
                    end: formatTime(nextSlot + duration)
                });
                timeSlots[doctor.room].push({ start: nextSlot, end: nextSlot + duration });
                nextSlot = getNextAvailableSlot(doctor.room, duration);
            }
        }
    });

    return schedule;
};

const parseTime = timeStr => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};

const formatTime = minutes => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

export const getAvailableSlots = (room, duration, existingAppointments, workingHours) => {
    const startTime = parseTime(workingHours.start); // начало рабочего дня
    const endTime = parseTime(workingHours.end); // конец рабочего дня
    const availableSlots = [];

    for (let time = startTime; time <= endTime - duration; time += 15) {
        if (!existingAppointments.some(appt => appt.room === room && (
            (time >= parseTime(appt.start) && time < parseTime(appt.end)) ||
            (time + duration > parseTime(appt.start) && time + duration <= parseTime(appt.end))
        ))) {
            availableSlots.push(formatTime(time));
        }
    }

    return availableSlots;
};
