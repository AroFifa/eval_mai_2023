
INSERT INTO brand  (id, brand_name) VALUES
(8,'Toshiba'),
(6,'FUJITSU'),
(2,'Dell'),
(3,'Apple'),
(7,'MSIs'),
(5,'Lenovo'),
(4,'Hp');


--
-- Data for Name: commission_level; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO commission_level (id, min, max, commission) VALUES
(2,2000000.00,5000000.00,8.00),
(1,0.00,2000000.00,3.00),
(11,5000000.00,300000000.00,15.00);


--
-- Data for Name: cpu; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO cpu (id, cpu_name) VALUES
(1,'Intel Core i7'),
(3,'Intel Core i9'),
(4,'Apple M1'),
(5,'AMD Ryzen 7'),
(2,'Intel Core i5');

--
-- Data for Name: model; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO model (id, brand_id, model_name, cpu_id, screen_size, ram_size, disk_size) VALUES
(11,1,'1D',1,13.30,16,512),
(12,2,'2A',4,13.30,8,256),
(13,3,'3H',1,15.60,16,1000),
(14,4,'4L',2,14.00,8,256),
(15,5,'5F',5,14.00,16,512),
(16,2,'6A',2,14.00,8,512),
(17,6,'7M',3,15.60,32,1000),
(18,6,'8M',2,13.50,8,128),
(19,7,'9T',1,13.30,16,512),
(20,4,'10L',1,14.00,16,1000);

--
-- Data for Name: laptop; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO laptop (id, model_id, sales_price) VALUES
(1,11,1875000.00),
(2,12,2500000.00),
(3,13,3375000.00),
(4,14,2125000.00),
(5,15,2750000.00),
(6,16,3750000.00),
(7,17,2375000.00),
(8,18,3000000.00),
(9,19,4125000.00),
(10,20,2625000.00);


--
-- Data for Name: location; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO location (id, location_name) VALUES
(1,'Analamanga'),
(2,'Tamatave'),
(3,'Fianarantsoa'),
(4,'Majunga');



--
-- Data for Name: profil; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO profil (id, profil_name, profil_level) VALUES
(1,'Manager',2),
(2,'Salesperson',1);


--
-- Data for Name: storecategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO storecategory (id, category_name, category_level) VALUES
(1,'Magasin',0),
(2,'Point de ventes',10);

--
-- Data for Name: store; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO store (id, category_id, location_id, store_name) VALUES
(1,1,1,'Mikolo Centrale'),
(6,2,2,'Mikolo Tamatave'),
(7,2,3,'Mikolo Fianarantsoa'),
(8,2,4,'Mikolo Majunga');

--
-- Data for Name: employee; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO employee (id, profil_id, firstname, lastname, birthday, email, passwd, store_id) VALUES
(9,1,'Admin','User','1980-10-10','admin@example.com','$2a$06$K/Um6L8eVvLDFYQ0K88gd.P3sGap4zYArryn3qM6AZ5GQW6MFGJ12',1),
(10,2,'Jack','Doe','1989-03-01','jackdoe@example.com','$2a$06$2PO0Kq6ZtcsmyOv9kzvRsOlywZOEGJ8.OXXkGyFs3tMnMFMgmPrZe',6),
(11,2,'John','Doe','1990-01-01','johndoe@example.com','$2a$06$9egV6l6mzTvfoV27vykVVev1j2jQX6JRi9SC7p2QO9/agupN3pu4a',7),
(12,2,'Jane','Doe','1985-05-05','janedoe@example.com','$2a$06$Uq39UyYZGCqn0.TlYJtnieFoyDdOoBFoQBgTqSjMaCgGBp1uf2wka',8);


--
-- Data for Name: month; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO month (month_number, month_name) VALUES
(1,'Janvier'),
(2,'Février'),
(3,'Mars'),
(4,'Avril'),
(5,'Mai'),
(6,'Juin'),
(7,'Juillet'),
(8,'Août'),
(9,'Septembre'),
(10,'Octobre'),
(11,'Novembre'),
(12,'Décembre');


-- --
-- -- Data for Name: mouvement; Type: TABLE DATA; Schema: public; Owner: postgres
-- --

-- INSERT INTO mouvement (id, sale, purchase, transfer, reception, store_id, transaction_date) VALUES
-- (35,0.00,75000000.00,0.00,0.00,\N,2019-05-23),
-- (36,0.00,50000000.00,0.00,0.00,\N,2019-05-23),
-- (37,0.00,81000000.00,0.00,0.00,\N,2019-05-23),
-- (38,0.00,30600000.00,0.00,0.00,\N,2019-05-23),
-- (39,0.00,143000000.00,0.00,0.00,\N,2019-05-23),
-- (40,0.00,126000000.00,0.00,0.00,\N,2019-05-23),
-- (41,0.00,106400000.00,0.00,0.00,\N,2019-05-23),
-- (42,0.00,105600000.00,0.00,0.00,\N,2019-05-23),
-- (43,0.00,244200000.00,0.00,0.00,\N,2019-05-23),
-- (44,0.00,42000000.00,0.00,0.00,\N,2019-05-23),
-- (45,0.00,0.00,18750000.00,0.00,1,2020-05-02),
-- (46,0.00,0.00,62500000.00,0.00,1,2021-05-05),
-- (47,0.00,0.00,45000000.00,0.00,1,2021-09-10),
-- (48,0.00,0.00,101250000.00,0.00,1,2022-06-14),
-- (49,0.00,0.00,123750000.00,0.00,1,2023-05-02),
-- (50,0.00,0.00,0.00,15000000.00,6,2020-05-04),
-- (51,0.00,0.00,0.00,62500000.00,7,2021-05-08),
-- (52,0.00,0.00,0.00,45000000.00,7,2021-09-16),
-- (53,0.00,0.00,0.00,121000000.00,7,2023-05-10),
-- (54,0.00,0.00,0.00,84375000.00,8,2022-06-29),
-- (55,1875000.00,0.00,0.00,0.00,6,2020-05-10),
-- (56,55000000.00,0.00,0.00,0.00,7,2021-05-14),
-- (57,3750000.00,0.00,0.00,0.00,7,2021-09-22),
-- (58,82500000.00,0.00,0.00,0.00,7,2023-05-16),
-- (59,57375000.00,0.00,0.00,0.00,8,2022-07-05);

-- --
-- -- Data for Name: purchase; Type: TABLE DATA; Schema: public; Owner: postgres
-- --

-- INSERT INTO purchase (id, laptop_id, qtt, purchase_price, purchase_date, employee_id) VALUES
-- (12,1,50,1500000.00,2019-05-23,9),
-- (13,2,25,2000000.00,2019-05-23,9),
-- (14,3,30,2700000.00,2019-05-23,9),
-- (15,4,18,1700000.00,2019-05-23,9),
-- (16,5,65,2200000.00,2019-05-23,9),
-- (17,6,42,3000000.00,2019-05-23,9),
-- (18,7,56,1900000.00,2019-05-23,9),
-- (19,8,44,2400000.00,2019-05-23,9),
-- (20,9,74,3300000.00,2019-05-23,9),
-- (21,10,20,2100000.00,2019-05-23,9);


-- --
-- -- Data for Name: reception; Type: TABLE DATA; Schema: public; Owner: postgres
-- --

-- INSERT INTO reception (id, reception_date, employee_id, store_id, laptop_id, qtt) VALUES
-- (6,2020-05-04,10,6,1,8),
-- (7,2021-05-08,11,7,2,25),
-- (8,2021-09-16,11,7,6,12),
-- (9,2023-05-10,11,7,5,44),
-- (10,2022-06-29,12,8,3,25);


-- --
-- -- Data for Name: sale; Type: TABLE DATA; Schema: public; Owner: postgres
-- --

-- INSERT INTO sale (id, laptop_id, qtt, purchase_date, purchase_price, store_id) VALUES
-- 6	1	1	2020-05-10	1875000.00	6
-- 7	2	22	2021-05-14	2500000.00	7
-- 8	6	1	2021-09-22	3750000.00	7
-- 9	5	30	2023-05-16	2750000.00	7
-- 10	3	17	2022-07-05	3375000.00	8
-- \.


-- --
-- -- Data for Name: stock; Type: TABLE DATA; Schema: public; Owner: postgres
-- --

-- INSERT INTO stock (id, transaction_date, store_id, laptop_id, qtt_in, qtt_out) VALUES
-- 33	2019-05-23	1	1	50	0
-- 34	2019-05-23	1	2	25	0
-- 35	2019-05-23	1	3	30	0
-- 36	2019-05-23	1	4	18	0
-- 37	2019-05-23	1	5	65	0
-- 38	2019-05-23	1	6	42	0
-- 39	2019-05-23	1	7	56	0
-- 40	2019-05-23	1	8	44	0
-- 41	2019-05-23	1	9	74	0
-- 42	2019-05-23	1	10	20	0
-- 43	2020-05-02	1	1	0	10
-- 44	2021-05-05	1	2	0	25
-- 45	2021-09-10	1	6	0	12
-- 46	2022-06-14	1	3	0	30
-- 47	2023-05-02	1	5	0	45
-- 48	2020-05-04	6	1	8	0
-- 49	2021-05-08	7	2	25	0
-- 50	2021-09-16	7	6	12	0
-- 51	2023-05-10	7	5	44	0
-- 52	2022-06-29	8	3	25	0
-- 53	2020-05-10	6	1	0	1
-- 54	2021-05-14	7	2	0	22
-- 55	2021-09-22	7	6	0	1
-- 56	2023-05-16	7	5	0	30
-- 57	2022-07-05	8	3	0	17
-- \.




-- --
-- -- Data for Name: transfer; Type: TABLE DATA; Schema: public; Owner: postgres
-- --

-- INSERT INTO transfer (id, transfer_date, employee_id, store_to, store_from, laptop_id, qtt) VALUES
-- 12	2020-05-02	9	6	1	1	10
-- 13	2021-05-05	9	7	1	2	25
-- 14	2021-09-10	9	7	1	6	12
-- 15	2022-06-14	9	8	1	3	30
-- 16	2023-05-02	9	7	1	5	45
-- \.

