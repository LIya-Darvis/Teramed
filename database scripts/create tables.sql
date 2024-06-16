create table
  Roles (
    id uuid primary key default uuid_generate_v4 (),
    name text not null
  );

create table
  Users (
    id uuid primary key default uuid_generate_v4 (),
    username text not null,
    login text not null,
    password text not null,
    photo text,
    id_role uuid references Roles (id)
  );

create table
  Panels (
    id uuid primary key default uuid_generate_v4 (),
    name text not null
  );

create table
  Access_Rights (
    id uuid primary key default uuid_generate_v4 (),
    id_panel uuid references Panels (id),
    id_role uuid references Roles (id)
  );

create table
  Analysis_Types (
    id uuid primary key default uuid_generate_v4 (),
    lower_limit numeric not null,
    name text not null,
    unit text not null,
    upper_limit numeric not null
  );

create table
  Departments (
    id uuid primary key default uuid_generate_v4 (),
    name text not null
  );

create table
  Cabinets (
    id uuid primary key default uuid_generate_v4 (),
    id_department uuid references Departments (id),
    num integer not null
  );

create table
  Positions (
    id uuid primary key default uuid_generate_v4 (),
    name text not null
  );

create table
  Ldm_Types (
    id uuid primary key default uuid_generate_v4 (),
    name text not null
  );

create table
  Genders (
    id uuid primary key default uuid_generate_v4 (),
    name text not null
  );

create table
  Doctors (
    id uuid primary key default uuid_generate_v4 (),
    id_position uuid references Positions (id),
    id_user uuid references Users (id),
    is_archived boolean not null,
    is_available boolean not null,
    lastname text not null,
    name text not null,
    surname text not null
  );

create table
  Patients (
    id uuid primary key default uuid_generate_v4 (),
    lastname text not null,
    name text not null,
    surname text not null,
    address text,
    birthday date,
    email text,
    phone text,
    id_gender uuid references Genders (id),
    id_user uuid references Users (id),
    is_archived boolean not null,
    med_date date,
    passport_num text,
    passport_series text,
    photo text,
    polis_final_date date,
    polis_num text
  );

create table
  Analyses (
    id uuid primary key default uuid_generate_v4 (),
    analys_date timestamp not null,
    comment text,
    id_analys_type uuid references Analysis_Types (id),
    id_doctor uuid references Doctors (id),
    id_patient uuid references Patients (id),
    value numeric not null
  );

CREATE TABLE
  Diagnoses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
    id_position uuid REFERENCES Positions (id),
    name text NOT NULL
  );

CREATE TABLE
  Sick_Histories (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
    diagnos_date timestamp NOT NULL,
    id_diagnos uuid REFERENCES Diagnoses (id),
    id_doctor uuid REFERENCES Doctors (id),
    id_patient uuid REFERENCES Patients (id),
    is_confirmed boolean NOT NULL,
    id_therapist uuid REFERENCES Doctors (id),
    recomendations text,
    symptoms text
  );

CREATE TABLE
  Referral_Statuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name TEXT NOT NULL
  );

CREATE TABLE
  Ldms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    description TEXT,
    id_ldm_type UUID REFERENCES Ldm_Types (id),
    id_position UUID REFERENCES Positions (id),
    is_available BOOLEAN,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    time INTEGER
  );

CREATE TABLE
  Gospitalization_Referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    creation_date TIMESTAMP NOT NULL,
    id_patient UUID REFERENCES Patients (id),
    id_status UUID REFERENCES Referral_Statuses (id),
    id_terapevt UUID REFERENCES Doctors (id),
    reason TEXT,
    start_date TIMESTAMP
  );
 
CREATE TABLE
  Appointment_Referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    id_ldm UUID REFERENCES Ldms (id),
    id_patient UUID REFERENCES Patients (id),
    id_referral_maker UUID REFERENCES Doctors (id),
    is_confirmed BOOLEAN
  );

CREATE TABLE
  Doctor_Locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    id_cabinet UUID REFERENCES Cabinets (id),
    id_doctor UUID REFERENCES Doctors (id)
  );

CREATE TABLE
  Appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    complaints TEXT,
    id_doctor_location UUID REFERENCES Doctor_Locations (id),
    id_ldm UUID REFERENCES Ldms (id),
    id_patient UUID REFERENCES Patients (id),
    is_confirmed BOOLEAN,
    ldm_datetime TIMESTAMP
  );

CREATE TABLE
  Gospitalizations (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    Id_gospitalization_referral UUID NOT NULL REFERENCES Gospitalization_Referrals (id),
    Id_place UUID NOT NULL REFERENCES Places (id),
    Start_date DATE NOT NULL,
    End_date DATE
  );

CREATE TABLE
  Wards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    id_department UUID REFERENCES Departments (id) ON DELETE CASCADE,
    num TEXT NOT NULL
  );

CREATE TABLE
  Places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    id_ward UUID REFERENCES Wards (id) ON DELETE CASCADE,
    num TEXT NOT NULL
  );
