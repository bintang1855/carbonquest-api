--
-- PostgreSQL database dump
--

\restrict SgCwyb6OTSb7hxbYqZR5Q8jWEHr5BuQ7ghWVfksVBvLTqQ4d0GfNsOje7mcRt7E

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: carbonquest
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO carbonquest;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: carbonquest
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Answers; Type: TABLE; Schema: public; Owner: carbonquest
--

CREATE TABLE public."Answers" (
    id_answer integer NOT NULL,
    id_question integer NOT NULL,
    content text NOT NULL,
    is_correct boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Answers" OWNER TO carbonquest;

--
-- Name: Answers_id_answer_seq; Type: SEQUENCE; Schema: public; Owner: carbonquest
--

CREATE SEQUENCE public."Answers_id_answer_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Answers_id_answer_seq" OWNER TO carbonquest;

--
-- Name: Answers_id_answer_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: carbonquest
--

ALTER SEQUENCE public."Answers_id_answer_seq" OWNED BY public."Answers".id_answer;


--
-- Name: Articles; Type: TABLE; Schema: public; Owner: carbonquest
--

CREATE TABLE public."Articles" (
    id_article integer NOT NULL,
    title character varying(255) NOT NULL,
    topic character varying(100),
    description text,
    content text,
    cover_image character varying(255),
    photo_caption character varying(255),
    photo_credit character varying(100),
    author_name character varying(100),
    author_role character varying(50),
    place character varying(100),
    highlights text,
    date_created timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    id_author integer NOT NULL
);


ALTER TABLE public."Articles" OWNER TO carbonquest;

--
-- Name: Articles_id_article_seq; Type: SEQUENCE; Schema: public; Owner: carbonquest
--

CREATE SEQUENCE public."Articles_id_article_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Articles_id_article_seq" OWNER TO carbonquest;

--
-- Name: Articles_id_article_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: carbonquest
--

ALTER SEQUENCE public."Articles_id_article_seq" OWNED BY public."Articles".id_article;


--
-- Name: Missions; Type: TABLE; Schema: public; Owner: carbonquest
--

CREATE TABLE public."Missions" (
    id_mission integer NOT NULL,
    title character varying(255) NOT NULL,
    tags character varying(255),
    "desc" text,
    cover_image character varying(255),
    photo_caption character varying(255),
    author_name character varying(100),
    author_role character varying(50),
    points integer,
    highlights text,
    date_created timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    id_creator integer NOT NULL
);


ALTER TABLE public."Missions" OWNER TO carbonquest;

--
-- Name: Missions_id_mission_seq; Type: SEQUENCE; Schema: public; Owner: carbonquest
--

CREATE SEQUENCE public."Missions_id_mission_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Missions_id_mission_seq" OWNER TO carbonquest;

--
-- Name: Missions_id_mission_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: carbonquest
--

ALTER SEQUENCE public."Missions_id_mission_seq" OWNED BY public."Missions".id_mission;


--
-- Name: Organization; Type: TABLE; Schema: public; Owner: carbonquest
--

CREATE TABLE public."Organization" (
    id_organisasi integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    "desc" text
);


ALTER TABLE public."Organization" OWNER TO carbonquest;

--
-- Name: Organization_id_organisasi_seq; Type: SEQUENCE; Schema: public; Owner: carbonquest
--

CREATE SEQUENCE public."Organization_id_organisasi_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Organization_id_organisasi_seq" OWNER TO carbonquest;

--
-- Name: Organization_id_organisasi_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: carbonquest
--

ALTER SEQUENCE public."Organization_id_organisasi_seq" OWNED BY public."Organization".id_organisasi;


--
-- Name: Questions; Type: TABLE; Schema: public; Owner: carbonquest
--

CREATE TABLE public."Questions" (
    id_question integer NOT NULL,
    points integer DEFAULT 10,
    content text NOT NULL,
    id_quiz integer NOT NULL,
    "order" integer
);


ALTER TABLE public."Questions" OWNER TO carbonquest;

--
-- Name: Questions_id_question_seq; Type: SEQUENCE; Schema: public; Owner: carbonquest
--

CREATE SEQUENCE public."Questions_id_question_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Questions_id_question_seq" OWNER TO carbonquest;

--
-- Name: Questions_id_question_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: carbonquest
--

ALTER SEQUENCE public."Questions_id_question_seq" OWNED BY public."Questions".id_question;


--
-- Name: Quizzes; Type: TABLE; Schema: public; Owner: carbonquest
--

CREATE TABLE public."Quizzes" (
    id_quiz integer NOT NULL,
    title character varying(255) NOT NULL,
    category character varying(100),
    total_points integer DEFAULT 0,
    id_creator integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public."Quizzes" OWNER TO carbonquest;

--
-- Name: Quizzes_id_quiz_seq; Type: SEQUENCE; Schema: public; Owner: carbonquest
--

CREATE SEQUENCE public."Quizzes_id_quiz_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Quizzes_id_quiz_seq" OWNER TO carbonquest;

--
-- Name: Quizzes_id_quiz_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: carbonquest
--

ALTER SEQUENCE public."Quizzes_id_quiz_seq" OWNED BY public."Quizzes".id_quiz;


--
-- Name: Sessions; Type: TABLE; Schema: public; Owner: carbonquest
--

CREATE TABLE public."Sessions" (
    id_session integer NOT NULL,
    start_time timestamp(3) without time zone,
    end_time timestamp(3) without time zone,
    total_points integer,
    id_user integer NOT NULL,
    id_answer integer NOT NULL
);


ALTER TABLE public."Sessions" OWNER TO carbonquest;

--
-- Name: Sessions_id_session_seq; Type: SEQUENCE; Schema: public; Owner: carbonquest
--

CREATE SEQUENCE public."Sessions_id_session_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Sessions_id_session_seq" OWNER TO carbonquest;

--
-- Name: Sessions_id_session_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: carbonquest
--

ALTER SEQUENCE public."Sessions_id_session_seq" OWNED BY public."Sessions".id_session;


--
-- Name: User_Missions; Type: TABLE; Schema: public; Owner: carbonquest
--

CREATE TABLE public."User_Missions" (
    id_working integer NOT NULL,
    id_user integer NOT NULL,
    id_mission integer NOT NULL,
    status character varying(100),
    points integer,
    completed_time timestamp(3) without time zone
);


ALTER TABLE public."User_Missions" OWNER TO carbonquest;

--
-- Name: User_Missions_id_working_seq; Type: SEQUENCE; Schema: public; Owner: carbonquest
--

CREATE SEQUENCE public."User_Missions_id_working_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_Missions_id_working_seq" OWNER TO carbonquest;

--
-- Name: User_Missions_id_working_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: carbonquest
--

ALTER SEQUENCE public."User_Missions_id_working_seq" OWNED BY public."User_Missions".id_working;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: carbonquest
--

CREATE TABLE public."Users" (
    id_user integer NOT NULL,
    name character varying(100) NOT NULL,
    last_name character varying(100),
    birth_date timestamp(3) without time zone,
    email character varying(100) NOT NULL,
    phone character varying(20),
    password character varying(100) NOT NULL,
    profile_image character varying(255)
);


ALTER TABLE public."Users" OWNER TO carbonquest;

--
-- Name: Users_id_user_seq; Type: SEQUENCE; Schema: public; Owner: carbonquest
--

CREATE SEQUENCE public."Users_id_user_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_id_user_seq" OWNER TO carbonquest;

--
-- Name: Users_id_user_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: carbonquest
--

ALTER SEQUENCE public."Users_id_user_seq" OWNED BY public."Users".id_user;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: carbonquest
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO carbonquest;

--
-- Name: Answers id_answer; Type: DEFAULT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."Answers" ALTER COLUMN id_answer SET DEFAULT nextval('public."Answers_id_answer_seq"'::regclass);


--
-- Name: Articles id_article; Type: DEFAULT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."Articles" ALTER COLUMN id_article SET DEFAULT nextval('public."Articles_id_article_seq"'::regclass);


--
-- Name: Missions id_mission; Type: DEFAULT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."Missions" ALTER COLUMN id_mission SET DEFAULT nextval('public."Missions_id_mission_seq"'::regclass);


--
-- Name: Organization id_organisasi; Type: DEFAULT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."Organization" ALTER COLUMN id_organisasi SET DEFAULT nextval('public."Organization_id_organisasi_seq"'::regclass);


--
-- Name: Questions id_question; Type: DEFAULT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."Questions" ALTER COLUMN id_question SET DEFAULT nextval('public."Questions_id_question_seq"'::regclass);


--
-- Name: Quizzes id_quiz; Type: DEFAULT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."Quizzes" ALTER COLUMN id_quiz SET DEFAULT nextval('public."Quizzes_id_quiz_seq"'::regclass);


--
-- Name: Sessions id_session; Type: DEFAULT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."Sessions" ALTER COLUMN id_session SET DEFAULT nextval('public."Sessions_id_session_seq"'::regclass);


--
-- Name: User_Missions id_working; Type: DEFAULT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."User_Missions" ALTER COLUMN id_working SET DEFAULT nextval('public."User_Missions_id_working_seq"'::regclass);


--
-- Name: Users id_user; Type: DEFAULT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id_user SET DEFAULT nextval('public."Users_id_user_seq"'::regclass);


--
-- Data for Name: Answers; Type: TABLE DATA; Schema: public; Owner: carbonquest
--

COPY public."Answers" (id_answer, id_question, content, is_correct) FROM stdin;
\.


--
-- Data for Name: Articles; Type: TABLE DATA; Schema: public; Owner: carbonquest
--

COPY public."Articles" (id_article, title, topic, description, content, cover_image, photo_caption, photo_credit, author_name, author_role, place, highlights, date_created, id_author) FROM stdin;
1	Climate Change and You	climate	Understanding the impact of climate change...	Understanding the impact of climate change...	/files/1765657920635-356082272.png	A view of melting glaciers	John Doe Photography	Jane Smith	Editor	Bandung, Indonesia	Key points about climate action	2025-12-13 20:29:46.207	2
2	a	a	a	a	/files/1765657975551-760855237.png	a	a	a	Admin	a	a	2025-12-13 20:32:55.577	2
3	Climate Change and You	climate	Understanding the impact of climate change...	Full article content here...	/files/1765773794832-471324319.jpeg	A view of melting glaciers	John Doe Photography	Jane Smith	Editor	Bandung, Indonesia	Key points about climate action	2025-12-15 04:43:14.861	2
\.


--
-- Data for Name: Missions; Type: TABLE DATA; Schema: public; Owner: carbonquest
--

COPY public."Missions" (id_mission, title, tags, "desc", cover_image, photo_caption, author_name, author_role, points, highlights, date_created, id_creator) FROM stdin;
1	Reduce plastic usage	education, sustainability	Complete tasks to reduce single-use plastics	\N	Plastic reduction campaign	Jane Doe	Admin	100	Key mission objectives and benefits	2025-12-15 07:33:13.839	2
\.


--
-- Data for Name: Organization; Type: TABLE DATA; Schema: public; Owner: carbonquest
--

COPY public."Organization" (id_organisasi, name, email, password, "desc") FROM stdin;
1	Green Corp	info@greencorp.com	$2b$10$jj4Wwmo743s4otjPm3IEiu5q9nnvUN8QFhak0H3QtFY3BOizzukX.	Environmental sustainability organization
2	Green Corp 2	info@greencorp2.com	$2b$10$2lTX3SVnLJ.4cTAbqMjLROaiqXJBOT9TXI7r3U.eoMo6P65zfFV9O	Environmental sustainability organization
\.


--
-- Data for Name: Questions; Type: TABLE DATA; Schema: public; Owner: carbonquest
--

COPY public."Questions" (id_question, points, content, id_quiz, "order") FROM stdin;
\.


--
-- Data for Name: Quizzes; Type: TABLE DATA; Schema: public; Owner: carbonquest
--

COPY public."Quizzes" (id_quiz, title, category, total_points, id_creator, created_at) FROM stdin;
\.


--
-- Data for Name: Sessions; Type: TABLE DATA; Schema: public; Owner: carbonquest
--

COPY public."Sessions" (id_session, start_time, end_time, total_points, id_user, id_answer) FROM stdin;
\.


--
-- Data for Name: User_Missions; Type: TABLE DATA; Schema: public; Owner: carbonquest
--

COPY public."User_Missions" (id_working, id_user, id_mission, status, points, completed_time) FROM stdin;
1	1	1	on_going	0	\N
2	1	1	on_going	0	\N
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: carbonquest
--

COPY public."Users" (id_user, name, last_name, birth_date, email, phone, password, profile_image) FROM stdin;
1	John	Doe	1990-01-15 00:00:00	john@example.com	81234567890	$2b$10$7yXih3Bz.bbIUn6nINieieVTlFF1eyPaxd8unD7Q.cmTfZnzfEvm6	/files/1765657656374-34605343.png
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: carbonquest
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
98dc1314-1487-4656-800c-67b963538b4e	171b3a71f9419943e1caf3c4498b6391ee8f95b00a61bf7283bd224408d725ff	2025-12-13 20:25:27.744009+00	20251212173107_add_user_fields	\N	\N	2025-12-13 20:25:27.301491+00	1
3e9adbf1-91e0-40ac-af7d-1781ce384281	a7e1e5d793f4af1336818907f8feb22292796e6db9bdb3af719be6df8dbfc95e	2025-12-13 20:25:27.871279+00	20251213191046_add_quiz_system	\N	\N	2025-12-13 20:25:27.752476+00	1
bc6ad840-f878-4b88-a728-3f1ca082d447	5e5d83b2ccd592d7ae072d0430188aa5a80934dd6dde6b210416749f38751c02	2025-12-13 20:25:27.936881+00	20251213194826_add_user_profile_image	\N	\N	2025-12-13 20:25:27.880333+00	1
\.


--
-- Name: Answers_id_answer_seq; Type: SEQUENCE SET; Schema: public; Owner: carbonquest
--

SELECT pg_catalog.setval('public."Answers_id_answer_seq"', 1, false);


--
-- Name: Articles_id_article_seq; Type: SEQUENCE SET; Schema: public; Owner: carbonquest
--

SELECT pg_catalog.setval('public."Articles_id_article_seq"', 3, true);


--
-- Name: Missions_id_mission_seq; Type: SEQUENCE SET; Schema: public; Owner: carbonquest
--

SELECT pg_catalog.setval('public."Missions_id_mission_seq"', 1, true);


--
-- Name: Organization_id_organisasi_seq; Type: SEQUENCE SET; Schema: public; Owner: carbonquest
--

SELECT pg_catalog.setval('public."Organization_id_organisasi_seq"', 2, true);


--
-- Name: Questions_id_question_seq; Type: SEQUENCE SET; Schema: public; Owner: carbonquest
--

SELECT pg_catalog.setval('public."Questions_id_question_seq"', 1, false);


--
-- Name: Quizzes_id_quiz_seq; Type: SEQUENCE SET; Schema: public; Owner: carbonquest
--

SELECT pg_catalog.setval('public."Quizzes_id_quiz_seq"', 1, false);


--
-- Name: Sessions_id_session_seq; Type: SEQUENCE SET; Schema: public; Owner: carbonquest
--

SELECT pg_catalog.setval('public."Sessions_id_session_seq"', 1, true);


--
-- Name: User_Missions_id_working_seq; Type: SEQUENCE SET; Schema: public; Owner: carbonquest
--

SELECT pg_catalog.setval('public."User_Missions_id_working_seq"', 2, true);


--
-- Name: Users_id_user_seq; Type: SEQUENCE SET; Schema: public; Owner: carbonquest
--

SELECT pg_catalog.setval('public."Users_id_user_seq"', 1, true);


--
-- Name: Answers Answers_pkey; Type: CONSTRAINT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."Answers"
    ADD CONSTRAINT "Answers_pkey" PRIMARY KEY (id_answer);


--
-- Name: Articles Articles_pkey; Type: CONSTRAINT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."Articles"
    ADD CONSTRAINT "Articles_pkey" PRIMARY KEY (id_article);


--
-- Name: Missions Missions_pkey; Type: CONSTRAINT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."Missions"
    ADD CONSTRAINT "Missions_pkey" PRIMARY KEY (id_mission);


--
-- Name: Organization Organization_pkey; Type: CONSTRAINT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."Organization"
    ADD CONSTRAINT "Organization_pkey" PRIMARY KEY (id_organisasi);


--
-- Name: Questions Questions_pkey; Type: CONSTRAINT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."Questions"
    ADD CONSTRAINT "Questions_pkey" PRIMARY KEY (id_question);


--
-- Name: Quizzes Quizzes_pkey; Type: CONSTRAINT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."Quizzes"
    ADD CONSTRAINT "Quizzes_pkey" PRIMARY KEY (id_quiz);


--
-- Name: Sessions Sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."Sessions"
    ADD CONSTRAINT "Sessions_pkey" PRIMARY KEY (id_session);


--
-- Name: User_Missions User_Missions_pkey; Type: CONSTRAINT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."User_Missions"
    ADD CONSTRAINT "User_Missions_pkey" PRIMARY KEY (id_working);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id_user);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Answers Answers_id_question_fkey; Type: FK CONSTRAINT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."Answers"
    ADD CONSTRAINT "Answers_id_question_fkey" FOREIGN KEY (id_question) REFERENCES public."Questions"(id_question) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Articles Articles_id_author_fkey; Type: FK CONSTRAINT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."Articles"
    ADD CONSTRAINT "Articles_id_author_fkey" FOREIGN KEY (id_author) REFERENCES public."Organization"(id_organisasi) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Missions Missions_id_creator_fkey; Type: FK CONSTRAINT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."Missions"
    ADD CONSTRAINT "Missions_id_creator_fkey" FOREIGN KEY (id_creator) REFERENCES public."Organization"(id_organisasi) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Questions Questions_id_quiz_fkey; Type: FK CONSTRAINT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."Questions"
    ADD CONSTRAINT "Questions_id_quiz_fkey" FOREIGN KEY (id_quiz) REFERENCES public."Quizzes"(id_quiz) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Quizzes Quizzes_id_creator_fkey; Type: FK CONSTRAINT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."Quizzes"
    ADD CONSTRAINT "Quizzes_id_creator_fkey" FOREIGN KEY (id_creator) REFERENCES public."Organization"(id_organisasi) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Sessions Sessions_id_answer_fkey; Type: FK CONSTRAINT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."Sessions"
    ADD CONSTRAINT "Sessions_id_answer_fkey" FOREIGN KEY (id_answer) REFERENCES public."Answers"(id_answer) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Sessions Sessions_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."Sessions"
    ADD CONSTRAINT "Sessions_id_user_fkey" FOREIGN KEY (id_user) REFERENCES public."Users"(id_user) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User_Missions User_Missions_id_mission_fkey; Type: FK CONSTRAINT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."User_Missions"
    ADD CONSTRAINT "User_Missions_id_mission_fkey" FOREIGN KEY (id_mission) REFERENCES public."Missions"(id_mission) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User_Missions User_Missions_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: carbonquest
--

ALTER TABLE ONLY public."User_Missions"
    ADD CONSTRAINT "User_Missions_id_user_fkey" FOREIGN KEY (id_user) REFERENCES public."Users"(id_user) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: carbonquest
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict SgCwyb6OTSb7hxbYqZR5Q8jWEHr5BuQ7ghWVfksVBvLTqQ4d0GfNsOje7mcRt7E

