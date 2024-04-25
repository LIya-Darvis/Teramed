import {User} from '../components/classes.js';




async function getUsers() {
    var users;
    try {
        const res = await fetch('http://localhost:3005/api/users');
        users = await res.json();
      } catch (err) {
        console.log(err.message);
      }
    return users
}

async function getDoctors() {
  var doctors;
  try {
      const res = await fetch('http://localhost:3005/api/doctors');
      doctors = await res.json();
    } catch (err) {
      console.log(err.message);
    }
  return doctors;
}

async function getPatients() {
  var patients;
  try {
      const res = await fetch('http://localhost:3005/api/patients');
      patients = await res.json();
    } catch (err) {
      console.log(err.message);
    }
  return patients;
}

export {getUsers, getDoctors, getPatients};


