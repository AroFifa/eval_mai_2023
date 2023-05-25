--
-- PostgreSQL database dump
--

-- Dumped from database version 14.7 (Ubuntu 14.7-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.7 (Ubuntu 14.7-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: tablefunc; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS tablefunc WITH SCHEMA public;


--
-- Name: EXTENSION tablefunc; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION tablefunc IS 'functions that manipulate whole tables, including crosstab';


--
-- Name: decimal_scale; Type: DOMAIN; Schema: public; Owner: postgres
--

CREATE DOMAIN public.decimal_scale AS numeric(18,2)
	CONSTRAINT decimal_scale_check CHECK ((VALUE >= (0)::numeric));


ALTER DOMAIN public.decimal_scale OWNER TO postgres;

--
-- Name: positive_int; Type: DOMAIN; Schema: public; Owner: postgres
--

CREATE DOMAIN public.positive_int AS integer
	CONSTRAINT positive_int_check CHECK ((VALUE >= 0));


ALTER DOMAIN public.positive_int OWNER TO postgres;

--
-- Name: getcommissionamount(numeric); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.getcommissionamount(price numeric) RETURNS TABLE(commission_amount numeric)
    LANGUAGE plpgsql
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
$$;


ALTER FUNCTION public.getcommissionamount(price numeric) OWNER TO postgres;

--
-- Name: getglobalmonthsales(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.getglobalmonthsales(minyear integer, maxyear integer) RETURNS TABLE(month numeric, total_price numeric, total_qtt numeric)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT v."month",sum(v.total_price) total_price,sum(v.total_qtt) total_qtt 
  from v_global_sales v where v."year" is null or v."year" BETWEEN COALESCE(minYear,'1980') AND COALESCE(maxYear,'2080') group by v."month";
END;
$$;


ALTER FUNCTION public.getglobalmonthsales(minyear integer, maxyear integer) OWNER TO postgres;

--
-- Name: getprofitmonthsales(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.getprofitmonthsales(minyear integer, maxyear integer) RETURNS TABLE(month numeric, sale numeric, purchase numeric, loss numeric, commission numeric, profit numeric)
    LANGUAGE plpgsql
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
$$;


ALTER FUNCTION public.getprofitmonthsales(minyear integer, maxyear integer) OWNER TO postgres;

--
-- Name: getstoremonthsales(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.getstoremonthsales(minyear integer, maxyear integer) RETURNS TABLE(store_id integer, month numeric, total_price numeric, total_qtt numeric)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT v.store_id,v."month",sum(v.total_price) total_price,sum(v.total_qtt) total_qtt 
  from v_store_sales v where v."year" BETWEEN COALESCE(minYear,'1980') AND COALESCE(maxYear,'2080') group by v."month",v.store_id;
END;
$$;


ALTER FUNCTION public.getstoremonthsales(minyear integer, maxyear integer) OWNER TO postgres;

--
-- Name: getstoremonthsalesbyyear(integer, integer, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.getstoremonthsalesbyyear(min_year integer, max_year integer, value character varying) RETURNS TABLE(store_id integer, jan numeric, feb numeric, march numeric, apr numeric, mai numeric, june numeric, jul numeric, aug numeric, sept numeric, oct numeric, nov numeric, "dec" numeric)
    LANGUAGE plpgsql
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
$$;


ALTER FUNCTION public.getstoremonthsalesbyyear(min_year integer, max_year integer, value character varying) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: brand; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brand (
    id integer NOT NULL,
    brand_name character varying NOT NULL
);


ALTER TABLE public.brand OWNER TO postgres;

--
-- Name: brand_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.brand_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.brand_id_seq OWNER TO postgres;

--
-- Name: brand_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.brand_id_seq OWNED BY public.brand.id;


--
-- Name: commission_level; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.commission_level (
    id integer NOT NULL,
    min public.decimal_scale,
    max public.decimal_scale,
    commission public.decimal_scale NOT NULL,
    CONSTRAINT commission_level_check CHECK ((((max)::numeric > (min)::numeric) OR (max IS NULL)))
);


ALTER TABLE public.commission_level OWNER TO postgres;

--
-- Name: commission_level_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.commission_level_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.commission_level_id_seq OWNER TO postgres;

--
-- Name: commission_level_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.commission_level_id_seq OWNED BY public.commission_level.id;


--
-- Name: cpu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cpu (
    id integer NOT NULL,
    cpu_name character varying NOT NULL
);


ALTER TABLE public.cpu OWNER TO postgres;

--
-- Name: cpu_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cpu_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cpu_id_seq OWNER TO postgres;

--
-- Name: cpu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cpu_id_seq OWNED BY public.cpu.id;


--
-- Name: employee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee (
    id integer NOT NULL,
    profil_id integer NOT NULL,
    firstname character varying,
    lastname character varying,
    birthday date NOT NULL,
    email character varying NOT NULL,
    passwd character varying NOT NULL,
    store_id integer
);


ALTER TABLE public.employee OWNER TO postgres;

--
-- Name: employee_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.employee_id_seq OWNER TO postgres;

--
-- Name: employee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_id_seq OWNED BY public.employee.id;


--
-- Name: laptop; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.laptop (
    id integer NOT NULL,
    model_id integer NOT NULL,
    sales_price public.decimal_scale
);


ALTER TABLE public.laptop OWNER TO postgres;

--
-- Name: laptop_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.laptop_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.laptop_id_seq OWNER TO postgres;

--
-- Name: laptop_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.laptop_id_seq OWNED BY public.laptop.id;


--
-- Name: location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.location (
    id integer NOT NULL,
    location_name character varying NOT NULL
);


ALTER TABLE public.location OWNER TO postgres;

--
-- Name: location_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.location_id_seq OWNER TO postgres;

--
-- Name: location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.location_id_seq OWNED BY public.location.id;


--
-- Name: model; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.model (
    id integer NOT NULL,
    brand_id integer NOT NULL,
    model_name character varying NOT NULL,
    cpu_id integer NOT NULL,
    screen_size public.decimal_scale NOT NULL,
    ram_size public.positive_int NOT NULL,
    disk_size public.positive_int NOT NULL
);


ALTER TABLE public.model OWNER TO postgres;

--
-- Name: model_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.model_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.model_id_seq OWNER TO postgres;

--
-- Name: model_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.model_id_seq OWNED BY public.model.id;


--
-- Name: month; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.month (
    month_number integer NOT NULL,
    month_name character varying(20) NOT NULL
);


ALTER TABLE public.month OWNER TO postgres;

--
-- Name: mouvement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mouvement (
    id integer NOT NULL,
    sale public.decimal_scale DEFAULT 0 NOT NULL,
    purchase public.decimal_scale DEFAULT 0 NOT NULL,
    transfer public.decimal_scale DEFAULT 0 NOT NULL,
    reception public.decimal_scale DEFAULT 0 NOT NULL,
    store_id integer,
    transaction_date date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.mouvement OWNER TO postgres;

--
-- Name: mouvement_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mouvement_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mouvement_id_seq OWNER TO postgres;

--
-- Name: mouvement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mouvement_id_seq OWNED BY public.mouvement.id;


--
-- Name: profil; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profil (
    id integer NOT NULL,
    profil_name character varying NOT NULL,
    profil_level smallint NOT NULL
);


ALTER TABLE public.profil OWNER TO postgres;

--
-- Name: profil_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.profil_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.profil_id_seq OWNER TO postgres;

--
-- Name: profil_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.profil_id_seq OWNED BY public.profil.id;


--
-- Name: purchase; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase (
    id integer NOT NULL,
    laptop_id integer NOT NULL,
    qtt public.positive_int DEFAULT 1 NOT NULL,
    purchase_price public.decimal_scale NOT NULL,
    purchase_date date DEFAULT CURRENT_DATE NOT NULL,
    employee_id integer NOT NULL,
    CONSTRAINT purchase_qtt_check CHECK (((qtt)::integer > 0))
);


ALTER TABLE public.purchase OWNER TO postgres;

--
-- Name: purchase_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchase_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.purchase_id_seq OWNER TO postgres;

--
-- Name: purchase_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchase_id_seq OWNED BY public.purchase.id;


--
-- Name: reception; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reception (
    id integer NOT NULL,
    reception_date date DEFAULT CURRENT_DATE NOT NULL,
    employee_id integer NOT NULL,
    store_id integer NOT NULL,
    transfer_id integer NOT NULL,
    qtt public.positive_int DEFAULT 1 NOT NULL,
    CONSTRAINT reception_qtt_check CHECK (((qtt)::integer > 0))
);


ALTER TABLE public.reception OWNER TO postgres;

--
-- Name: reception_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reception_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reception_id_seq OWNER TO postgres;

--
-- Name: reception_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reception_id_seq OWNED BY public.reception.id;


--
-- Name: sale; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sale (
    id integer NOT NULL,
    laptop_id integer NOT NULL,
    qtt public.positive_int DEFAULT 1 NOT NULL,
    purchase_date date DEFAULT CURRENT_DATE NOT NULL,
    purchase_price public.decimal_scale,
    store_id integer NOT NULL,
    CONSTRAINT sale_qtt_check CHECK (((qtt)::integer > 0))
);


ALTER TABLE public.sale OWNER TO postgres;

--
-- Name: sale_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sale_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sale_id_seq OWNER TO postgres;

--
-- Name: sale_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sale_id_seq OWNED BY public.sale.id;


--
-- Name: stock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock (
    id integer NOT NULL,
    transaction_date date DEFAULT CURRENT_DATE NOT NULL,
    store_id integer NOT NULL,
    laptop_id integer NOT NULL,
    qtt_in public.positive_int DEFAULT 0 NOT NULL,
    qtt_out public.positive_int DEFAULT 0 NOT NULL,
    CONSTRAINT stock_qtt_in_check CHECK (((qtt_in)::integer >= 0)),
    CONSTRAINT stock_qtt_out_check CHECK (((qtt_out)::integer >= 0))
);


ALTER TABLE public.stock OWNER TO postgres;

--
-- Name: stock_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stock_id_seq OWNER TO postgres;

--
-- Name: stock_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_id_seq OWNED BY public.stock.id;


--
-- Name: store; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store (
    id integer NOT NULL,
    category_id integer NOT NULL,
    location_id integer NOT NULL,
    store_name character varying NOT NULL
);


ALTER TABLE public.store OWNER TO postgres;

--
-- Name: store_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.store_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.store_id_seq OWNER TO postgres;

--
-- Name: store_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.store_id_seq OWNED BY public.store.id;


--
-- Name: storecategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.storecategory (
    id integer NOT NULL,
    category_name character varying NOT NULL,
    category_level smallint NOT NULL
);


ALTER TABLE public.storecategory OWNER TO postgres;

--
-- Name: storecategory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.storecategory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.storecategory_id_seq OWNER TO postgres;

--
-- Name: storecategory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.storecategory_id_seq OWNED BY public.storecategory.id;


--
-- Name: transfer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transfer (
    id integer NOT NULL,
    transfer_date date DEFAULT CURRENT_DATE NOT NULL,
    employee_id integer NOT NULL,
    store_to integer NOT NULL,
    store_from integer NOT NULL,
    laptop_id integer NOT NULL,
    qtt public.positive_int DEFAULT 1 NOT NULL,
    CONSTRAINT transfer_check CHECK ((store_from <> store_to)),
    CONSTRAINT transfer_qtt_check CHECK (((qtt)::integer > 0))
);


ALTER TABLE public.transfer OWNER TO postgres;

--
-- Name: transfer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transfer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transfer_id_seq OWNER TO postgres;

--
-- Name: transfer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transfer_id_seq OWNED BY public.transfer.id;


--
-- Name: v_etat_stock_tmp; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_etat_stock_tmp AS
 SELECT stock.transaction_date,
    stock.laptop_id,
    stock.store_id,
    (COALESCE(sum((stock.qtt_in)::integer), (0)::bigint) - COALESCE(sum((stock.qtt_out)::integer), (0)::bigint)) AS qtt
   FROM public.stock
  GROUP BY stock.transaction_date, stock.laptop_id, stock.store_id;


ALTER TABLE public.v_etat_stock_tmp OWNER TO postgres;

--
-- Name: v_etat_stock; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_etat_stock AS
 SELECT v_etat_stock_tmp.laptop_id AS id,
    v_etat_stock_tmp.laptop_id,
    v_etat_stock_tmp.store_id,
    COALESCE(sum(v_etat_stock_tmp.qtt), (0)::numeric) AS qtt
   FROM public.v_etat_stock_tmp
  GROUP BY v_etat_stock_tmp.laptop_id, v_etat_stock_tmp.store_id;


ALTER TABLE public.v_etat_stock OWNER TO postgres;

--
-- Name: v_model_tmp; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_model_tmp AS
 SELECT m.id,
    m.brand_id,
    m.model_name,
    m.cpu_id,
    m.screen_size,
    m.ram_size,
    m.disk_size,
    b.brand_name,
    cpu.cpu_name
   FROM ((public.model m
     JOIN public.brand b ON ((m.brand_id = b.id)))
     JOIN public.cpu ON ((m.cpu_id = cpu.id)));


ALTER TABLE public.v_model_tmp OWNER TO postgres;

--
-- Name: v_laptop_search; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_laptop_search AS
 SELECT l.id,
    l.model_id,
    l.sales_price,
    m.model_name,
    m.brand_id,
    m.brand_name,
    m.cpu_name,
    m.ram_size,
    m.disk_size,
    m.screen_size
   FROM (public.laptop l
     JOIN public.v_model_tmp m ON ((l.model_id = m.id)));


ALTER TABLE public.v_laptop_search OWNER TO postgres;

--
-- Name: v_etat_stock_search; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_etat_stock_search AS
 SELECT s.id,
    s.laptop_id,
    s.store_id,
    s.qtt,
    l.model_name,
    l.brand_id,
    l.brand_name,
    l.cpu_name,
    l.ram_size,
    l.disk_size
   FROM (public.v_etat_stock s
     JOIN public.v_laptop_search l ON ((s.laptop_id = l.id)));


ALTER TABLE public.v_etat_stock_search OWNER TO postgres;

--
-- Name: v_global_sales_tmp; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_global_sales_tmp AS
 SELECT EXTRACT(month FROM sale.purchase_date) AS month,
    EXTRACT(year FROM sale.purchase_date) AS year,
    COALESCE(sum(((sale.purchase_price)::numeric * (sale.qtt)::numeric)), (0)::numeric) AS total_price,
    COALESCE(sum((sale.qtt)::integer), (0)::bigint) AS total_qtt
   FROM public.sale
  GROUP BY (EXTRACT(year FROM sale.purchase_date)), (EXTRACT(month FROM sale.purchase_date));


ALTER TABLE public.v_global_sales_tmp OWNER TO postgres;

--
-- Name: v_global_sales; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_global_sales AS
 SELECT (m.month_number)::numeric AS month,
    s.year,
    s.total_price,
    s.total_qtt
   FROM (public.month m
     JOIN public.v_global_sales_tmp s ON (((m.month_number)::numeric = s.month)));


ALTER TABLE public.v_global_sales OWNER TO postgres;

--
-- Name: v_mouvement; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_mouvement AS
 SELECT mouvement.transaction_date,
    COALESCE(sum((mouvement.sale)::numeric), (0)::numeric) AS sale,
    COALESCE(sum((mouvement.purchase)::numeric), (0)::numeric) AS purchase,
    COALESCE(sum((mouvement.transfer)::numeric), (0)::numeric) AS transfer,
    COALESCE(sum((mouvement.reception)::numeric), (0)::numeric) AS reception
   FROM public.mouvement
  GROUP BY mouvement.transaction_date;


ALTER TABLE public.v_mouvement OWNER TO postgres;

--
-- Name: v_monthly_mvt_tmp; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_monthly_mvt_tmp AS
 SELECT EXTRACT(month FROM v_mouvement.transaction_date) AS month,
    EXTRACT(year FROM v_mouvement.transaction_date) AS year,
    COALESCE(sum(v_mouvement.sale), (0)::numeric) AS sale,
    COALESCE(sum(v_mouvement.purchase), (0)::numeric) AS purchase,
    COALESCE(sum(v_mouvement.transfer), (0)::numeric) AS transfer,
    COALESCE(sum(v_mouvement.reception), (0)::numeric) AS reception
   FROM public.v_mouvement
  GROUP BY (EXTRACT(year FROM v_mouvement.transaction_date)), (EXTRACT(month FROM v_mouvement.transaction_date));


ALTER TABLE public.v_monthly_mvt_tmp OWNER TO postgres;

--
-- Name: v_mouvement_tmp; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_mouvement_tmp AS
 SELECT mouvement.transaction_date,
    mouvement.store_id,
    COALESCE(sum((mouvement.sale)::numeric), (0)::numeric) AS sale,
    COALESCE(sum((mouvement.purchase)::numeric), (0)::numeric) AS purchase,
    COALESCE(sum((mouvement.transfer)::numeric), (0)::numeric) AS transfer,
    COALESCE(sum((mouvement.reception)::numeric), (0)::numeric) AS reception
   FROM public.mouvement
  GROUP BY mouvement.transaction_date, mouvement.store_id;


ALTER TABLE public.v_mouvement_tmp OWNER TO postgres;

--
-- Name: v_sales_store_tmp; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_sales_store_tmp AS
 SELECT v_mouvement_tmp.store_id,
    EXTRACT(month FROM v_mouvement_tmp.transaction_date) AS month,
    EXTRACT(year FROM v_mouvement_tmp.transaction_date) AS year,
    COALESCE(sum(v_mouvement_tmp.sale), (0)::numeric) AS sale
   FROM public.v_mouvement_tmp
  GROUP BY (EXTRACT(year FROM v_mouvement_tmp.transaction_date)), (EXTRACT(month FROM v_mouvement_tmp.transaction_date)), v_mouvement_tmp.store_id;


ALTER TABLE public.v_sales_store_tmp OWNER TO postgres;

--
-- Name: v_sales_store; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_sales_store AS
 SELECT v_sales_store_tmp.store_id,
    v_sales_store_tmp.month,
    v_sales_store_tmp.year,
    v_sales_store_tmp.sale,
    public.getcommissionamount(v_sales_store_tmp.sale) AS commission
   FROM public.v_sales_store_tmp;


ALTER TABLE public.v_sales_store OWNER TO postgres;

--
-- Name: v_monthly_sales_store; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_monthly_sales_store AS
 SELECT v_sales_store.year,
    v_sales_store.month,
    COALESCE(sum(v_sales_store.sale), (0)::numeric) AS sale,
    COALESCE(sum(v_sales_store.commission), (0)::numeric) AS commission
   FROM public.v_sales_store
  GROUP BY v_sales_store.year, v_sales_store.month;


ALTER TABLE public.v_monthly_sales_store OWNER TO postgres;

--
-- Name: v_monthly_mvt; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_monthly_mvt AS
 SELECT v.month,
    v.year,
    v.sale,
    v.purchase,
    v.transfer,
    v.reception,
    (v.transfer - v.reception) AS loss,
    s.commission,
    ((v.sale + v.reception) - ((v.purchase + v.transfer) + s.commission)) AS profit
   FROM (public.v_monthly_mvt_tmp v
     JOIN public.v_monthly_sales_store s ON (((v.month = s.month) AND (v.year = s.year))));


ALTER TABLE public.v_monthly_mvt OWNER TO postgres;

--
-- Name: v_profit_sales; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_profit_sales AS
 SELECT (m.month_number)::numeric AS month,
    s.year,
    s.sale,
    s.purchase,
    s.loss,
    s.commission,
    s.profit
   FROM (public.month m
     LEFT JOIN public.v_monthly_mvt s ON (((m.month_number)::numeric = s.month)));


ALTER TABLE public.v_profit_sales OWNER TO postgres;

--
-- Name: v_reception; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_reception AS
 SELECT reception.transfer_id,
    reception.store_id AS receiver,
    COALESCE(sum((reception.qtt)::integer), (0)::bigint) AS qtt
   FROM public.reception
  GROUP BY reception.transfer_id, reception.store_id;


ALTER TABLE public.v_reception OWNER TO postgres;

--
-- Name: v_received; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_received AS
 SELECT t.id AS transfer_id,
    t.laptop_id,
    COALESCE(t.store_to, r.receiver) AS receiver,
    (COALESCE((t.qtt)::integer, 0) - COALESCE(r.qtt, (0)::bigint)) AS qtt
   FROM (public.transfer t
     FULL JOIN public.v_reception r ON (((t.id = r.transfer_id) AND (t.store_to = r.receiver))));


ALTER TABLE public.v_received OWNER TO postgres;

--
-- Name: v_received_search; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_received_search AS
 SELECT r.transfer_id AS id,
    l.model_id,
    l.sales_price,
    l.model_name,
    l.brand_id,
    l.brand_name,
    l.cpu_name,
    l.ram_size,
    l.disk_size,
    l.screen_size,
    r.receiver AS store_id,
    r.qtt,
    r.laptop_id,
    r.transfer_id
   FROM (public.v_received r
     JOIN public.v_laptop_search l ON ((r.laptop_id = l.id)))
  WHERE (r.qtt <> 0);


ALTER TABLE public.v_received_search OWNER TO postgres;

--
-- Name: v_store_commission; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_store_commission AS
 SELECT v.store_id,
    v.month,
    v.year,
    COALESCE(v.sale, (0)::numeric) AS sale,
    COALESCE(v.commission, (0)::numeric) AS commission
   FROM public.v_sales_store v;


ALTER TABLE public.v_store_commission OWNER TO postgres;

--
-- Name: v_store_sales; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_store_sales AS
 SELECT EXTRACT(month FROM sale.purchase_date) AS month,
    EXTRACT(year FROM sale.purchase_date) AS year,
    sale.store_id,
    COALESCE(sum(((sale.purchase_price)::numeric * (sale.qtt)::numeric)), (0)::numeric) AS total_price,
    COALESCE(sum((sale.qtt)::integer), (0)::bigint) AS total_qtt
   FROM public.sale
  GROUP BY (EXTRACT(year FROM sale.purchase_date)), (EXTRACT(month FROM sale.purchase_date)), sale.store_id;


ALTER TABLE public.v_store_sales OWNER TO postgres;

--
-- Name: brand id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brand ALTER COLUMN id SET DEFAULT nextval('public.brand_id_seq'::regclass);


--
-- Name: commission_level id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commission_level ALTER COLUMN id SET DEFAULT nextval('public.commission_level_id_seq'::regclass);


--
-- Name: cpu id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cpu ALTER COLUMN id SET DEFAULT nextval('public.cpu_id_seq'::regclass);


--
-- Name: employee id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee ALTER COLUMN id SET DEFAULT nextval('public.employee_id_seq'::regclass);


--
-- Name: laptop id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.laptop ALTER COLUMN id SET DEFAULT nextval('public.laptop_id_seq'::regclass);


--
-- Name: location id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location ALTER COLUMN id SET DEFAULT nextval('public.location_id_seq'::regclass);


--
-- Name: model id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.model ALTER COLUMN id SET DEFAULT nextval('public.model_id_seq'::regclass);


--
-- Name: mouvement id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mouvement ALTER COLUMN id SET DEFAULT nextval('public.mouvement_id_seq'::regclass);


--
-- Name: profil id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profil ALTER COLUMN id SET DEFAULT nextval('public.profil_id_seq'::regclass);


--
-- Name: purchase id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase ALTER COLUMN id SET DEFAULT nextval('public.purchase_id_seq'::regclass);


--
-- Name: reception id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reception ALTER COLUMN id SET DEFAULT nextval('public.reception_id_seq'::regclass);


--
-- Name: sale id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale ALTER COLUMN id SET DEFAULT nextval('public.sale_id_seq'::regclass);


--
-- Name: stock id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock ALTER COLUMN id SET DEFAULT nextval('public.stock_id_seq'::regclass);


--
-- Name: store id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store ALTER COLUMN id SET DEFAULT nextval('public.store_id_seq'::regclass);


--
-- Name: storecategory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.storecategory ALTER COLUMN id SET DEFAULT nextval('public.storecategory_id_seq'::regclass);


--
-- Name: transfer id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transfer ALTER COLUMN id SET DEFAULT nextval('public.transfer_id_seq'::regclass);


--
-- Data for Name: brand; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.brand (id, brand_name) FROM stdin;
8	Toshiba
6	FUJITSU
2	Dell
3	Apple
7	MSIs
5	Lenovo
4	Hp
\.


--
-- Data for Name: commission_level; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.commission_level (id, min, max, commission) FROM stdin;
1	0.00	2000000.00	3.00
2	2000001.00	5000000.00	8.00
3	5000001.00	300000000.00	15.00
\.


--
-- Data for Name: cpu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cpu (id, cpu_name) FROM stdin;
1	Intel Core i7
3	Intel Core i9
4	Apple M1
5	AMD Ryzen 7
2	Intel Core i5
\.


--
-- Data for Name: employee; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee (id, profil_id, firstname, lastname, birthday, email, passwd, store_id) FROM stdin;
9	1	Admin	User	1980-10-10	admin@example.com	$2a$06$K/Um6L8eVvLDFYQ0K88gd.P3sGap4zYArryn3qM6AZ5GQW6MFGJ12	1
10	2	Jack	Doe	1989-03-01	jackdoe@example.com	$2a$06$2PO0Kq6ZtcsmyOv9kzvRsOlywZOEGJ8.OXXkGyFs3tMnMFMgmPrZe	6
11	2	John	Doe	1990-01-01	johndoe@example.com	$2a$06$9egV6l6mzTvfoV27vykVVev1j2jQX6JRi9SC7p2QO9/agupN3pu4a	7
12	2	Jane	Doe	1985-05-05	janedoe@example.com	$2a$06$Uq39UyYZGCqn0.TlYJtnieFoyDdOoBFoQBgTqSjMaCgGBp1uf2wka	8
\.


--
-- Data for Name: laptop; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.laptop (id, model_id, sales_price) FROM stdin;
1	11	1875000.00
2	12	2500000.00
3	13	3375000.00
4	14	2125000.00
5	15	2750000.00
6	16	3750000.00
7	17	2375000.00
8	18	3000000.00
9	19	4125000.00
10	20	2625000.00
\.


--
-- Data for Name: location; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.location (id, location_name) FROM stdin;
1	Analamanga
2	Tamatave
3	Fianarantsoa
4	Majunga
\.


--
-- Data for Name: model; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.model (id, brand_id, model_name, cpu_id, screen_size, ram_size, disk_size) FROM stdin;
11	2	1D	1	13.30	16	512
12	3	2A	4	13.30	8	256
13	4	3H	1	15.60	16	1000
14	5	4L	2	14.00	8	256
15	6	5F	5	14.00	16	512
16	3	6A	2	14.00	8	512
17	7	7M	3	15.60	32	1000
18	7	8M	2	13.50	8	128
19	8	9T	1	13.30	16	512
20	5	10L	1	14.00	16	1000
\.


--
-- Data for Name: month; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.month (month_number, month_name) FROM stdin;
1	Janvier
2	Février
3	Mars
4	Avril
5	Mai
6	Juin
7	Juillet
8	Août
9	Septembre
10	Octobre
11	Novembre
12	Décembre
\.


--
-- Data for Name: mouvement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mouvement (id, sale, purchase, transfer, reception, store_id, transaction_date) FROM stdin;
2	0.00	75000000.00	0.00	0.00	\N	2019-05-23
3	0.00	50000000.00	0.00	0.00	\N	2019-05-23
4	0.00	81000000.00	0.00	0.00	\N	2019-05-23
5	0.00	30600000.00	0.00	0.00	\N	2019-05-23
6	0.00	143000000.00	0.00	0.00	\N	2019-05-23
7	0.00	126000000.00	0.00	0.00	\N	2019-05-23
8	0.00	106400000.00	0.00	0.00	\N	2019-05-23
9	0.00	105600000.00	0.00	0.00	\N	2019-05-23
10	0.00	244200000.00	0.00	0.00	\N	2019-05-23
11	0.00	42000000.00	0.00	0.00	\N	2019-05-23
12	0.00	0.00	18750000.00	0.00	1	2020-05-02
13	0.00	0.00	101250000.00	0.00	1	2022-06-14
14	0.00	0.00	62500000.00	0.00	1	2021-05-05
15	0.00	0.00	45000000.00	0.00	1	2021-09-10
16	0.00	0.00	123750000.00	0.00	1	2023-05-02
17	0.00	0.00	0.00	15000000.00	6	2020-05-04
18	0.00	0.00	0.00	62500000.00	7	2021-05-08
19	0.00	0.00	0.00	84375000.00	8	2022-06-29
20	0.00	0.00	0.00	45000000.00	7	2021-09-16
21	0.00	0.00	0.00	121000000.00	7	2023-05-10
22	1875000.00	0.00	0.00	0.00	6	2020-05-10
23	57375000.00	0.00	0.00	0.00	8	2022-07-05
24	55000000.00	0.00	0.00	0.00	7	2021-05-14
25	3750000.00	0.00	0.00	0.00	7	2021-09-22
26	82500000.00	0.00	0.00	0.00	7	2023-05-16
\.


--
-- Data for Name: profil; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profil (id, profil_name, profil_level) FROM stdin;
1	Manager	2
2	Salesperson	1
\.


--
-- Data for Name: purchase; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase (id, laptop_id, qtt, purchase_price, purchase_date, employee_id) FROM stdin;
2	1	50	1500000.00	2019-05-23	9
3	2	25	2000000.00	2019-05-23	9
4	3	30	2700000.00	2019-05-23	9
5	4	18	1700000.00	2019-05-23	9
6	5	65	2200000.00	2019-05-23	9
7	6	42	3000000.00	2019-05-23	9
8	7	56	1900000.00	2019-05-23	9
9	8	44	2400000.00	2019-05-23	9
10	9	74	3300000.00	2019-05-23	9
11	10	20	2100000.00	2019-05-23	9
\.


--
-- Data for Name: reception; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reception (id, reception_date, employee_id, store_id, transfer_id, qtt) FROM stdin;
1	2020-05-04	10	6	1	8
2	2021-05-08	11	7	3	25
3	2022-06-29	12	8	2	25
4	2021-09-16	11	7	4	12
5	2023-05-10	11	7	5	44
\.


--
-- Data for Name: sale; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sale (id, laptop_id, qtt, purchase_date, purchase_price, store_id) FROM stdin;
1	1	1	2020-05-10	1875000.00	6
2	3	17	2022-07-05	3375000.00	8
3	2	22	2021-05-14	2500000.00	7
4	6	1	2021-09-22	3750000.00	7
5	5	30	2023-05-16	2750000.00	7
\.


--
-- Data for Name: stock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock (id, transaction_date, store_id, laptop_id, qtt_in, qtt_out) FROM stdin;
1	2019-05-23	1	1	50	0
2	2019-05-23	1	2	25	0
3	2019-05-23	1	3	30	0
4	2019-05-23	1	4	18	0
5	2019-05-23	1	5	65	0
6	2019-05-23	1	6	42	0
7	2019-05-23	1	7	56	0
8	2019-05-23	1	8	44	0
9	2019-05-23	1	9	74	0
10	2019-05-23	1	10	20	0
11	2020-05-02	1	1	0	10
12	2022-06-14	1	3	0	30
13	2021-05-05	1	2	0	25
14	2021-09-10	1	6	0	12
15	2023-05-02	1	5	0	45
16	2020-05-04	6	1	8	0
17	2021-05-08	7	2	25	0
18	2022-06-29	8	3	25	0
19	2021-09-16	7	6	12	0
20	2023-05-10	7	5	44	0
21	2020-05-10	6	1	0	1
22	2022-07-05	8	3	0	17
23	2021-05-14	7	2	0	22
24	2021-09-22	7	6	0	1
25	2023-05-16	7	5	0	30
\.


--
-- Data for Name: store; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store (id, category_id, location_id, store_name) FROM stdin;
1	1	1	Mikolo Centrale
6	2	2	Mikolo Tamatave
7	2	3	Mikolo Fianarantsoa
8	2	4	Mikolo Majunga
\.


--
-- Data for Name: storecategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.storecategory (id, category_name, category_level) FROM stdin;
1	Magasin	0
2	Point de ventes	10
\.


--
-- Data for Name: transfer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transfer (id, transfer_date, employee_id, store_to, store_from, laptop_id, qtt) FROM stdin;
1	2020-05-02	9	6	1	1	10
2	2022-06-14	9	8	1	3	30
3	2021-05-05	9	7	1	2	25
4	2021-09-10	9	7	1	6	12
5	2023-05-02	9	7	1	5	45
\.


--
-- Name: brand_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.brand_id_seq', 1, false);


--
-- Name: commission_level_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.commission_level_id_seq', 3, true);


--
-- Name: cpu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cpu_id_seq', 1, false);


--
-- Name: employee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_id_seq', 1, false);


--
-- Name: laptop_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.laptop_id_seq', 1, false);


--
-- Name: location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.location_id_seq', 1, false);


--
-- Name: model_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.model_id_seq', 1, false);


--
-- Name: mouvement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mouvement_id_seq', 26, true);


--
-- Name: profil_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.profil_id_seq', 1, false);


--
-- Name: purchase_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.purchase_id_seq', 11, true);


--
-- Name: reception_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reception_id_seq', 5, true);


--
-- Name: sale_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sale_id_seq', 5, true);


--
-- Name: stock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_id_seq', 25, true);


--
-- Name: store_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.store_id_seq', 1, false);


--
-- Name: storecategory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.storecategory_id_seq', 1, false);


--
-- Name: transfer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transfer_id_seq', 5, true);


--
-- Name: brand brand_brand_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brand
    ADD CONSTRAINT brand_brand_name_key UNIQUE (brand_name);


--
-- Name: brand brand_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brand
    ADD CONSTRAINT brand_pkey PRIMARY KEY (id);


--
-- Name: commission_level commission_level_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commission_level
    ADD CONSTRAINT commission_level_pkey PRIMARY KEY (id);


--
-- Name: cpu cpu_cpu_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cpu
    ADD CONSTRAINT cpu_cpu_name_key UNIQUE (cpu_name);


--
-- Name: cpu cpu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cpu
    ADD CONSTRAINT cpu_pkey PRIMARY KEY (id);


--
-- Name: employee employee_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_email_key UNIQUE (email);


--
-- Name: employee employee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_pkey PRIMARY KEY (id);


--
-- Name: laptop laptop_model_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.laptop
    ADD CONSTRAINT laptop_model_id_key UNIQUE (model_id);


--
-- Name: laptop laptop_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.laptop
    ADD CONSTRAINT laptop_pkey PRIMARY KEY (id);


--
-- Name: location location_location_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_location_name_key UNIQUE (location_name);


--
-- Name: location location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_pkey PRIMARY KEY (id);


--
-- Name: model model_model_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.model
    ADD CONSTRAINT model_model_name_key UNIQUE (model_name);


--
-- Name: model model_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.model
    ADD CONSTRAINT model_pkey PRIMARY KEY (id);


--
-- Name: month month_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.month
    ADD CONSTRAINT month_pkey PRIMARY KEY (month_number);


--
-- Name: mouvement mouvement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mouvement
    ADD CONSTRAINT mouvement_pkey PRIMARY KEY (id);


--
-- Name: profil profil_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profil
    ADD CONSTRAINT profil_pkey PRIMARY KEY (id);


--
-- Name: profil profil_profil_level_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profil
    ADD CONSTRAINT profil_profil_level_key UNIQUE (profil_level);


--
-- Name: profil profil_profil_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profil
    ADD CONSTRAINT profil_profil_name_key UNIQUE (profil_name);


--
-- Name: purchase purchase_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase
    ADD CONSTRAINT purchase_pkey PRIMARY KEY (id);


--
-- Name: reception reception_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reception
    ADD CONSTRAINT reception_pkey PRIMARY KEY (id);


--
-- Name: sale sale_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale
    ADD CONSTRAINT sale_pkey PRIMARY KEY (id);


--
-- Name: stock stock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock
    ADD CONSTRAINT stock_pkey PRIMARY KEY (id);


--
-- Name: store store_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store
    ADD CONSTRAINT store_pkey PRIMARY KEY (id);


--
-- Name: store store_store_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store
    ADD CONSTRAINT store_store_name_key UNIQUE (store_name);


--
-- Name: storecategory storecategory_category_level_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.storecategory
    ADD CONSTRAINT storecategory_category_level_key UNIQUE (category_level);


--
-- Name: storecategory storecategory_category_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.storecategory
    ADD CONSTRAINT storecategory_category_name_key UNIQUE (category_name);


--
-- Name: storecategory storecategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.storecategory
    ADD CONSTRAINT storecategory_pkey PRIMARY KEY (id);


--
-- Name: transfer transfer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transfer
    ADD CONSTRAINT transfer_pkey PRIMARY KEY (id);


--
-- Name: employee employee_profil_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_profil_id_fkey FOREIGN KEY (profil_id) REFERENCES public.profil(id);


--
-- Name: employee employee_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.store(id);


--
-- Name: laptop laptop_model_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.laptop
    ADD CONSTRAINT laptop_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.model(id);


--
-- Name: model model_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.model
    ADD CONSTRAINT model_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brand(id);


--
-- Name: model model_cpu_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.model
    ADD CONSTRAINT model_cpu_id_fkey FOREIGN KEY (cpu_id) REFERENCES public.cpu(id);


--
-- Name: mouvement mouvement_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mouvement
    ADD CONSTRAINT mouvement_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.store(id);


--
-- Name: purchase purchase_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase
    ADD CONSTRAINT purchase_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employee(id);


--
-- Name: purchase purchase_laptop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase
    ADD CONSTRAINT purchase_laptop_id_fkey FOREIGN KEY (laptop_id) REFERENCES public.laptop(id);


--
-- Name: reception reception_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reception
    ADD CONSTRAINT reception_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employee(id);


--
-- Name: reception reception_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reception
    ADD CONSTRAINT reception_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.store(id);


--
-- Name: reception reception_transfer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reception
    ADD CONSTRAINT reception_transfer_id_fkey FOREIGN KEY (transfer_id) REFERENCES public.transfer(id);


--
-- Name: sale sale_laptop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale
    ADD CONSTRAINT sale_laptop_id_fkey FOREIGN KEY (laptop_id) REFERENCES public.laptop(id);


--
-- Name: sale sale_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale
    ADD CONSTRAINT sale_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.store(id);


--
-- Name: stock stock_laptop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock
    ADD CONSTRAINT stock_laptop_id_fkey FOREIGN KEY (laptop_id) REFERENCES public.laptop(id);


--
-- Name: stock stock_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock
    ADD CONSTRAINT stock_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.store(id);


--
-- Name: store store_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store
    ADD CONSTRAINT store_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.storecategory(id);


--
-- Name: store store_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store
    ADD CONSTRAINT store_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.location(id);


--
-- Name: transfer transfer_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transfer
    ADD CONSTRAINT transfer_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employee(id);


--
-- Name: transfer transfer_laptop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transfer
    ADD CONSTRAINT transfer_laptop_id_fkey FOREIGN KEY (laptop_id) REFERENCES public.laptop(id);


--
-- Name: transfer transfer_store_from_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transfer
    ADD CONSTRAINT transfer_store_from_fkey FOREIGN KEY (store_from) REFERENCES public.store(id);


--
-- Name: transfer transfer_store_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transfer
    ADD CONSTRAINT transfer_store_to_fkey FOREIGN KEY (store_to) REFERENCES public.store(id);


--
-- PostgreSQL database dump complete
--

