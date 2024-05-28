export const doctors = [
    { id: 1, name: "Dr. Ivanov", room: 101, available: true, specialties: [] },
    { id: 2, name: "Dr. Petrov", room: 102, available: true, specialties: [] },
    { id: 3, name: "Dr. Sidorova", room: 103, available: false, specialties: ["Consultation", "Surgery", "Checkup"] },
    // добавьте больше врачей по необходимости
];

export const events = [
    { name: "Consultation", duration: 40 },
    { name: "Surgery", duration: 120 },
    { name: "Checkup", duration: 30 },
    // добавьте больше мероприятий по необходимости
];

export const existingAppointments = [
    { doctorId: 1, room: 101, start: "08:00", end: "08:15" },
    { doctorId: 2, room: 102, start: "08:15", end: "08:30" },
    // добавьте больше существующих записей по необходимости
];

export const workingHours = {
    start: "08:00",
    end: "20:00"
};

