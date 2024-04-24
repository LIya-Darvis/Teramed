

class User {
  constructor(id, role, idUser, userName, userCode, login, password) {
    this.id = id;
    this.role = role;
    this.idUser = idUser;
    this.userName = userName;
    this.userCode = userCode;
    this.login = login;
    this.password = password;
  }
}

class Doctor {
  constructor(id, lastname, name, surname, position) {
    this.id = id;
    this.lastname = lastname;
    this.name = name;
    this.surname = surname;
    this.position = position;
  }
}

class MenuPoint {
  constructor(panel, title){
    this.panel = panel;
    this.title = title;
  }
}

export { User, Doctor, MenuPoint };

