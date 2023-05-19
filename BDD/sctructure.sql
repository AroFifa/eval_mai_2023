-- DATABASES
-- \c postgres
-- DROP DATABASE eval_mai_2023;
-- CREATE DATABASE eval_mai_2023;
-- \c eval_mai_2023

-- Extension
CREATE EXTENSION pgcrypto;

-- DOMAIN
CREATE DOMAIN positive_int AS integer check(VALUE>=0);
CREATE DOMAIN decimal_scale AS numeric(18,2) check(VALUE>=0);

-- TABLE
CREATE TABLE Brand (
  id SERIAL PRIMARY KEY,
  brand_name varchar unique not null
);

CREATE TABLE Cpu (
  id SERIAL PRIMARY KEY,
  cpu_name varchar unique not null
);

CREATE TABLE DiskType (
  id SERIAL PRIMARY KEY,
  type_name varchar unique not null
);

CREATE TABLE Ram (
  id SERIAL PRIMARY KEY,
  ram_name varchar not null,
  ram_value positive_int  not null,
  unique (ram_name,ram_value)
);

CREATE TABLE Screen (
  id SERIAL PRIMARY KEY,
  size_name varchar unique not null,
  size_value decimal_scale not null
);

CREATE TABLE Model (
  id SERIAL PRIMARY KEY,
  brand_id integer REFERENCES Brand(id) not null,
  model_name varchar unique not null,
  screen_id integer REFERENCES Screen(id) not null,
  cpu_id integer REFERENCES Cpu(id) not null,
  ram_id integer REFERENCES Ram(id) not null,
  disktype_id integer REFERENCES DiskType(id) not null,
  disk_size positive_int not null not null
);

CREATE TABLE LapTop (
  id SERIAL PRIMARY KEY,
  model_id integer REFERENCES Model(id) not null,
  sales_price decimal_scale
);

CREATE TABLE StoreCategory (
  id SERIAL PRIMARY KEY,
  category_name varchar unique not null,
  category_level smallint unique not null
);

CREATE TABLE Location (
  id SERIAL PRIMARY KEY,
  location_name varchar unique not null
);

CREATE TABLE Store (
  id SERIAL PRIMARY KEY,
  category_id integer  REFERENCES StoreCategory(id) not null,
  location_id integer  REFERENCES Location(id) not null,
  store_name varchar unique not null
);

CREATE TABLE Profil (
  id SERIAL PRIMARY KEY,
  profil_name varchar unique not null,
  profil_level smallint unique not null
);

CREATE TABLE Employee (
  id SERIAL PRIMARY KEY,
  profil_id integer REFERENCES Profil(id) not null,
  firstname varchar,
  lastname varchar,
  birthday  date not null, /*  CHECK (date_naissance < CURRENT_DATE - INTERVAL '18 years'), */
  email varchar unique not null,
  passwd varchar not null,
  store_id integer REFERENCES Store(id)
);

CREATE TABLE Purchase (
  id SERIAL PRIMARY KEY,
  laptop_id integer REFERENCES LapTop(id) not null,
  qtt  positive_int not null check(qtt>0) default 1,
  purchase_price decimal_scale not null,
  purchase_date date not null default CURRENT_DATE,
  employee_id integer REFERENCES Employee(id) not null
);


CREATE TABLE Transaction_type (
  id SERIAL PRIMARY KEY,
  transaction_name varchar unique not null,
  transaction_level smallint unique not null
);

CREATE TABLE Stock (
  id SERIAL PRIMARY KEY,
  transaction_date date not null default CURRENT_DATE,
  store_id integer REFERENCES Store(id) not null,
  laptop_id integer REFERENCES LapTop(id) not null,
  qtt positive_int not null check(qtt>0) default 1,
  transaction_id integer REFERENCES Transaction_type(id) not null
);



CREATE TABLE Transfer (
  id SERIAL PRIMARY KEY,
  transfer_date date not null default CURRENT_DATE,
  employee_id integer REFERENCES Employee(id) not null,
  store_to integer REFERENCES Store(id) not null,
  store_from integer REFERENCES Store(id) not null,
  laptop_id integer REFERENCES LapTop(id) not null,
  qtt positive_int not null check(qtt>0) default 1
  check(store_from <> store_to)
);

CREATE TABLE Reception (
  id SERIAL PRIMARY KEY,
  reception_date date not null default CURRENT_DATE,
  employee_id integer REFERENCES Employee(id) not null,
  store_id integer REFERENCES Store(id) not null,
  laptop_id integer REFERENCES LapTop(id) not null,
  qtt positive_int not null check(qtt>0) default 1
);





CREATE TABLE Sale (
  id SERIAL PRIMARY KEY,
  laptop_id integer REFERENCES LapTop(id) not null,
  qtt positive_int not null check(qtt>0) default 1,
  purchase_date date not null default CURRENT_DATE,
  purchase_price decimal_scale,
  clientName varchar not null,
  store_id integer REFERENCES Store(id) not null
);

CREATE TABLE Mouvement (
  id SERIAL PRIMARY KEY,
  price decimal_scale not null,
  transaction_id integer REFERENCES Transaction_type(id) not null,
  transaction_date date not null default CURRENT_DATE
);

-- VIEW
CREATE OR REPLACE VIEW V_laptop_search AS 
SELECT l.*,m.model_name,m.brand_id,m.brand_name,m.cpu_name,m.ram_name,m.type_name from Laptop l join v_model_tmp m on l.model_id = m.id;

CREATE OR REPLACE VIEW V_model_tmp AS
SELECT m.*,b.brand_name,cpu.cpu_name,r.ram_name,d.type_name from Model m
join Brand b on m.brand_id = b.id 
join Cpu on m.cpu_id = cpu.id
join Ram r on m.ram_id = r.id
join Disktype d on m.disktype_id = d.id;

-- CONSTRAINT
ALTER TABLE laptop ADD CONSTRAINT model_uniquekey UNIQUE (model_id);

-- VIEW 
CREATE OR REPLACE VIEW V_etat_stock_in AS
SELECT laptop_id , store_id , COALESCE(sum(qtt),0) qtt
from stock 
where transaction_id = 1
 group by laptop_id,store_id;

CREATE OR REPLACE VIEW V_etat_stock_out AS
SELECT laptop_id , store_id , COALESCE(sum(qtt),0) qtt
from stock 
where transaction_id = 2
 group by laptop_id,store_id;


CREATE OR REPLACE VIEW V_etat_stock AS
 SELECT
    COALESCE(sin.laptop_id, sout.laptop_id) AS id,
    COALESCE(sin.laptop_id, sout.laptop_id) AS laptop_id,
    COALESCE(sin.store_id, sout.store_id) AS store_id,
    COALESCE(sin.qtt, 0) - COALESCE(sout.qtt, 0) AS qtt
FROM
    V_etat_stock_in AS sin
FULL JOIN
    V_etat_stock_out AS sout ON sin.laptop_id = sout.laptop_id AND sin.store_id = sout.store_id;

CREATE OR REPLACE VIEW V_etat_stock_search as 
SELECT s.*, l.model_name,l.brand_id,l.brand_name,l.cpu_name,l.ram_name,l.type_name from V_etat_stock s join v_laptop_search l  
on s.laptop_id =  l.id;




-- 
-- 
-- 

CREATE OR REPLACE VIEW V_transfer
AS
SELECT laptop_id,store_to as receiver, COALESCE(sum(qtt),0) qtt
from transfer
group by laptop_id, store_to;


CREATE OR REPLACE VIEW V_reception
AS
SELECT laptop_id,store_id as receiver, COALESCE(sum(qtt),0) qtt
from Reception
group by laptop_id, store_id;

CREATE OR REPLACE VIEW V_received AS
SELECT
    COALESCE(t.laptop_id, r.laptop_id) AS laptop_id,
    COALESCE(t.receiver, r.receiver) AS receiver ,
    COALESCE(t.qtt, 0) - COALESCE(r.qtt, 0) AS qtt
    from v_transfer t full join V_reception r 
on t.laptop_id = r.laptop_id 
and t.receiver = r.receiver;


 

CREATE OR REPLACE VIEW v_received_search AS
SELECT
l.*,r.receiver store_id,r.qtt,r.laptop_id
FROM v_received r 
  join V_laptop_search l
  on r.laptop_id = l.id where r.qtt!=0;


