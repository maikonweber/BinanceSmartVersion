--
-- PostgreSQL database dump
--

-- Dumped from database version 11.6
-- Dumped by pg_dump version 12.12 (Ubuntu 12.12-0ubuntu0.20.04.1)

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

SET default_tablespace = '';

--
-- Name: lead; Type: TABLE; Schema: public; Owner: binance
--

CREATE TABLE public.lead (
    first_name character varying(50),
    last_name character varying(155),
    phone character varying(14),
    email character varying(190),
    message text
);


ALTER TABLE public.lead OWNER TO binance;

--
-- Name: lead_location; Type: TABLE; Schema: public; Owner: binance
--

CREATE TABLE public.lead_location (
    id integer NOT NULL,
    token text,
    infomation json,
    ip text
);


ALTER TABLE public.lead_location OWNER TO binance;

--
-- Name: lead_location_id_seq; Type: SEQUENCE; Schema: public; Owner: binance
--

CREATE SEQUENCE public.lead_location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lead_location_id_seq OWNER TO binance;

--
-- Name: lead_location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: binance
--

ALTER SEQUENCE public.lead_location_id_seq OWNED BY public.lead_location.id;


--
-- Name: openorder; Type: TABLE; Schema: public; Owner: binance
--

CREATE TABLE public.openorder (
    id integer NOT NULL,
    symbol character varying(20) NOT NULL,
    side character varying(20) NOT NULL,
    price numeric(10,2) NOT NULL,
    quantity numeric(10,2) NOT NULL,
    ordertype character varying(20) NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.openorder OWNER TO binance;

--
-- Name: openorder_id_seq; Type: SEQUENCE; Schema: public; Owner: binance
--

CREATE SEQUENCE public.openorder_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.openorder_id_seq OWNER TO binance;

--
-- Name: openorder_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: binance
--

ALTER SEQUENCE public.openorder_id_seq OWNED BY public.openorder.id;


--
-- Name: payload_card; Type: TABLE; Schema: public; Owner: binance
--

CREATE TABLE public.payload_card (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    number text[] NOT NULL,
    created timestamp without time zone DEFAULT now()
);


ALTER TABLE public.payload_card OWNER TO binance;

--
-- Name: payload_card_id_seq; Type: SEQUENCE; Schema: public; Owner: binance
--

CREATE SEQUENCE public.payload_card_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payload_card_id_seq OWNER TO binance;

--
-- Name: payload_card_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: binance
--

ALTER SEQUENCE public.payload_card_id_seq OWNED BY public.payload_card.id;


--
-- Name: post; Type: TABLE; Schema: public; Owner: binance
--

CREATE TABLE public.post (
    id integer NOT NULL,
    text text NOT NULL,
    img json,
    created timestamp without time zone DEFAULT now(),
    title text NOT NULL
);


ALTER TABLE public.post OWNER TO binance;

--
-- Name: post_id_seq; Type: SEQUENCE; Schema: public; Owner: binance
--

CREATE SEQUENCE public.post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.post_id_seq OWNER TO binance;

--
-- Name: post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: binance
--

ALTER SEQUENCE public.post_id_seq OWNED BY public.post.id;


--
-- Name: post_relation; Type: TABLE; Schema: public; Owner: binance
--

CREATE TABLE public.post_relation (
    users_id integer,
    post integer
);


ALTER TABLE public.post_relation OWNER TO binance;

--
-- Name: robotevolution; Type: TABLE; Schema: public; Owner: binance
--

CREATE TABLE public.robotevolution (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    number integer[] NOT NULL,
    created timestamp without time zone DEFAULT now()
);


ALTER TABLE public.robotevolution OWNER TO binance;

--
-- Name: robotevolution_id_seq; Type: SEQUENCE; Schema: public; Owner: binance
--

CREATE SEQUENCE public.robotevolution_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.robotevolution_id_seq OWNER TO binance;

--
-- Name: robotevolution_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: binance
--

ALTER SEQUENCE public.robotevolution_id_seq OWNED BY public.robotevolution.id;


--
-- Name: token; Type: TABLE; Schema: public; Owner: binance
--

CREATE TABLE public.token (
    id integer NOT NULL,
    token character varying(255) NOT NULL,
    created timestamp without time zone DEFAULT now()
);


ALTER TABLE public.token OWNER TO binance;

--
-- Name: token_id_seq; Type: SEQUENCE; Schema: public; Owner: binance
--

CREATE SEQUENCE public.token_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.token_id_seq OWNER TO binance;

--
-- Name: token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: binance
--

ALTER SEQUENCE public.token_id_seq OWNED BY public.token.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: binance
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    username character varying(40) NOT NULL,
    password text NOT NULL,
    sal text NOT NULL,
    email character varying(200) NOT NULL,
    phone character varying(200) NOT NULL,
    address character varying(200) NOT NULL
);


ALTER TABLE public.users OWNER TO binance;

--
-- Name: users_filters; Type: TABLE; Schema: public; Owner: binance
--

CREATE TABLE public.users_filters (
    id integer NOT NULL,
    user_id integer NOT NULL,
    games jsonb NOT NULL,
    created timestamp without time zone DEFAULT now(),
    string_msg text NOT NULL,
    string_msg_green text NOT NULL,
    string_msg_red text NOT NULL
);


ALTER TABLE public.users_filters OWNER TO binance;

--
-- Name: users_filters_id_seq; Type: SEQUENCE; Schema: public; Owner: binance
--

CREATE SEQUENCE public.users_filters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_filters_id_seq OWNER TO binance;

--
-- Name: users_filters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: binance
--

ALTER SEQUENCE public.users_filters_id_seq OWNED BY public.users_filters.id;


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: binance
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO binance;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: binance
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users_token; Type: TABLE; Schema: public; Owner: binance
--

CREATE TABLE public.users_token (
    users_id integer,
    token text NOT NULL,
    navegator text NOT NULL,
    is_admin boolean
);


ALTER TABLE public.users_token OWNER TO binance;

--
-- Name: lead_location id; Type: DEFAULT; Schema: public; Owner: binance
--

ALTER TABLE ONLY public.lead_location ALTER COLUMN id SET DEFAULT nextval('public.lead_location_id_seq'::regclass);


--
-- Name: openorder id; Type: DEFAULT; Schema: public; Owner: binance
--

ALTER TABLE ONLY public.openorder ALTER COLUMN id SET DEFAULT nextval('public.openorder_id_seq'::regclass);


--
-- Name: payload_card id; Type: DEFAULT; Schema: public; Owner: binance
--

ALTER TABLE ONLY public.payload_card ALTER COLUMN id SET DEFAULT nextval('public.payload_card_id_seq'::regclass);


--
-- Name: post id; Type: DEFAULT; Schema: public; Owner: binance
--

ALTER TABLE ONLY public.post ALTER COLUMN id SET DEFAULT nextval('public.post_id_seq'::regclass);


--
-- Name: robotevolution id; Type: DEFAULT; Schema: public; Owner: binance
--

ALTER TABLE ONLY public.robotevolution ALTER COLUMN id SET DEFAULT nextval('public.robotevolution_id_seq'::regclass);


--
-- Name: token id; Type: DEFAULT; Schema: public; Owner: binance
--

ALTER TABLE ONLY public.token ALTER COLUMN id SET DEFAULT nextval('public.token_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: binance
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: users_filters id; Type: DEFAULT; Schema: public; Owner: binance
--

ALTER TABLE ONLY public.users_filters ALTER COLUMN id SET DEFAULT nextval('public.users_filters_id_seq'::regclass);


--
-- Data for Name: lead; Type: TABLE DATA; Schema: public; Owner: binance
--

COPY public.lead (first_name, last_name, phone, email, message) FROM stdin;
Maikon Weber	Weber	511948694897	maikonweber@gmail.com	Quero Aderir!
Maikon	Weber	5511948964897	maikonweber@gmail.com	New Lead
\.


--
-- Data for Name: lead_location; Type: TABLE DATA; Schema: public; Owner: binance
--

COPY public.lead_location (id, token, infomation, ip) FROM stdin;
1	3bb89d476529f64a773854bad9699a438c3f4bf3	{"ip":"179.100.89.72","host":"api.muttercorp.online","browser":"insomnia/2022.5.1","geoInfo":{"range":[3009697792,3009698303],"country":"BR","region":"SP","eu":"0","timezone":"America/Sao_Paulo","city":"São Paulo","ll":[-23.63,-46.6322],"metro":0,"area":200}}	179.100.89.72
2	31b2321c3430cbe5684bd60513a95da7b24c362a	{"ip":"179.100.89.72","host":"api.muttercorp.online","browser":"insomnia/2022.5.1","geoInfo":{"range":[3009697792,3009698303],"country":"BR","region":"SP","eu":"0","timezone":"America/Sao_Paulo","city":"São Paulo","ll":[-23.63,-46.6322],"metro":0,"area":200}}	179.100.89.72
3	385f476bce2bbc91ee6eccc3ae617749b3eec7ff	{"ip":"179.100.89.72","host":"api.muttercorp.online","browser":"insomnia/2022.5.1","geoInfo":{"range":[3009697792,3009698303],"country":"BR","region":"SP","eu":"0","timezone":"America/Sao_Paulo","city":"São Paulo","ll":[-23.63,-46.6322],"metro":0,"area":200}}	179.100.89.72
\.


--
-- Data for Name: openorder; Type: TABLE DATA; Schema: public; Owner: binance
--

COPY public.openorder (id, symbol, side, price, quantity, ordertype, "timestamp") FROM stdin;
\.


--
-- Data for Name: payload_card; Type: TABLE DATA; Schema: public; Owner: binance
--

COPY public.payload_card (id, name, number, created) FROM stdin;
\.


--
-- Data for Name: post; Type: TABLE DATA; Schema: public; Owner: binance
--

COPY public.post (id, text, img, created, title) FROM stdin;
1	This Text is information about evethinh	\N	2022-09-23 21:12:41.07984	Thist text
\.


--
-- Data for Name: post_relation; Type: TABLE DATA; Schema: public; Owner: binance
--

COPY public.post_relation (users_id, post) FROM stdin;
\.


--
-- Data for Name: robotevolution; Type: TABLE DATA; Schema: public; Owner: binance
--

COPY public.robotevolution (id, name, number, created) FROM stdin;
\.


--
-- Data for Name: token; Type: TABLE DATA; Schema: public; Owner: binance
--

COPY public.token (id, token, created) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: binance
--

COPY public.users (id, name, username, password, sal, email, phone, address) FROM stdin;
1	Maikon	maikonweber	e7dc43a443680542c65ed12afcb674864ba82e09ddc41ce7dcae1b6484b63993b51666ee7138394062415689c5713769c1b3b39b1612bdc018a7349737e0e160	64cfdbc9cc93	maikonweber@gmail.com	551194990361	Rua Santarem 55
\.


--
-- Data for Name: users_filters; Type: TABLE DATA; Schema: public; Owner: binance
--

COPY public.users_filters (id, user_id, games, created, string_msg, string_msg_green, string_msg_red) FROM stdin;
\.


--
-- Data for Name: users_token; Type: TABLE DATA; Schema: public; Owner: binance
--

COPY public.users_token (users_id, token, navegator, is_admin) FROM stdin;
1	8a6ab1de61f762ed74b8325921d936ce	insomnia/2022.5.1	t
1	31b524f49fd5d6b2bdd24b4dae7ddfbb	insomnia/2022.5.1	t
1	69a767c8d9ee1e3e570534fe504f95e8	insomnia/2022.5.1	t
\.


--
-- Name: lead_location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: binance
--

SELECT pg_catalog.setval('public.lead_location_id_seq', 3, true);


--
-- Name: openorder_id_seq; Type: SEQUENCE SET; Schema: public; Owner: binance
--

SELECT pg_catalog.setval('public.openorder_id_seq', 1, false);


--
-- Name: payload_card_id_seq; Type: SEQUENCE SET; Schema: public; Owner: binance
--

SELECT pg_catalog.setval('public.payload_card_id_seq', 1, false);


--
-- Name: post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: binance
--

SELECT pg_catalog.setval('public.post_id_seq', 1, true);


--
-- Name: robotevolution_id_seq; Type: SEQUENCE SET; Schema: public; Owner: binance
--

SELECT pg_catalog.setval('public.robotevolution_id_seq', 1, false);


--
-- Name: token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: binance
--

SELECT pg_catalog.setval('public.token_id_seq', 1, false);


--
-- Name: users_filters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: binance
--

SELECT pg_catalog.setval('public.users_filters_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: binance
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: lead_location lead_location_pkey; Type: CONSTRAINT; Schema: public; Owner: binance
--

ALTER TABLE ONLY public.lead_location
    ADD CONSTRAINT lead_location_pkey PRIMARY KEY (id);


--
-- Name: openorder openorder_pkey; Type: CONSTRAINT; Schema: public; Owner: binance
--

ALTER TABLE ONLY public.openorder
    ADD CONSTRAINT openorder_pkey PRIMARY KEY (id);


--
-- Name: payload_card payload_card_pkey; Type: CONSTRAINT; Schema: public; Owner: binance
--

ALTER TABLE ONLY public.payload_card
    ADD CONSTRAINT payload_card_pkey PRIMARY KEY (id);


--
-- Name: post post_pkey; Type: CONSTRAINT; Schema: public; Owner: binance
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_pkey PRIMARY KEY (id);


--
-- Name: robotevolution robotevolution_pkey; Type: CONSTRAINT; Schema: public; Owner: binance
--

ALTER TABLE ONLY public.robotevolution
    ADD CONSTRAINT robotevolution_pkey PRIMARY KEY (id);


--
-- Name: token token_pkey; Type: CONSTRAINT; Schema: public; Owner: binance
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_pkey PRIMARY KEY (id);


--
-- Name: token token_token_key; Type: CONSTRAINT; Schema: public; Owner: binance
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_token_key UNIQUE (token);


--
-- Name: users_filters users_filters_pkey; Type: CONSTRAINT; Schema: public; Owner: binance
--

ALTER TABLE ONLY public.users_filters
    ADD CONSTRAINT users_filters_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: binance
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: post_relation post_relation_post_fkey; Type: FK CONSTRAINT; Schema: public; Owner: binance
--

ALTER TABLE ONLY public.post_relation
    ADD CONSTRAINT post_relation_post_fkey FOREIGN KEY (post) REFERENCES public.post(id);


--
-- Name: post_relation post_relation_users_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: binance
--

ALTER TABLE ONLY public.post_relation
    ADD CONSTRAINT post_relation_users_id_fkey FOREIGN KEY (users_id) REFERENCES public.users(id);


--
-- Name: users_filters users_filters_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: binance
--

ALTER TABLE ONLY public.users_filters
    ADD CONSTRAINT users_filters_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: users_token users_token_users_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: binance
--

ALTER TABLE ONLY public.users_token
    ADD CONSTRAINT users_token_users_id_fkey FOREIGN KEY (users_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

