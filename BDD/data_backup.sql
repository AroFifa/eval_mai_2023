
INSERT INTO brand (brand_name) VALUES
('Dell'),
('Apple'),
('Hp'),
('Lenovo'),
('FUJITSU'),
('MSI'),
('Toshiba');


INSERT INTO cpu ( cpu_name) VALUES
('Intel Core i7'),
('Intel Core i5'),
('Intel Core i9'),
('Apple M1'),
('AMD Ryzen 7');

INSERT INTO profil ( profil_name, profil_level) VALUES
('Manager',	2),
('Salesperson',	1);


INSERT INTO location ( location_name) VALUES
('Analamanga'),
('Tamatave'),
('Fianarantsoa'),
('Majunga');

INSERT INTO StoreCategory (id, category_name, category_level) VALUES
(1, 'Magasin', 0),
(2, 'Point de ventes', 10);

INSERT INTO Store (id, category_id, location_id, store_name) VALUES
(1, 1, 1, 'Mikolo Centrale');

INSERT INTO Employee (profil_id, firstname, lastname, birthday, email, passwd,store_id) VALUES
(1, 'Admin', 'User', '1980-10-10', 'admin@example.com', crypt('password', gen_salt('bf')),1),
(2, 'Jack', 'Doe', '1989-03-01', 'jackdoe@example.com', crypt('indro', gen_salt('bf')),null),
(2, 'John', 'Doe', '1990-01-01', 'johndoe@example.com', crypt('password', gen_salt('bf')),null),
(2, 'Jane', 'Doe', '1985-05-05', 'janedoe@example.com', crypt('password', gen_salt('bf')),null);


INSERT INTO store ( category_id, location_id, store_name) VALUES
(2,2,'Mikolo Tamatave'),
(2,3,'Mikolo Fianarantsoa'),
(2,4,'Mikolo Majunga');



INSERT INTO Month (month_number, month_name)
VALUES
  (1, 'Janvier'),
  (2, 'Février'),
  (3, 'Mars'),
  (4, 'Avril'),
  (5, 'Mai'),
  (6, 'Juin'),
  (7, 'Juillet'),
  (8, 'Août'),
  (9, 'Septembre'),
  (10, 'Octobre'),
  (11, 'Novembre'),
  (12, 'Décembre');
