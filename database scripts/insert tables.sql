insert into
  Roles (name)
values
  ('admin'),
  ('doctor'),
  ('patient');

insert into
  Users (username, login, password, photo, id_role)
values
  (
    'Администратор',
    'admin',
    '123',
    'admin.png',
    '124fe2ce-b5f5-4cd8-8d72-787a784f5b26'
  ),
  (
    'Новикова А.М.',
    'NovikovaAM',
    '123',
    'doctor.png',
    '1471303d-10b8-4fa9-818c-f0aaaf1d343d'
  ),
  (
    'Хромченко Л.Е.',
    'HromLE',
    '123',
    'doctor.png',
    '1471303d-10b8-4fa9-818c-f0aaaf1d343d'
  ),
  (
    'Ларин Д.А.',
    'LarinDA',
    '123',
    'patient.jpg',
    '13ee4831-e576-4e1a-b1af-0465aea7c5a5'
  ),
  (
    'Титов А.А.',
    'TitovAA',
    '123',
    'patient.jpg',
    '13ee4831-e576-4e1a-b1af-0465aea7c5a5'
  );

insert into
  Panels (name)
values
  ('DoctorsContentPanel'),
  ('PatientsContentPanel'),
  ('UsersContentPanel'),
  ('GospitalizationsContentPanel'),
  ('PatientLdmViewPanel'),
  ('PatientAppointmentMakePanel'),
  ('PatientAppointmentViewPanel'),
  ('DoctorsAppointmentsPanel'),
  ('PatientAppointmentReferralsViewPanel');

insert into
  Analysis_Types (lower_limit, name, unit, upper_limit)
values
  (12, 'Гемоглобин', 'г/дл', 16),
  (66, 'Общий белок', 'г/л', 83),
  (0.1, 'Общий анализ мочи', 'мг/дл', 1);

insert into
  Departments (name)
values
  ('Кардиология'),
  ('Терапия'),
  ('Клиническая лаборатория'),
  ('Неврология'),
  ('Эндокринология'),
  ('Гастроэнтерология'),
  ('Пульмонология'),
  ('Ревматология'),
  ('Офтальмология'),
  ('Дерматология'),
  ('Урология');

insert into
  Positions (name)
values
  ('Кардиолог'),
  ('Терапевт'),
  ('Лаборант'),
  ('Невролог'),
  ('Эндокринолог'),
  ('Гастроэнтеролог'),
  ('Пульмонолог'),
  ('Ревматолог'),
  ('Офтальмолог'),
  ('Дерматолог'),
  ('Уролог');

insert into
  Ldm_Types (name)
values
  ('Лабораторные анализы'),
  ('Инструментальные исследования'),
  ('Лекарственная терапия'),
  ('Физиотерапия'),
  ('Амбулаторные операции'),
  ('Профилактические осмотры'),
  ('Первичные консультации');

insert into
  Genders (name)
values
  ('мужской'),
  ('женский');

INSERT INTO
  Referral_Statuses (name)
VALUES
  ('Подтверждено'),
  ('Не подтверждено'),
  ('Отменено клиникой'),
  ('Отменено пациентом');




  INSERT INTO Ldms (id, description, id_ldm_type, id_position, is_available, name, price, time) VALUES
(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Инструментальные исследования'), (SELECT id FROM Positions WHERE name = 'Кардиолог'), true, 'Электрокардиограмма', 750, 15),
(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Инструментальные исследования'), (SELECT id FROM Positions WHERE name = 'Кардиолог'), false, 'Эхокардиография', 650, 30),
(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Инструментальные исследования'), (SELECT id FROM Positions WHERE name = 'Кардиолог'), false, 'Холтеровское мониторирование', 1000, 24),

(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Лабораторные анализы'), (SELECT id FROM Positions WHERE name = 'Терапевт'), true, 'Общий анализ крови', 350, 15),
(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Лабораторные анализы'), (SELECT id FROM Positions WHERE name = 'Терапевт'), false, 'Общий анализ мочи', 370, 15),
(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Лабораторные анализы'), (SELECT id FROM Positions WHERE name = 'Терапевт'), false, 'Биохимический анализ крови', 500, 30),

(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Лабораторные анализы'), (SELECT id FROM Positions WHERE name = 'Лаборант'), true, 'Общий анализ крови', 350, 15),
(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Лабораторные анализы'), (SELECT id FROM Positions WHERE name = 'Лаборант'), true, 'Общий анализ мочи', 370, 15),
(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Лабораторные анализы'), (SELECT id FROM Positions WHERE name = 'Лаборант'), true, 'Биохимический анализ крови', 500, 30),
(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Лабораторные анализы'), (SELECT id FROM Positions WHERE name = 'Лаборант'), true, 'Анализ на гормоны', 600, 30),
(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Лабораторные анализы'), (SELECT id FROM Positions WHERE name = 'Лаборант'), true, 'Анализ на инфекции', 700, 30),

(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Инструментальные исследования'), (SELECT id FROM Positions WHERE name = 'Невролог'), true, 'Электроэнцефалография', 850, 30),
(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Первичные консультации'), (SELECT id FROM Positions WHERE name = 'Невролог'), false, 'Неврологический осмотр', 500, 30),
(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Инструментальные исследования'), (SELECT id FROM Positions WHERE name = 'Невролог'), false, 'Люмбальная пункция', 1200, 60),

(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Лабораторные анализы'), (SELECT id FROM Positions WHERE name = 'Эндокринолог'), true, 'Анализ на уровень глюкозы в крови', 400, 15),
(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Лабораторные анализы'), (SELECT id FROM Positions WHERE name = 'Эндокринолог'), false, 'Анализ на гормоны щитовидной железы', 700, 30),
(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Инструментальные исследования'), (SELECT id FROM Positions WHERE name = 'Эндокринолог'), false, 'УЗИ щитовидной железы', 800, 30),

(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Инструментальные исследования'), (SELECT id FROM Positions WHERE name = 'Гастроэнтеролог'), true, 'УЗИ органов брюшной полости', 600, 30),
(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Инструментальные исследования'), (SELECT id FROM Positions WHERE name = 'Гастроэнтеролог'), false, 'Гастроскопия', 1500, 60),
(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Лабораторные анализы'), (SELECT id FROM Positions WHERE name = 'Гастроэнтеролог'), false, 'Анализ на хеликобактер пилори', 500, 30),

(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Инструментальные исследования'), (SELECT id FROM Positions WHERE name = 'Пульмонолог'), true, 'Спирография', 500, 30),
(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Инструментальные исследования'), (SELECT id FROM Positions WHERE name = 'Пульмонолог'), false, 'КТ органов грудной клетки', 2000, 60),
(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Инструментальные исследования'), (SELECT id FROM Positions WHERE name = 'Пульмонолог'), false, 'Бронхоскопия', 2500, 60),

(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Лабораторные анализы'), (SELECT id FROM Positions WHERE name = 'Ревматолог'), true, 'Анализ на ревматоидный фактор', 450, 30),
(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Инструментальные исследования'), (SELECT id FROM Positions WHERE name = 'Ревматолог'), false, 'МРТ суставов', 3000, 60),
(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Инструментальные исследования'), (SELECT id FROM Positions WHERE name = 'Ревматолог'), false, 'Сцинтиграфия костей', 3500, 60),

(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Инструментальные исследования'), (SELECT id FROM Positions WHERE name = 'Офтальмолог'), true, 'Визометрия', 200, 15),
(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Инструментальные исследования'), (SELECT id FROM Positions WHERE name = 'Офтальмолог'), false, 'Периметрия', 300, 30),
(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Инструментальные исследования'), (SELECT id FROM Positions WHERE name = 'Офтальмолог'), false, 'Тонометрия глаза', 250, 30),

(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Инструментальные исследования'), (SELECT id FROM Positions WHERE name = 'Дерматолог'), true, 'Дерматоскопия', 500, 30),
(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Инструментальные анализы'), (SELECT id FROM Positions WHERE name = 'Дерматолог'), false, 'Биопсия кожи', 1000, 60),
(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Лабораторные анализы'), (SELECT id FROM Positions WHERE name = 'Дерматолог'), false, 'Аллергические пробы', 700, 30),

(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Инструментальные исследования'), (SELECT id FROM Positions WHERE name = 'Уролог'), true, 'УЗИ почек и мочевого пузыря', 600, 30),
(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Лабораторные анализы'), (SELECT id FROM Positions WHERE name = 'Уролог'), false, 'Анализ мочи на инфекции', 400, 30),
(uuid_generate_v4(), '', (SELECT id FROM Ldm_Types WHERE name = 'Инструментальные исследования'), (SELECT id FROM Positions WHERE name = 'Уролог'), false, 'Цистоскопия', 2000, 60);

