-- DATABASES
-- \c postgres
-- DROP DATABASE eval_mai_2023;
-- CREATE DATABASE eval_v3;
-- \c eval_v3;

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


CREATE TABLE Model (
  id SERIAL PRIMARY KEY,
  brand_id integer REFERENCES Brand(id) not null,
  model_name varchar unique not null,
  cpu_id integer REFERENCES Cpu(id) not null,
  screen_size decimal_scale not null,
  ram_size positive_int not null,
  disk_size positive_int not null 
);

CREATE TABLE LapTop (
  id SERIAL PRIMARY KEY,
  model_id integer REFERENCES Model(id) not null,
  sales_price decimal_scale,
  unique(model_id)
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

CREATE TABLE Stock (
  id SERIAL PRIMARY KEY,
  transaction_date date not null default CURRENT_DATE,
  store_id integer REFERENCES Store(id) not null,
  laptop_id integer REFERENCES LapTop(id) not null,
  qtt_in positive_int not null check(qtt_in>=0) default 0,
  qtt_out positive_int not null check(qtt_out>=0) default 0

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
  sale decimal_scale not null default 0,
  purchase decimal_scale not null  default 0,
  transfer decimal_scale not null  default 0,
  reception decimal_scale not null  default 0,
  store_id integer REFERENCES Store(id),
  transaction_date date not null default CURRENT_DATE
);


CREATE TABLE Month (
  month_number integer PRIMARY KEY,
  month_name varchar(20) NOT NULL
);

-- VIEW

CREATE OR REPLACE VIEW V_model_tmp AS
SELECT m.*,b.brand_name,cpu.cpu_name from Model m
join Brand b on m.brand_id = b.id 
join Cpu on m.cpu_id = cpu.id;

CREATE OR REPLACE VIEW V_laptop_search AS 
SELECT l.*,m.model_name,m.brand_id,m.brand_name,m.cpu_name,m.ram_size,m.disk_size,m.screen_size
from Laptop l join v_model_tmp m on l.model_id = m.id;

-- VIEW 

CREATE OR REPLACE VIEW V_etat_stock_tmp AS
 SELECT
    transaction_date,
    laptop_id,
    store_id,
    COALESCE(sum(qtt_in),0) - COALESCE(sum(qtt_out), 0) AS qtt
FROM stock group by transaction_date,laptop_id,store_id;


CREATE OR REPLACE VIEW V_etat_stock AS
 SELECT
    laptop_id AS id,
    laptop_id,
    store_id,
    COALESCE(sum(qtt),0) qtt
FROM v_etat_stock_tmp group by laptop_id,store_id;

CREATE OR REPLACE VIEW V_etat_stock_search as 
SELECT s.*, l.model_name,l.brand_id,l.brand_name,l.cpu_name,l.ram_size,l.disk_size from V_etat_stock s join v_laptop_search l  
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






-- stats


CREATE OR REPLACE VIEW v_global_sales_tmp AS
SELECT EXTRACT('month' from purchase_date) "month",EXTRACT('year' from purchase_date) "year",COALESCE(sum(purchase_price*qtt),0) total_price, COALESCE(sum(qtt),0) total_qtt
from sale group by "year","month";


CREATE OR REPLACE VIEW v_global_sales AS
SELECT m.month_number::numeric "month",s.year,s.total_price,s.total_qtt from month m join v_global_sales_tmp s on m.month_number = s.month
;
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
  from v_global_sales v where v."year" is null or v."year" BETWEEN COALESCE(minYear,'1980') AND COALESCE(maxYear,'2080') group by v."month";
END;
$$ LANGUAGE plpgsql;






CREATE OR REPLACE FUNCTION getStoreMonthSalesByYear(min_year INTEGER, max_year INTEGER,value VARCHAR)
RETURNS TABLE (
  store_id INTEGER,
  jan NUMERIC,
  feb NUMERIC,
  march NUMERIC,
  apr NUMERIC,
  mai NUMERIC,
  june NUMERIC,
  jul NUMERIC,
  aug NUMERIC,
  sept NUMERIC,
  oct NUMERIC,
  nov NUMERIC,
  "dec" NUMERIC
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
    jan NUMERIC,
    feb NUMERIC,
    march NUMERIC,
    apr NUMERIC,
    mai NUMERIC,
    june NUMERIC,
    jul NUMERIC,
    aug NUMERIC,
    sept NUMERIC,
    oct NUMERIC,
    nov NUMERIC,
    "dec" NUMERIC
  );
END;
$$ LANGUAGE plpgsql;

SELECT * from getStoreMonthSalesByYear(null,null,'total_price') order by store_id;


-- BENEFICE
CREATE OR REPLACE VIEW v_mouvement_tmp as
SELECT transaction_date,store_id, 
COALESCE(sum(sale),0) sale, COALESCE(sum(purchase),0) purchase , 
COALESCE(sum(transfer),0) transfer, COALESCE(sum(reception),0) reception
from mouvement group by transaction_date, store_id;

CREATE OR REPLACE VIEW v_mouvement as
SELECT transaction_date, 
COALESCE(sum(sale),0) sale, COALESCE(sum(purchase),0) purchase , 
COALESCE(sum(transfer),0) transfer, COALESCE(sum(reception),0) reception
from mouvement group by transaction_date;

CREATE OR REPLACE VIEW v_monthly_mvt_tmp AS
SELECT EXTRACT('month' from transaction_date) "month",EXTRACT('year' from transaction_date) "year",
COALESCE(sum(sale),0) sale, COALESCE(sum(purchase),0) purchase , 
COALESCE(sum(transfer),0) transfer, COALESCE(sum(reception),0) reception
from v_mouvement group by "year","month";

CREATE OR REPLACE VIEW v_monthly_mvt AS
SELECT "month","year",
sale,purchase,transfer,reception,transfer-reception loss, sale + reception- (purchase+transfer) profit
from v_monthly_mvt_tmp;


CREATE OR REPLACE VIEW v_profit_sales AS
SELECT m.month_number::numeric "month",s.year,s.sale,s.purchase,s.loss,s.profit from month m left join v_monthly_mvt s on m.month_number = s.month;

CREATE OR REPLACE FUNCTION getprofitMonthSales(minYear integer,maxYear integer)
RETURNS TABLE (
  month numeric,
  sale numeric,
  purchase numeric,
  loss numeric,
  profit numeric
)
AS $$
BEGIN
  RETURN QUERY
  SELECT v."month",
  sum(v.sale) sale,
  sum(v.purchase) purchase,
  sum(v.loss) loss,
  sum(v.profit) profit
  from v_profit_sales v where v."year" is null or v."year" BETWEEN COALESCE(minYear,'1980') AND COALESCE(maxYear,'2080') group by v."month";
END;
$$ LANGUAGE plpgsql;


-- *total des ventes par mois
  --* global
SELECT month id,month,total_price price,total_qtt qtt from getGlobalMonthSales(null,null);
  -- * point de vente
SELECT store_id id,* from getStoreMonthSalesByYear(null,null,'total_price') order by store_id;
SELECT store_id id,*  from getStoreMonthSalesByYear(null,null,'total_qtt') order by store_id;
-- *bénéfice par mois
SELECT month id,month , sale, purchase, loss , profit from getprofitMonthSales(null,null);


SELECT store_id id,* from getStoreMonthSalesByYear(1900,2080,'total_price') order by store_id;



-- Liste des ventes par point de ventes:
select * from sale 
where store_id=4 
and purchase_price 
between COALESCE(1500,0) AND COALESCE(8000000,CAST('infinity' AS numeric)); 


-- pg_dump -U postgres -d eval_v3 -f backup.sql



CREATE TABLE Commission_level (
  id SERIAL PRIMARY KEY,
  min decimal_scale null,
  max decimal_scale null check(max>min or max is null),
  commission decimal_scale not null
);

INSERT INTO Commission_level (min,max,commission) VALUES
(0,2000000,3),
(2000001,5000000,8),
(5000001,300000000,15);

CREATE OR REPLACE VIEW v_sales_store_tmp as
SELECT store_id,EXTRACT('month' from transaction_date) "month",EXTRACT('year' from transaction_date) "year",
COALESCE(sum(sale),0) sale
from v_mouvement_tmp group by "year","month",store_id;

-- SELECT
--   SUM(
--     CASE
--       WHEN amount <= max THEN (amount - LEAST(amount, min)) * commission / 100
--       ELSE (max - LEAST(max, min)) * commission / 100
--     END
--   )::numeric AS commission_amount
-- FROM commission_level, (VALUES (55000000.00)) AS t(amount)
-- WHERE amount >= min;


CREATE OR REPLACE FUNCTION getCommissionAmount(price numeric)
RETURNS TABLE (
  commission_amount numeric
)
AS $$
BEGIN
  RETURN QUERY
  SELECT
  SUM(
    CASE
      WHEN amount <= max THEN (amount - LEAST(amount, min)) * commission / 100
      ELSE (max - LEAST(max, min)) * commission / 100
    END
  ) AS commission_amount
  FROM commission_level, (VALUES (price)) AS t(amount)
  WHERE amount >= min;
END;
$$ LANGUAGE plpgsql;


SELECT getCommissionAmount(55000000);


CREATE OR REPLACE VIEW v_sales_store as
SELECT *,getCommissionAmount(sale) commission from v_sales_store_tmp

CREATE OR REPLACE VIEW v_monthly_sales_store AS
SELECT "year","month",COALESCE(sum(sale),0) sale, COALESCE(sum(commission),0) commission from v_sales_store
group by "year","month";

CREATE OR REPLACE VIEW v_monthly_mvt AS
SELECT v."month",v."year",
v.sale,v.purchase,v.transfer,v.reception,v.transfer-v.reception loss,s.commission,v.sale + v.reception- (v.purchase+v.transfer+s.commission) profit
from v_monthly_mvt_tmp v join v_monthly_sales_store s on v.month=s.month and v.year = s.year;


CREATE OR REPLACE VIEW v_profit_sales AS
SELECT m.month_number::numeric "month",s.year,s.sale,s.purchase,s.loss,s.commission,s.profit from month m left join v_monthly_mvt s on m.month_number = s.month;

CREATE OR REPLACE FUNCTION getprofitMonthSales(minYear integer,maxYear integer)
RETURNS TABLE (
  month numeric,
  sale numeric,
  purchase numeric,
  loss numeric,
  commission numeric,
  profit numeric
)
AS $$
BEGIN
  RETURN QUERY
  SELECT v."month",
  sum(v.sale) sale,
  sum(v.purchase) purchase,
  sum(v.loss) loss,
  sum(v.commission) commission,
  sum(v.profit) profit
  from v_profit_sales v where v."year" is null or v."year" BETWEEN COALESCE(minYear,'1980') AND COALESCE(maxYear,'2080') group by v."month";
END;
$$ LANGUAGE plpgsql;

SELECT month id,month , sale, purchase, loss ,commission, profit from getprofitMonthSales(null,null);


CREATE OR REPLACE VIEW v_store_commission AS
SELECT store_id,month,year,COALESCE(sale,0) sale,COALESCE(commission,0) commission
from v_sales_store v ;