-- Insert data into Brand table
INSERT INTO Brand (id, brand_name) VALUES
(1, 'Dell'),
(2, 'HP'),
(3, 'Lenovo'),
(4, 'Asus'),
(5, 'Acer'),
(6, 'Apple'),
(7, 'Microsoft'),
(8, 'Samsung'),
(9, 'LG'),
(10, 'Sony'),
(11, 'Toshiba');
-- Insert data into Cpu table
INSERT INTO Cpu (id, cpu_name) VALUES
(1, 'Intel Core i5'),
(2, 'Intel Core i7'),
(3, 'Intel Core i9'),
(4, 'AMD Ryzen 5'),
(5, 'AMD Ryzen 7'),
(6, 'AMD Ryzen 9'),
(7, 'Qualcomm Snapdragon'),
(8, 'Apple M1');
-- Insert data into DiskType table
INSERT INTO DiskType (id, type_name) VALUES
(1, 'HDD'),
(2, 'SSD'),
(3, 'NVMe SSD');
-- Insert data into Ram table
INSERT INTO Ram (id, ram_name, ram_value) VALUES
(1, 'DDR4', 8),
(2, 'DDR4', 16),
(3, 'DDR4', 32),
(4, 'DDR4', 64),
(5, 'LPDDR4X', 8),
(6, 'LPDDR4X', 16),
(7, 'LPDDR4X', 32),
(8, 'LPDDR4X', 64),
(9, 'DDR3', 8),
(10, 'DDR3', 16),
(11, 'DDR3', 32),
(12, 'DDR3', 64),
(13, 'LPDDR3', 8),
(14, 'LPDDR3', 16),
(15, 'LPDDR3', 32),
(16, 'LPDDR3', 64),
(17, 'DDR5', 16),
(18, 'DDR5', 32),
(19, 'DDR5', 64);
-- Insert data into Screen table
INSERT INTO Screen (id, size_name, size_value) VALUES
(1, '13.3 inch', 13.3),
(2, '14 inch', 14),
(3, '15.6 inch', 15.6),
(4, '17.3 inch', 17.3);
-- Insert data into Model table
INSERT INTO Model (id, brand_id, model_name, screen_id, cpu_id, ram_id, disktype_id, disk_size) VALUES
(1, 1, 'Dell XPS 13', 1,1, 1, 2, 512),
(2, 2, 'HP Spectre x360', 2, 3, 6,1, 1),
(3, 3, 'Lenovo ThinkPad X1 Carbon', 2, 2, 4, 2, 256),
(4, 4, 'Asus ZenBook UX425', 1, 2, 10,3, 512),
(5, 5, 'Acer Swift 3', 2, 1, 2, 1, 256),
(6, 6, 'MacBook Air', 1, 8, 2, 3,512),
(7, 7, 'Surface Laptop 4', 2, 6, 7, 1, 512),
(8, 8, 'Samsung Galaxy Book Pro', 1, 5, 5, 3, 512),
(9, 9, 'LG Gram 17', 3, 2, 15,1, 1),
(10, 10, 'Sony VAIO S', 2, 1, 11, 2, 256),
(11,11, 'Toshiba Portege Z30', 1, 2, 11, 1, 512);
-- Insert data into LapTop table
INSERT INTO LapTop (id, model_id, sales_price) VALUES
(1, 1, null),
(2, 2, null),
(3, 3, null),
(4, 4, null),
(5, 5, null),
(6, 6, null),
(7, 7, null),
(8, 8, null),
(9, 9, null),
(10, 10, null),
(11, 11, null);

-- Insert data into StoreCategory table
INSERT INTO StoreCategory (id, category_name, category_level) VALUES
(1, 'Magasin', 0),
(2, 'Point de ventes', 10);

-- Insert data into Location table
INSERT INTO Location (id, location_name) VALUES
(1, 'Analamanga'),
(2, 'Ambohidratrimo'),
(3, 'Andramasina'),
(4, 'Antananarivo Renivohitra'),
(5, 'Antehiroka'),
(6, 'Antsahavola'),
(7, 'Antsakaviro'),
(8, 'Antsampandrano'),
(9, 'Behoririka'),
(10, 'Isoraka');

-- Insert data into Store table
INSERT INTO Store (id, category_id, location_id, store_name) VALUES
(1, 1, 1, 'Mikolo Analamanga'),
(2, 2, 2, 'Mikolo Ambohidratrimo'),
(3, 2, 3, 'Mikolo Andramasina'),
(4, 2, 4, 'Mikolo Renivohitra'),
(5, 2, 5, 'Mikolo Antehiroka'),
(6, 2, 6, 'Mikolo Antsahavola'),
(7, 2, 7, 'Mikolo Antsakaviro'),
(8, 2, 8, 'Mikolo Antsampandrano'),
(9, 2, 9, 'Mikolo Behoririka'),
(10,2, 10, 'Mikolo Isoraka');

-- Insert data into Profil table
INSERT INTO Profil (id, profil_name, profil_level) VALUES
(1, 'Manager', 2),
(2, 'Salesperson', 1);
-- Insert data into Employee table
INSERT INTO Employee (id, profil_id, firstname, lastname, birthday, email, passwd,store_id) VALUES
(1, 2, 'John', 'Doe', '1990-01-01', 'johndoe@example.com', crypt('password', gen_salt('bf')),2),
(2, 2, 'Jane', 'Doe', '1985-05-05', 'janedoe@example.com', crypt('password', gen_salt('bf')),3),
(3, 1, 'Admin', 'User', '1980-10-10', 'admin@example.com', crypt('password', gen_salt('bf')),1);

-- Insert data into Transaction_type table
INSERT INTO Transaction_type (id, transaction_name, transaction_level) VALUES
(1, 'Input', 10),
(2, 'output', -10);


INSERT INTO Model ( id,brand_id, model_name, screen_id, cpu_id, ram_id, disktype_id, disk_size) VALUES
(default, 1, 'Dell Inspiron 15', 3, 2, 3, 2, 1000),
(default, 2, 'HP Pavilion 14', 2, 3, 3, 2, 512),
(default, 3, 'Lenovo Yoga C940', 2, 2, 6, 2, 1000),
(default, 4, 'Asus ZenBook 14', 2, 3, 3, 2, 512),
(default, 4, 'Asus ROG Strix G15', 4, 4, 4, 3, 1000),
(default, 5, 'Acer Predator Helios 300', 4, 4, 6, 3, 1000),
(default, 6, 'MacBook Pro', 1, 8, 8, 3, 512),
(default, 7, 'Microsoft Surface Book 3', 4, 4, 8, 3, 1000),
(default, 8, 'Samsung Galaxy Book Flex 2', 2, 3, 3, 3, 512),
(default, 8, 'Samsung Galaxy Chromebook', 1, 8, 7, 2, 256);