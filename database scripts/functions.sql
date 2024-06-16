create
or replace function get_users () returns table (
  user_id uuid,
  username text,
  login text,
  password text,
  photo text,
  role_name text,
  role_id uuid,
  position_name text
) language plpgsql as $$
begin
  return query
    select
      u.id as user_id,
      u.username,
      u.login,
      u.password,
      u.photo,
      r.name as role_name,
      r.id as role_id,
      coalesce(p.name, 'Не указана') as position_name
    from
      Users u
      join Roles r on u.id_role = r.id
      left join Doctors d on u.id = d.id_user
      left join Positions p on d.id_position = p.id
    where
      r.name = 'doctor'
    union all
    select
      u.id as user_id,
      u.username,
      u.login,
      u.password,
      u.photo,
      r.name as role_name,
      r.id as role_id,
      'Не указана' as position_name
    from
      Users u
      join Roles r on u.id_role = r.id
    where
      r.name != 'doctor';
end;
$$;

create
or replace function fetch_accessible_panels (role_id uuid) returns table (panel_name text) as $$
begin
  return query
    select p.name
    from access_rights ar
    join panels p on ar.id_panel = p.id
    where ar.id_role = role_id;
end;
$$ language plpgsql;

create
or replace function get_doctors () returns table (
  doctor_id uuid,
  position_id uuid,
  position_name text,
  user_id uuid,
  username text,
  login text,
  password text,
  photo text,
  is_archived boolean,
  is_available boolean,
  lastname text,
  name text,
  surname text
) language plpgsql as $$
begin
    return query
    select 
        d.id as doctor_id,
        d.id_position as position_id,
        p.name as position_name,
        u.id as user_id,
        u.username,
        u.login,
        u.password,
        u.photo,
        d.is_archived,
        d.is_available,
        d.lastname,
        d.name,
        d.surname
    from 
        Doctors d
        join Positions p on d.id_position = p.id
        join Users u on d.id_user = u.id;
end;
$$;

create
or replace function get_patients () returns table (
  patient_id uuid,
  lastname text,
  name text,
  surname text,
  address text,
  birthday date,
  email text,
  phone text,
  gender_name text,
  user_id uuid,
  username text,
  login text,
  password text,
  user_photo text,
  role_id uuid,
  role_name text,
  is_archived boolean,
  med_date date,
  passport_num text,
  passport_series text,
  patient_photo text,
  polis_final_date date,
  polis_num text
) language plpgsql as $$
begin
  return query
    select
      p.id as patient_id,
      p.lastname,
      p.name,
      p.surname,
      p.address,
      p.birthday,
      p.email,
      p.phone,
      g.name as gender_name,
      u.id as user_id,
      u.username,
      u.login,
      u.password,
      u.photo as user_photo,
      r.id as role_id,
      r.name as role_name,
      p.is_archived,
      p.med_date,
      p.passport_num,
      p.passport_series,
      p.photo as patient_photo,
      p.polis_final_date,
      p.polis_num
    from
      Patients p
      join Genders g on p.id_gender = g.id
      join Users u on p.id_user = u.id
      join Roles r on u.id_role = r.id;
end;
$$;

create
or replace function get_analyses () returns table (
  id uuid,
  analys_date timestamp,
  comment text,
  analys_type_name text,
  analys_type_unit text,
  analys_type_lower_limit numeric,
  analys_type_upper_limit numeric,
  doctor_id uuid,
  doctor_name text,
  patient_id uuid,
  patient_name text,
  value numeric
) language plpgsql as $$
begin
    return query
        select
            a.id,
            a.analys_date,
            a.comment,
            at.name as analys_type_name,
            at.unit as analys_type_unit,
            at.lower_limit as analys_type_lower_limit,
            at.upper_limit as analys_type_upper_limit,
            d.id as doctor_id,
            d.name as doctor_name,
            p.id as patient_id,
            p.lastname || ' ' || p.name || ' ' || p.surname as patient_name,
            a.value
        from
            Analyses a
            join Analysis_Types at on a.id_analys_type = at.id
            join Doctors d on a.id_doctor = d.id
            join Patients p on a.id_patient = p.id;
end;
$$;

CREATE
OR REPLACE FUNCTION get_diagnoses_with_positions () RETURNS TABLE (
  id uuid,
  id_position uuid,
  position_name text,
  name text
) AS $$
BEGIN
    RETURN QUERY
    SELECT d.id, d.id_position, p.name AS position_name, d.name
    FROM Diagnoses d
    JOIN Positions p ON d.id_position = p.id;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION get_sick_histories () RETURNS TABLE (
  id uuid,
  diagnos_date timestamp,
  diagnos_name text,
  doctor_lastname text,
  doctor_name text,
  doctor_surname text,
  therapist_id uuid,
  therapist_lastname text,
  therapist_name text,
  therapist_surname text,
  patient_id uuid,
  is_confirmed boolean,
  recomendations text,
  symptoms text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sh.id, 
        sh.diagnos_date, 
        d.name AS diagnos_name, 
        doc.lastname AS doctor_lastname, 
        doc.name AS doctor_name, 
        doc.surname AS doctor_surname,
        ther.id AS therapist_id,
        ther.lastname AS therapist_lastname,
        ther.name AS therapist_name,
        ther.surname AS therapist_surname,
        p.id AS patient_id, 
        sh.is_confirmed, 
        sh.recomendations, 
        sh.symptoms
    FROM 
        Sick_Histories sh
    JOIN 
        Diagnoses d ON sh.id_diagnos = d.id
    JOIN 
        Doctors doc ON sh.id_doctor = doc.id
    LEFT JOIN 
        Doctors ther ON sh.id_therapist = ther.id
    JOIN 
        Patients p ON sh.id_patient = p.id;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION get_analysis_types () RETURNS TABLE (
  analysis_id UUID,
  lower_limit NUMERIC,
  name TEXT,
  unit TEXT,
  upper_limit NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT at.id AS analysis_id, at.lower_limit, at.name, 
    at.unit, at.upper_limit FROM Analysis_Types at;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION add_analysis (
  p_analys_date timestamp,
  p_comment text,
  p_id_analys_type uuid,
  p_id_doctor uuid,
  p_id_patient uuid,
  p_value numeric
) RETURNS void AS $$
BEGIN
    INSERT INTO Analyses (analys_date, comment, id_analys_type, id_doctor, id_patient, value)
    VALUES (p_analys_date, p_comment, p_id_analys_type, p_id_doctor, p_id_patient, p_value);
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION add_diagnosis (
  p_diagnos_date TIMESTAMP,
  p_id_diagnos UUID,
  p_id_doctor UUID,
  p_id_patient UUID,
  p_is_confirmed BOOLEAN,
  p_recomendations TEXT,
  p_symptoms TEXT,
  p_id_therapist UUID
) RETURNS UUID AS $$
DECLARE
    new_id UUID;
BEGIN
    INSERT INTO Sick_Histories (diagnos_date, id_diagnos, id_doctor, id_patient, is_confirmed, recomendations, symptoms, id_therapist)
    VALUES (p_diagnos_date, p_id_diagnos, p_id_doctor, p_id_patient, p_is_confirmed, p_recomendations, p_symptoms, p_id_therapist)
    RETURNING id INTO new_id;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION update_sick_history (
  p_id uuid,
  p_is_confirmed boolean,
  p_id_therapist uuid
) RETURNS void AS $$
BEGIN
    UPDATE Sick_Histories
    SET is_confirmed = p_is_confirmed,
        therapist_id = p_id_therapist
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION get_referral_statuses () RETURNS TABLE (id UUID, name TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT id, name FROM Referral_Statuses;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION get_ldms () RETURNS TABLE (
  id UUID,
  description TEXT,
  id_ldm_type UUID,
  ldm_type_name TEXT,
  id_position UUID,
  position_name TEXT,
  is_available BOOLEAN,
  name TEXT,
  price NUMERIC,
  duration INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.id, 
        l.description, 
        l.id_ldm_type, 
        lt.name AS ldm_type_name,
        l.id_position, 
        p.name AS position_name,
        l.is_available, 
        l.name, 
        l.price, 
        l.time 
    FROM 
        Ldms l
    LEFT JOIN 
        Ldm_Types lt ON l.id_ldm_type = lt.id
    LEFT JOIN 
        Positions p ON l.id_position = p.id;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION get_gospitalization_referrals () RETURNS TABLE (
  id UUID,
  creation_date TIMESTAMP,
  id_patient UUID,
  patient_lastname TEXT,
  patient_name TEXT,
  patient_surname TEXT,
  id_status UUID,
  status_name TEXT,
  id_terapevt UUID,
  terapevt_lastname TEXT,
  terapevt_name TEXT,
  terapevt_surname TEXT,
  reason TEXT,
  start_date TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        gr.id, 
        gr.creation_date, 
        gr.id_patient, 
        p.lastname AS patient_lastname, 
        p.name AS patient_name, 
        p.surname AS patient_surname,
        gr.id_status, 
        rs.name AS status_name,
        gr.id_terapevt, 
        d.lastname AS terapevt_lastname, 
        d.name AS terapevt_name, 
        d.surname AS terapevt_surname,
        gr.reason, 
        gr.start_date 
    FROM 
        Gospitalization_Referrals gr
    LEFT JOIN 
        Patients p ON gr.id_patient = p.id
    LEFT JOIN 
        Referral_Statuses rs ON gr.id_status = rs.id
    LEFT JOIN 
        Doctors d ON gr.id_terapevt = d.id;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION get_appointment_referrals () RETURNS TABLE (
  id UUID,
  id_ldm UUID,
  ldm_name TEXT,
  id_patient UUID,
  patient_lastname TEXT,
  patient_name TEXT,
  patient_surname TEXT,
  id_referral_maker UUID,
  referral_maker_lastname TEXT,
  referral_maker_name TEXT,
  referral_maker_surname TEXT,
  is_confirmed BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ar.id, 
        ar.id_ldm, 
        l.name AS ldm_name,
        ar.id_patient, 
        p.lastname AS patient_lastname, 
        p.name AS patient_name, 
        p.surname AS patient_surname,
        ar.id_referral_maker, 
        d.lastname AS referral_maker_lastname, 
        d.name AS referral_maker_name, 
        d.surname AS referral_maker_surname,
        ar.is_confirmed
    FROM 
        Appointment_Referrals ar
    LEFT JOIN 
        Ldms l ON ar.id_ldm = l.id
    LEFT JOIN 
        Patients p ON ar.id_patient = p.id
    LEFT JOIN 
        Doctors d ON ar.id_referral_maker = d.id;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION get_appointments () RETURNS TABLE (
  id UUID,
  complaints TEXT,
  id_doctor_location UUID,
  id_ldm UUID,
  ldm_name TEXT,
  id_patient UUID,
  patient_lastname TEXT,
  patient_name TEXT,
  patient_surname TEXT,
  is_confirmed BOOLEAN,
  ldm_datetime TIMESTAMP,
  doctor_id UUID,
  doctor_lastname TEXT,
  doctor_name TEXT,
  doctor_surname TEXT,
  doctor_position_id UUID,
  cabinet_id UUID,
  cabinet_num INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id, 
        a.complaints,
        a.id_doctor_location,
        a.id_ldm, 
        l.name AS ldm_name,
        a.id_patient, 
        p.lastname AS patient_lastname, 
        p.name AS patient_name, 
        p.surname AS patient_surname,
        a.is_confirmed,
        a.ldm_datetime,
        d.id AS doctor_id,
        d.lastname AS doctor_lastname,
        d.name AS doctor_name,
        d.surname AS doctor_surname,
        d.id_position AS doctor_position_id,
        c.id AS cabinet_id,
        c.num AS cabinet_num
    FROM 
        Appointments a
    LEFT JOIN 
        Doctor_Locations dl ON a.id_doctor_location = dl.id
    LEFT JOIN 
        Ldms l ON a.id_ldm = l.id
    LEFT JOIN 
        Patients p ON a.id_patient = p.id
    LEFT JOIN 
        Doctors d ON dl.id_doctor = d.id
    LEFT JOIN 
        Cabinets c ON dl.id_cabinet = c.id;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION get_doctor_locations () RETURNS TABLE (
  id UUID,
  id_cabinet UUID,
  cabinet_name TEXT,
  id_doctor UUID,
  doctor_lastname TEXT,
  doctor_name TEXT,
  doctor_surname TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dl.id, 
        dl.id_cabinet,
        c.name AS cabinet_name,
        dl.id_doctor, 
        d.lastname AS doctor_lastname, 
        d.name AS doctor_name, 
        d.surname AS doctor_surname
    FROM 
        Doctor_Locations dl
    LEFT JOIN 
        Cabinets c ON dl.id_cabinet = c.id
    LEFT JOIN 
        Doctors d ON dl.id_doctor = d.id;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION get_doctor_locations_with_ldms () RETURNS TABLE (
  doctor_location_id UUID,
  cabinet_id UUID,
  doctor_id UUID,
  doctor_lastname TEXT,
  doctor_name TEXT,
  doctor_surname TEXT,
  doctor_position_id UUID,
  doctor_position_name TEXT,
  doctor_is_available BOOLEAN,
  ldm_id UUID,
  ldm_name TEXT,
  ldm_description TEXT,
  ldm_type_id UUID,
  ldm_type_name TEXT,
  ldm_is_available BOOLEAN,
  ldm_price NUMERIC,
  ldm_time INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dl.id AS doctor_location_id,
        dl.id_cabinet AS cabinet_id,
        d.id AS doctor_id,
        d.lastname AS doctor_lastname,
        d.name AS doctor_name,
        d.surname AS doctor_surname,
        d.id_position AS doctor_position_id,
        p.name AS doctor_position_name,
        d.is_available AS doctor_is_available,
        l.id AS ldm_id,
        l.name AS ldm_name,
        l.description AS ldm_description,
        l.id_ldm_type AS ldm_type_id,
        lt.name AS ldm_type_name,
        l.is_available AS ldm_is_available,
        l.price AS ldm_price,
        l.time AS ldm_time
    FROM 
        Doctor_Locations dl
    JOIN 
        Doctors d ON dl.id_doctor = d.id
    JOIN 
        Positions p ON d.id_position = p.id
    LEFT JOIN 
        Ldms l ON p.id = l.id_position
    LEFT JOIN 
        Ldm_Types lt ON l.id_ldm_type = lt.id;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION add_appointment (
  p_complaints TEXT,
  p_id_doctor_location UUID,
  p_id_ldm UUID,
  p_id_patient UUID,
  p_is_confirmed BOOLEAN,
  p_ldm_datetime TIMESTAMP
) RETURNS UUID AS $$
DECLARE
  new_appointment_id UUID;
BEGIN
  INSERT INTO Appointments (complaints, id_doctor_location, id_ldm, id_patient, is_confirmed, ldm_datetime)
  VALUES (p_complaints, p_id_doctor_location, p_id_ldm, p_id_patient, p_is_confirmed, p_ldm_datetime)
  RETURNING id INTO new_appointment_id;

  RETURN new_appointment_id;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION add_appointment_referral (
  _id_ldm UUID,
  _id_patient UUID,
  _id_referral_maker UUID,
  _is_confirmed BOOLEAN
) RETURNS UUID AS $$
DECLARE
    _id UUID;
BEGIN
    INSERT INTO Appointment_Referrals (id_ldm, id_patient, id_referral_maker, is_confirmed)
    VALUES (_id_ldm, _id_patient, _id_referral_maker, _is_confirmed)
    RETURNING id INTO _id;
    RETURN _id;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION add_gospitalization_referral (
  _creation_date TIMESTAMP,
  _id_patient UUID,
  _id_terapevt UUID,
  _reason TEXT,
  _start_date TIMESTAMP
) RETURNS UUID AS $$
DECLARE
    _id UUID;
    _status_id UUID;
BEGIN
    SELECT id INTO _status_id
    FROM Referral_Statuses
    WHERE name = 'Не подтверждено'
    LIMIT 1;

    IF _status_id IS NULL THEN
        RAISE EXCEPTION 'Status with name "Не подтверждено" not found';
    END IF;

    INSERT INTO Gospitalization_Referrals (creation_date, id_patient, id_status, id_terapevt, reason, start_date)
    VALUES (_creation_date, _id_patient, _status_id, _id_terapevt, _reason, _start_date)
    RETURNING id INTO _id;

    RETURN _id;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION add_user_and_doctor (
  _username TEXT,
  _login TEXT,
  _password TEXT,
  _photo TEXT,
  _id_position UUID,
  _is_archived BOOLEAN,
  _is_available BOOLEAN,
  _lastname TEXT,
  _name TEXT,
  _surname TEXT
) RETURNS TABLE (user_id UUID, doctor_id UUID) AS $$
DECLARE
    doctor_role_id UUID;
BEGIN
    -- Найти роль "doctor"
    SELECT id INTO doctor_role_id
    FROM Roles
    WHERE name = 'doctor'
    LIMIT 1;

    -- Если роль "doctor" не найдена, вызвать исключение
    IF doctor_role_id IS NULL THEN
        RAISE EXCEPTION 'Role "doctor" not found';
    END IF;

    -- Создать пользователя
    INSERT INTO Users (username, login, password, photo, id_role)
    VALUES (_username, _login, _password, _photo, doctor_role_id)
    RETURNING id INTO user_id;

    -- Создать врача
    INSERT INTO Doctors (id_position, id_user, is_archived, is_available, lastname, name, surname)
    VALUES (_id_position, user_id, _is_archived, _is_available, _lastname, _name, _surname)
    RETURNING id INTO doctor_id;

    -- Вернуть ID пользователя и врача
    RETURN QUERY SELECT user_id, doctor_id;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION add_user_and_patient (
  _username TEXT,
  _login TEXT,
  _password TEXT,
  _photo TEXT,
  _id_gender UUID,
  _is_archived BOOLEAN,
  _lastname TEXT,
  _name TEXT,
  _surname TEXT,
  _address TEXT,
  _birthday DATE,
  _email TEXT,
  _phone TEXT,
  _med_date DATE,
  _passport_num TEXT,
  _passport_series TEXT,
  _polis_final_date DATE,
  _polis_num TEXT
) RETURNS TABLE (user_id UUID, patient_id UUID) AS $$
DECLARE
    patient_role_id UUID;
BEGIN
    -- Найти роль "patient"
    SELECT id INTO patient_role_id
    FROM Roles
    WHERE name = 'patient'
    LIMIT 1;

    -- Если роль "patient" не найдена, вызвать исключение
    IF patient_role_id IS NULL THEN
        RAISE EXCEPTION 'Role "patient" not found';
    END IF;

    -- Создать пользователя
    INSERT INTO Users (username, login, password, photo, id_role)
    VALUES (_username, _login, _password, _photo, patient_role_id)
    RETURNING id INTO user_id;

    -- Создать пациента
    INSERT INTO Patients (lastname, name, surname, address, birthday, email, phone, id_gender, id_user, is_archived, med_date, passport_num, passport_series, polis_final_date, polis_num)
    VALUES (_lastname, _name, _surname, _address, _birthday, _email, _phone, _id_gender, user_id, _is_archived, _med_date, _passport_num, _passport_series, _polis_final_date, _polis_num)
    RETURNING id INTO patient_id;

    -- Вернуть ID пользователя и пациента
    RETURN QUERY SELECT user_id, patient_id;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION get_positions () RETURNS TABLE (id UUID, name TEXT) AS $$
BEGIN
    RETURN QUERY SELECT Positions.id, Positions.name FROM Positions;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION confirm_appointment_referral (appointment_id UUID) RETURNS VOID AS $$
BEGIN
    UPDATE appointment_referrals
    SET is_confirmed = TRUE
    WHERE id = appointment_id;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION get_gospitalizations () RETURNS TABLE (
  gospitalization_id UUID,
  gospitalization_start_date DATE,
  gospitalization_end_date DATE,
  referral_id UUID,
  referral_creation_date TIMESTAMP,
  patient_id UUID,
  patient_lastname TEXT,
  patient_name TEXT,
  patient_surname TEXT,
  status_id UUID,
  status_name TEXT,
  terapevt_id UUID,
  terapevt_lastname TEXT,
  terapevt_name TEXT,
  terapevt_surname TEXT,
  referral_reason TEXT,
  referral_start_date TIMESTAMP,
  place_id UUID,
  place_num TEXT,
  ward_id UUID,
  ward_num TEXT,
  department_id UUID,
  department_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        g.id AS gospitalization_id,
        g.start_date AS gospitalization_start_date,
        g.end_date AS gospitalization_end_date,
        gr.id AS referral_id,
        gr.creation_date AS referral_creation_date,
        p.id AS patient_id,
        p.lastname AS patient_lastname,
        p.name AS patient_name,
        p.surname AS patient_surname,
        rs.id AS status_id,
        rs.name AS status_name,
        d.id AS terapevt_id,
        d.lastname AS terapevt_lastname,
        d.name AS terapevt_name,
        d.surname AS terapevt_surname,
        gr.reason AS referral_reason,
        gr.start_date AS referral_start_date,
        pl.id AS place_id,
        pl.num AS place_num,
        w.id AS ward_id,
        w.num AS ward_num,
        dept.id AS department_id,
        dept.name AS department_name
    FROM 
        Gospitalizations g
    LEFT JOIN 
        Gospitalization_Referrals gr ON g.Id_gospitalization_referral = gr.id
    LEFT JOIN 
        Patients p ON gr.id_patient = p.id
    LEFT JOIN 
        Referral_Statuses rs ON gr.id_status = rs.id
    LEFT JOIN 
        Doctors d ON gr.id_terapevt = d.id
    LEFT JOIN 
        Places pl ON g.Id_place = pl.id
    LEFT JOIN 
        Wards w ON pl.id_ward = w.id
    LEFT JOIN 
        Departments dept ON w.id_department = dept.id;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION get_status_id_by_name (status_name TEXT) RETURNS UUID AS $$
DECLARE
    status_id UUID;
BEGIN
    SELECT id INTO status_id
    FROM referral_statuses
    WHERE name = status_name;
    RETURN status_id;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION update_referral_status (referral_id UUID, status_id UUID) RETURNS VOID AS $$
BEGIN
    UPDATE Gospitalization_Referrals
    SET id_status = status_id
    WHERE id = referral_id;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION create_gospitalization (
  p_id_gospitalization_referral UUID,
  p_id_place UUID,
  p_start_date DATE,
  p_end_date DATE DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO Gospitalizations (Id_gospitalization_referral, Id_place, Start_date, End_date)
    VALUES (p_id_gospitalization_referral, p_id_place, p_start_date, p_end_date);
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION get_available_places (p_planned_start_date DATE) RETURNS TABLE (
  place_id UUID,
  place_num TEXT,
  ward_id UUID,
  ward_num TEXT,
  department_id UUID,
  department_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pl.id AS place_id,
        pl.num AS place_num,
        w.id AS ward_id,
        w.num AS ward_num,
        dept.id AS department_id,
        dept.name AS department_name
    FROM 
        Places pl
    LEFT JOIN 
        Wards w ON pl.id_ward = w.id
    LEFT JOIN 
        Departments dept ON w.id_department = dept.id
    WHERE 
        pl.id NOT IN (
            SELECT 
                g.Id_place
            FROM 
                Gospitalizations g
            WHERE 
                g.end_date IS NULL OR g.end_date >= p_planned_start_date
        );
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_departments()
RETURNS TABLE (
    id UUID,
    name TEXT
) AS $$
BEGIN
    RETURN QUERY SELECT Departments.id, Departments.name FROM Departments;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_wards_by_department(department_id UUID)
RETURNS TABLE (
    id UUID,
    num TEXT
) AS $$
BEGIN
    RETURN QUERY SELECT Wards.id, Wards.num FROM Wards WHERE id_department = department_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_available_beds_by_ward(ward_id UUID, planned_start_date DATE)
RETURNS TABLE (
    place_id UUID,
    place_num TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT pl.id, pl.num
    FROM Places pl
    LEFT JOIN Gospitalizations g ON pl.id = g.id_place
    WHERE pl.id_ward = ward_id
    AND (g.end_date IS NULL OR g.end_date <= planned_start_date);
END;
$$ LANGUAGE plpgsql;