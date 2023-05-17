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
  passwd varchar not null
);

CREATE TABLE Manager (
  employee_id integer REFERENCES Employee(id),
  store_id integer REFERENCES Store(id) not null,
  PRIMARY KEY (employee_id)
);

CREATE TABLE Purchase (
  id SERIAL PRIMARY KEY,
  laptop_id integer REFERENCES LapTop(id) not null,
  qtt  positive_int not null check(qtt>0) default 1,
  purchase_price decimal_scale not null,
  purchase_date date not null default CURRENT_DATE,
  manager_id integer REFERENCES Manager(employee_id) not null
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
  status_id integer REFERENCES Stock_status(id) not null,
  transaction_id integer REFERENCES Transaction_type(id) not null
);

CREATE TABLE Transfer (
  id SERIAL PRIMARY KEY,
  transfer_date date not null default CURRENT_DATE,
  manager_id integer REFERENCES Manager(employee_id) not null,
  store_to integer REFERENCES Store(id) not null,
  stock_id integer REFERENCES Stock(id) not null,
  qtt positive_int not null check(qtt>0) default 1
);

CREATE TABLE Validation_status (
  id SERIAL PRIMARY KEY,
  status_name varchar unique not null,
  status_value smallint unique not null
);

CREATE TABLE Reception (
  id SERIAL PRIMARY KEY,
  validation_date date not null default CURRENT_DATE,
  status_id integer REFERENCES Validation_status(id) not null,
  manager_id integer REFERENCES Manager(employee_id) not null,
  qtt_received positive_int not null check(qtt_received>0)
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