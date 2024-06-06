class User {
  constructor(id, role, userName, login, password, photo) {
    this.id = id;
    this.role = role;
    this.userName = userName;
    this.login = login;
    this.password = password;
    this.photo = photo;
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

