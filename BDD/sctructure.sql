-- DATABASES
-- \c postgres
-- DROP DATABASE eval_mai_2023;
-- CREATE DATABASE eval_mai_2023;
-- \c eval_mai_2023

-- Extension
CREATE EXTENSION pgcrypto;
CREATE EXTENSION IF NOT EXISTS tablefunc;


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


SELECT s.store_name AS "Store",
       EXTRACT('month'from sa.purchase_date) AS "Month",
       SUM(sa.qtt) AS "Total Sales",
       SUM(sa.qtt * sa.purchase_price) AS "Total Price"
FROM Sale sa
INNER JOIN Store s ON sa.store_id = s.id
GROUP BY s.store_name, "Month"
ORDER BY s.store_name, "Month";

SELECT s.store_name AS "Store",
       EXTRACT('month'from sa.purchase_date) "month",
       SUM(sa.qtt) AS "Total Sales",
       SUM(sa.qtt * sa.purchase_price) AS "Total Price"
FROM Sale sa
INNER JOIN Store s ON sa.store_id = s.id
GROUP BY s.store_name, "month";


-- CREATE VIEW monthly_sales_view AS
SELECT
  s.store_name,
  SUM(CASE WHEN EXTRACT(MONTH FROM sa.purchase_date) = 1 THEN sa.qtt * sa.purchase_price ELSE 0 END) AS jan,
  SUM(CASE WHEN EXTRACT(MONTH FROM sa.purchase_date) = 2 THEN sa.qtt * sa.purchase_price ELSE 0 END) AS feb,
  SUM(CASE WHEN EXTRACT(MONTH FROM sa.purchase_date) = 3 THEN sa.qtt * sa.purchase_price ELSE 0 END) AS mar,
  SUM(CASE WHEN EXTRACT(MONTH FROM sa.purchase_date) = 4 THEN sa.qtt * sa.purchase_price ELSE 0 END) AS apr,
  SUM(CASE WHEN EXTRACT(MONTH FROM sa.purchase_date) = 5 THEN sa.qtt * sa.purchase_price ELSE 0 END) AS may,
  SUM(CASE WHEN EXTRACT(MONTH FROM sa.purchase_date) = 6 THEN sa.qtt * sa.purchase_price ELSE 0 END) AS jun,
  SUM(CASE WHEN EXTRACT(MONTH FROM sa.purchase_date) = 7 THEN sa.qtt * sa.purchase_price ELSE 0 END) AS jul,
  SUM(CASE WHEN EXTRACT(MONTH FROM sa.purchase_date) = 8 THEN sa.qtt * sa.purchase_price ELSE 0 END) AS aug,
  SUM(CASE WHEN EXTRACT(MONTH FROM sa.purchase_date) = 9 THEN sa.qtt * sa.purchase_price ELSE 0 END) AS sep,
  SUM(CASE WHEN EXTRACT(MONTH FROM sa.purchase_date) = 10 THEN sa.qtt * sa.purchase_price ELSE 0 END) AS oct,
  SUM(CASE WHEN EXTRACT(MONTH FROM sa.purchase_date) = 11 THEN sa.qtt * sa.purchase_price ELSE 0 END) AS nov,
  SUM(CASE WHEN EXTRACT(MONTH FROM sa.purchase_date) = 12 THEN sa.qtt * sa.purchase_price ELSE 0 END) AS dec
FROM
  Sale sa
  INNER JOIN Store s ON sa.store_id = s.id
GROUP BY
  s.store_name;



-- stats


CREATE OR REPLACE VIEW v_global_sales AS
SELECT EXTRACT('month' from purchase_date) "month",EXTRACT('year' from purchase_date) "year",COALESCE(sum(purchase_price*qtt),0) total_price, COALESCE(sum(qtt),0) total_qtt
from sale group by "year","month";


CREATE OR REPLACE VIEW v_store_sales AS
SELECT EXTRACT('month' from purchase_date) "month",EXTRACT('year' from purchase_date) "year",store_id,COALESCE(sum(purchase_price*qtt),0) total_price, COALESCE(sum(qtt),0) total_qtt
from sale group by "year","month",store_id;


CREATE OR REPLACE FUNCTION getStoreMonthSales(minYear integer,maxYear integer)
RETURNS TABLE (
  store_id integer,
  month numeric,
  total_price numeric,
  total_qtt numeric
)
AS $$
BEGIN
  RETURN QUERY
  SELECT v.store_id,v."month",sum(v.total_price) total_price,sum(v.total_qtt) total_qtt 
  from v_store_sales v where v."year" BETWEEN COALESCE(minYear,'1980') AND COALESCE(maxYear,'2080') group by v."month",v.store_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION getGlobalMonthSales(minYear integer,maxYear integer)
RETURNS TABLE (
  month numeric,
  total_price numeric,
  total_qtt numeric
)
AS $$
BEGIN
  RETURN QUERY
  SELECT v."month",sum(v.total_price) total_price,sum(v.total_qtt) total_qtt 
  from v_global_sales v where v."year" BETWEEN COALESCE(minYear,'1980') AND COALESCE(maxYear,'2080') group by v."month";
END;
$$ LANGUAGE plpgsql;


SELECT * from getGlobalMonthSales(2022,2023);

SELECT * from getStoreMonthSales(null,null);


CREATE TABLE Month (
  month_number integer PRIMARY KEY,
  month_name varchar(20) NOT NULL
);

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






CREATE OR REPLACE FUNCTION getStoreMonthSalesByYear(min_year INTEGER, max_year INTEGER,value VARCHAR)
RETURNS TABLE (
  store_id INTEGER,
  Janvier NUMERIC,
  Février NUMERIC,
  Mars NUMERIC,
  Avril NUMERIC,
  Mai NUMERIC,
  Juin NUMERIC,
  Juillet NUMERIC,
  Août NUMERIC,
  Septembre NUMERIC,
  Octobre NUMERIC,
  Novembre NUMERIC,
  Décembre NUMERIC
)
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM crosstab(
    format('SELECT s.id store_id, "month", COALESCE(%s, 0)
            FROM store s
            CROSS JOIN month m left join getStoreMonthSales(%s, %s) v ON s.id = v.store_id and m.month_number = v."month" ', value,
            CASE WHEN min_year IS NULL THEN 'null' ELSE min_year::TEXT END,
            CASE WHEN max_year IS NULL THEN 'null' ELSE max_year::TEXT END),
    'SELECT month_number FROM month ORDER BY month_number'
  ) AS (
    store_id INTEGER,
    Janvier NUMERIC,
    Février NUMERIC,
    Mars NUMERIC,
    Avril NUMERIC,
    Mai NUMERIC,
    Juin NUMERIC,
    Juillet NUMERIC,
    Août NUMERIC,
    Septembre NUMERIC,
    Octobre NUMERIC,
    Novembre NUMERIC,
    Décembre NUMERIC
  );
END;
$$ LANGUAGE plpgsql;

SELECT * from getStoreMonthSalesByYear(null,null,'total_price') order by store_id;


-- BENEFICE
CREATE OR REPLACE VIEW v_input AS
SELECT transaction_date,sum(price) input from mouvement where transaction_id=1 group by transaction_date;

CREATE OR REPLACE VIEW v_output AS
SELECT transaction_date,sum(price) output from mouvement where transaction_id=2 group by transaction_date;

CREATE OR REPLACE VIEW v_mouvement AS
SELECT COALESCE(i.transaction_date,o.transaction_date) transaction_date,input,output,input-output benefit from v_input i join v_output o 
on i.transaction_date=o.transaction_date;

CREATE OR REPLACE VIEW v_benefit_sales AS
SELECT EXTRACT('month' from transaction_date) "month",EXTRACT('year' from transaction_date) "year",COALESCE(sum(benefit),0) benefit
from v_mouvement group by "year","month";


CREATE OR REPLACE FUNCTION getBenefitMonthSales(minYear integer,maxYear integer)
RETURNS TABLE (
  month numeric,
  benefit numeric
)
AS $$
BEGIN
  RETURN QUERY
  SELECT v."month",sum(v.benefit) benefit 
  from v_benefit_sales v where v."year" BETWEEN COALESCE(minYear,'1980') AND COALESCE(maxYear,'2080') group by v."month";
END;
$$ LANGUAGE plpgsql;

SELECT * from getBenefitMonthSales(null,null);