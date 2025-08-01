--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: orders_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.orders_status_enum AS ENUM (
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled'
);


--
-- Name: payments_provider_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payments_provider_enum AS ENUM (
    'stripe',
    'kushki',
    'local'
);


--
-- Name: payments_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payments_status_enum AS ENUM (
    'pending',
    'paid',
    'failed'
);


--
-- Name: products_condition_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.products_condition_enum AS ENUM (
    'NEW',
    'USED',
    'REFURBISHED'
);


--
-- Name: sellers_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.sellers_status_enum AS ENUM (
    'active',
    'inactive',
    'banned'
);


--
-- Name: subscriptions_billingcycle_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.subscriptions_billingcycle_enum AS ENUM (
    'monthly',
    'yearly'
);


--
-- Name: subscriptions_plan_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.subscriptions_plan_enum AS ENUM (
    'basic',
    'premium',
    'enterprise'
);


--
-- Name: subscriptions_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.subscriptions_status_enum AS ENUM (
    'paid',
    'unpaid'
);


--
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.users_role_enum AS ENUM (
    'customer',
    'seller',
    'admin'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.addresses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "recipientName" character varying NOT NULL,
    "streetAddress" character varying NOT NULL,
    city character varying NOT NULL,
    province character varying NOT NULL,
    country character varying NOT NULL,
    "postalCode" character varying,
    "phoneNumber" character varying,
    "isDefault" boolean DEFAULT false NOT NULL,
    customer_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    "cartId" uuid,
    "productId" uuid
);


--
-- Name: carts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    "customerId" uuid NOT NULL
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    description character varying,
    "parentId" uuid
);


--
-- Name: customers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id uuid
);


--
-- Name: inventory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inventory (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    stock integer NOT NULL,
    reserved_stock integer DEFAULT 0 NOT NULL,
    sold_stock integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    "categoryId" uuid NOT NULL
);


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    order_id uuid NOT NULL,
    product_id uuid NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL
);


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    status public.orders_status_enum DEFAULT 'pending'::public.orders_status_enum NOT NULL,
    total numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    customer_id uuid
);


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider public.payments_provider_enum NOT NULL,
    status public.payments_status_enum DEFAULT 'pending'::public.payments_status_enum NOT NULL,
    transaction_id character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    order_id uuid
);


--
-- Name: product_reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    rating integer NOT NULL,
    comment text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    "userId" uuid NOT NULL,
    "productId" uuid NOT NULL
);


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    description character varying,
    price numeric(10,2) NOT NULL,
    condition public.products_condition_enum NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    "sellerId" uuid,
    "inventoryId" uuid
);


--
-- Name: sellers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sellers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    store_name character varying NOT NULL,
    store_description text,
    store_logo character varying,
    status public.sellers_status_enum DEFAULT 'active'::public.sellers_status_enum NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    subscription_id uuid
);


--
-- Name: shipping_info; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipping_info (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    shipping_method character varying(100) NOT NULL,
    tracking_number character varying,
    carrier_name character varying(100),
    order_id uuid,
    address_id uuid,
    estimated_delivery_date timestamp without time zone
);


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    plan public.subscriptions_plan_enum NOT NULL,
    "billingCycle" public.subscriptions_billingcycle_enum NOT NULL,
    status public.subscriptions_status_enum DEFAULT 'unpaid'::public.subscriptions_status_enum NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    "sellerId" uuid
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(100) NOT NULL,
    full_name character varying(100),
    role public.users_role_enum NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    firebase_uid character varying,
    profile_image text
);


--
-- Name: warehouse; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.warehouse (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    seller_id uuid,
    address_id uuid NOT NULL
);


--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.addresses (id, "recipientName", "streetAddress", city, province, country, "postalCode", "phoneNumber", "isDefault", customer_id, created_at, updated_at) VALUES ('df8e2642-3241-4068-afd3-da702cbb6dd0', 'John Doe', '123 Main Street', 'New York', 'NY', 'USA', '10001', '+1234567890', 't', '4c498162-1bc1-4092-a313-cc727f5e388c', '2025-08-01 09:18:36.872195', '2025-08-01 09:18:36.872195');


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.carts (id, created_at, "customerId") VALUES ('cf5dbcef-5e36-44e7-8316-0180a1b3d7bf', '2025-08-01 10:05:18.274091', '4c498162-1bc1-4092-a313-cc727f5e388c');


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.categories (id, name, description, "parentId") VALUES ('53a2c077-189f-4a20-9e83-44658d4dd81c', 'Electronics', 'Electronic products and gadgets', NULL);
INSERT INTO public.categories (id, name, description, "parentId") VALUES ('84090259-24dd-4fff-8c01-18bf7e0b4b8a', 'Electronics', 'Electronic products and gadgets', NULL);


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.customers (id, created_at, user_id) VALUES ('0c1f8173-1e84-4dd6-a8f5-4390afe24339', '2025-07-31 16:00:13.10011', 'c6a39b1a-526c-4613-a71a-c06fb4679322');
INSERT INTO public.customers (id, created_at, user_id) VALUES ('4c498162-1bc1-4092-a313-cc727f5e388c', '2025-08-01 09:17:58.911481', '7a505670-ab7e-461e-9b98-7de45b5d0a44');


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.inventory (id, stock, reserved_stock, sold_stock, created_at, updated_at, "categoryId") VALUES ('5a9c7c6b-18e8-451b-bb1c-22a63d56ef9c', '50', '0', '0', '2025-07-31 14:54:49.052491', '2025-07-31 14:54:49.052491', '53a2c077-189f-4a20-9e83-44658d4dd81c');
INSERT INTO public.inventory (id, stock, reserved_stock, sold_stock, created_at, updated_at, "categoryId") VALUES ('eccac25e-38b0-4d69-a9dd-0c1073a3da5c', '100', '0', '0', '2025-08-01 09:29:04.316159', '2025-08-01 09:29:04.316159', '84090259-24dd-4fff-8c01-18bf7e0b4b8a');


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.orders (id, status, total, created_at, updated_at, customer_id) VALUES ('c1adb365-42ef-49ae-9b14-1959ed0bd83c', 'pending', '99.99', '2025-08-01 10:33:33.195277', '2025-08-01 10:33:33.195277', NULL);
INSERT INTO public.orders (id, status, total, created_at, updated_at, customer_id) VALUES ('ed6fa978-347a-43af-b6eb-c196c4ff0ea6', 'pending', '999.99', '2025-08-01 10:41:56.466072', '2025-08-01 10:41:56.466072', NULL);
INSERT INTO public.orders (id, status, total, created_at, updated_at, customer_id) VALUES ('5c943b29-92aa-4a81-adc4-65efd48d3032', 'pending', '999.99', '2025-08-01 10:42:24.206244', '2025-08-01 10:42:24.206244', NULL);
INSERT INTO public.orders (id, status, total, created_at, updated_at, customer_id) VALUES ('d48a16e2-7d75-4d92-8a44-4ddb2896dac8', 'pending', '999.99', '2025-08-01 10:42:28.354275', '2025-08-01 10:42:28.354275', NULL);
INSERT INTO public.orders (id, status, total, created_at, updated_at, customer_id) VALUES ('286f0c8d-80b7-4cab-a5b2-0b20ef053ff7', 'pending', '999.99', '2025-08-01 10:49:41.202269', '2025-08-01 10:49:41.202269', '4c498162-1bc1-4092-a313-cc727f5e388c');


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.payments (id, provider, status, transaction_id, created_at, order_id) VALUES ('3ba34921-297b-4220-a349-1f119933e4e3', 'stripe', 'pending', 'txn_1234567890', '2025-08-01 10:55:53.963699', '286f0c8d-80b7-4cab-a5b2-0b20ef053ff7');


--
-- Data for Name: product_reviews; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.product_reviews (id, rating, comment, created_at, updated_at, "userId", "productId") VALUES ('eb5112ca-81c4-44ad-96d8-439ff4d4e625', '5', 'Excellent product! Highly recommended.', '2025-08-01 11:01:46.177623', '2025-08-01 11:01:46.177623', '7a505670-ab7e-461e-9b98-7de45b5d0a44', '004f8212-d402-423d-8af5-65ce3c116f19');


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.products (id, name, description, price, condition, created_at, updated_at, "sellerId", "inventoryId") VALUES ('875de8ce-079c-42c7-9b91-0d3e051b3a9d', 'iPhone 15', 'Latest iPhone model', '999.99', 'NEW', '2025-07-31 14:33:25.156902', '2025-07-31 14:33:25.156902', '669f87f4-69a1-47a2-8e91-d1f7b86bca8f', NULL);
INSERT INTO public.products (id, name, description, price, condition, created_at, updated_at, "sellerId", "inventoryId") VALUES ('004f8212-d402-423d-8af5-65ce3c116f19', 'iPhone 15', 'Latest iPhone model with advanced features', '999.99', 'NEW', '2025-08-01 09:59:51.492427', '2025-08-01 09:59:51.492427', '44cbe545-d2be-4eeb-8637-5905e61706c8', NULL);


--
-- Data for Name: sellers; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.sellers (id, store_name, store_description, store_logo, status, created_at, user_id, subscription_id) VALUES ('d1419d53-daa8-4ba7-9807-cb81bbb0c237', 'Tech Store', 'Best electronics store', NULL, 'active', '2025-07-31 12:42:39.995964', 'c6a39b1a-526c-4613-a71a-c06fb4679322', NULL);
INSERT INTO public.sellers (id, store_name, store_description, store_logo, status, created_at, user_id, subscription_id) VALUES ('669f87f4-69a1-47a2-8e91-d1f7b86bca8f', 'Tech Store', 'Best electronics store', NULL, 'active', '2025-07-31 14:32:11.66003', 'c6a39b1a-526c-4613-a71a-c06fb4679322', NULL);
INSERT INTO public.sellers (id, store_name, store_description, store_logo, status, created_at, user_id, subscription_id) VALUES ('44cbe545-d2be-4eeb-8637-5905e61706c8', 'Tech Store', 'Your trusted electronics store', 'https://example.com/logo.png', 'active', '2025-08-01 09:34:24.531783', '7a505670-ab7e-461e-9b98-7de45b5d0a44', NULL);


--
-- Data for Name: shipping_info; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.shipping_info (id, shipping_method, tracking_number, carrier_name, order_id, address_id, estimated_delivery_date) VALUES ('cde64ec3-054a-4c83-a957-68c455a5227e', 'Standard Shipping', '1Z999AA1234567890', 'UPS', NULL, NULL, NULL);
INSERT INTO public.shipping_info (id, shipping_method, tracking_number, carrier_name, order_id, address_id, estimated_delivery_date) VALUES ('0796d4d4-4c16-4f88-81e9-217808ba8edf', 'Express Shipping', '1Z999AA1234567891', 'FedEx', 'c1adb365-42ef-49ae-9b14-1959ed0bd83c', 'df8e2642-3241-4068-afd3-da702cbb6dd0', '2025-01-10 05:00:00');
INSERT INTO public.shipping_info (id, shipping_method, tracking_number, carrier_name, order_id, address_id, estimated_delivery_date) VALUES ('f3f4db2e-3506-48aa-a9f6-dd678f80a96c', 'Express Shipping', '1Z999AA1234567891', 'FedEx', '286f0c8d-80b7-4cab-a5b2-0b20ef053ff7', 'df8e2642-3241-4068-afd3-da702cbb6dd0', '2025-01-10 05:00:00');


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.subscriptions (id, plan, "billingCycle", status, start_date, end_date, created_at, "sellerId") VALUES ('7f41aa2f-0511-4bca-8e6a-6ee2e64b7753', 'premium', 'monthly', 'unpaid', '2023-12-31 19:00:00', '2024-01-31 19:00:00', '2025-08-01 09:35:16.32118', NULL);
INSERT INTO public.subscriptions (id, plan, "billingCycle", status, start_date, end_date, created_at, "sellerId") VALUES ('b9bfbb46-e4d9-44ff-8da1-62682529dff0', 'premium', 'monthly', 'unpaid', '2024-01-01 00:00:00', '2024-02-01 00:00:00', '2025-08-01 09:37:06.799613', NULL);
INSERT INTO public.subscriptions (id, plan, "billingCycle", status, start_date, end_date, created_at, "sellerId") VALUES ('8b5f90ab-234b-4b7a-a06d-35b8be2d487b', 'premium', 'monthly', 'unpaid', '2024-01-01 00:00:00', '2024-02-01 00:00:00', '2025-08-01 09:37:48.414031', NULL);
INSERT INTO public.subscriptions (id, plan, "billingCycle", status, start_date, end_date, created_at, "sellerId") VALUES ('52366b60-1568-43e0-9f67-1c09b761dfa1', 'premium', 'monthly', 'unpaid', '2024-01-01 00:00:00', '2024-02-01 00:00:00', '2025-08-01 09:45:02.975071', '44cbe545-d2be-4eeb-8637-5905e61706c8');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users (id, email, full_name, role, is_verified, created_at, firebase_uid, profile_image) VALUES ('6cbbf5ab-84cb-46a0-971c-d197ed5ecc77', 'admin@loquepida.com', NULL, 'customer', 't', '2025-07-31 11:06:03.10423', '2v5PZXij86awZH1JV8hcTvWYKy63', NULL);
INSERT INTO public.users (id, email, full_name, role, is_verified, created_at, firebase_uid, profile_image) VALUES ('c6a39b1a-526c-4613-a71a-c06fb4679322', 'testuser@example.com', 'Test User', 'seller', 't', '2025-07-31 12:14:14.402236', NULL, NULL);
INSERT INTO public.users (id, email, full_name, role, is_verified, created_at, firebase_uid, profile_image) VALUES ('7a505670-ab7e-461e-9b98-7de45b5d0a44', 'testuser@loquepida.com', 'Test User', 'seller', 't', '2025-08-01 09:10:27.454114', 'loquepida-d1366', 'https://loquepida.com/avatar.jpg');


--
-- Data for Name: warehouse; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.warehouse (id, name, created_at, updated_at, seller_id, address_id) VALUES ('9c10a1dc-0e85-4e8b-83ff-f33258534a2e', 'Main Warehouse', '2025-08-01 09:53:58.826445', '2025-08-01 09:53:58.826445', '44cbe545-d2be-4eeb-8637-5905e61706c8', 'df8e2642-3241-4068-afd3-da702cbb6dd0');


--
-- Name: products PK_0806c755e0aca124e67c0cf6d7d; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY (id);


--
-- Name: customers PK_133ec679a801fab5e070f73d3ea; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY (id);


--
-- Name: payments PK_197ab7af18c93fbb0c9b28b4a59; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY (id);


--
-- Name: categories PK_24dbc6126a28ff948da33e97d3b; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY (id);


--
-- Name: order_items PK_6335813ef19bc35b8d866cc6565; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "PK_6335813ef19bc35b8d866cc6565" PRIMARY KEY (order_id, product_id);


--
-- Name: product_reviews PK_67c1501aea1b0633ec441b00bd5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT "PK_67c1501aea1b0633ec441b00bd5" PRIMARY KEY (id);


--
-- Name: cart_items PK_6fccf5ec03c172d27a28a82928b; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "PK_6fccf5ec03c172d27a28a82928b" PRIMARY KEY (id);


--
-- Name: orders PK_710e2d4957aa5878dfe94e4ac2f; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY (id);


--
-- Name: addresses PK_745d8f43d3af10ab8247465e450; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY (id);


--
-- Name: inventory PK_82aa5da437c5bbfb80703b08309; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY (id);


--
-- Name: warehouse PK_965abf9f99ae8c5983ae74ebde8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.warehouse
    ADD CONSTRAINT "PK_965abf9f99ae8c5983ae74ebde8" PRIMARY KEY (id);


--
-- Name: sellers PK_97337ccbf692c58e6c7682de8a2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sellers
    ADD CONSTRAINT "PK_97337ccbf692c58e6c7682de8a2" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: subscriptions PK_a87248d73155605cf782be9ee5e; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY (id);


--
-- Name: carts PK_b5f695a59f5ebb50af3c8160816; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY (id);


--
-- Name: shipping_info PK_f81527a1b48d655ce69b6962a0e; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_info
    ADD CONSTRAINT "PK_f81527a1b48d655ce69b6962a0e" PRIMARY KEY (id);


--
-- Name: customers REL_11d81cd7be87b6f8865b0cf766; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT "REL_11d81cd7be87b6f8865b0cf766" UNIQUE (user_id);


--
-- Name: shipping_info REL_8d397ffef0fdd056f832bff9fb; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_info
    ADD CONSTRAINT "REL_8d397ffef0fdd056f832bff9fb" UNIQUE (order_id);


--
-- Name: payments REL_b2f7b823a21562eeca20e72b00; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "REL_b2f7b823a21562eeca20e72b00" UNIQUE (order_id);


--
-- Name: users UQ_0fd54ced5cc75f7cb92925dd803; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_0fd54ced5cc75f7cb92925dd803" UNIQUE (firebase_uid);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: customers FK_11d81cd7be87b6f8865b0cf7661; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT "FK_11d81cd7be87b6f8865b0cf7661" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: order_items FK_145532db85752b29c57d2b7b1f1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: product_reviews FK_32edd80d91dff1bc19e79c8f16d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT "FK_32edd80d91dff1bc19e79c8f16d" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: inventory FK_4156c96b439e425420e79a78edb; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT "FK_4156c96b439e425420e79a78edb" FOREIGN KEY ("categoryId") REFERENCES public.categories(id);


--
-- Name: warehouse FK_48ef9dea9c6ae3eeb8689db8036; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.warehouse
    ADD CONSTRAINT "FK_48ef9dea9c6ae3eeb8689db8036" FOREIGN KEY (seller_id) REFERENCES public.sellers(id) ON DELETE CASCADE;


--
-- Name: cart_items FK_72679d98b31c737937b8932ebe6; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "FK_72679d98b31c737937b8932ebe6" FOREIGN KEY ("productId") REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: addresses FK_7482082bf53fd0ba88a32e3de88; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT "FK_7482082bf53fd0ba88a32e3de88" FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: orders FK_772d0ce0473ac2ccfa26060dbe9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9" FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: subscriptions FK_820bf488142dab69f3234c2a38e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT "FK_820bf488142dab69f3234c2a38e" FOREIGN KEY ("sellerId") REFERENCES public.sellers(id) ON DELETE CASCADE;


--
-- Name: sellers FK_83f4670f0e114d0be3731bade87; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sellers
    ADD CONSTRAINT "FK_83f4670f0e114d0be3731bade87" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: shipping_info FK_8d397ffef0fdd056f832bff9fb5; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_info
    ADD CONSTRAINT "FK_8d397ffef0fdd056f832bff9fb5" FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_items FK_9263386c35b6b242540f9493b00; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "FK_9263386c35b6b242540f9493b00" FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: product_reviews FK_964f13abf796aca25d7e5849c64; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT "FK_964f13abf796aca25d7e5849c64" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: categories FK_9a6f051e66982b5f0318981bcaa; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "FK_9a6f051e66982b5f0318981bcaa" FOREIGN KEY ("parentId") REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: carts FK_a4393093f31aabad6de1f54b0e9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT "FK_a4393093f31aabad6de1f54b0e9" FOREIGN KEY ("customerId") REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: shipping_info FK_abba146dd3a0b2858418baf4f88; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_info
    ADD CONSTRAINT "FK_abba146dd3a0b2858418baf4f88" FOREIGN KEY (address_id) REFERENCES public.addresses(id);


--
-- Name: payments FK_b2f7b823a21562eeca20e72b006; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "FK_b2f7b823a21562eeca20e72b006" FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: products FK_dcf7550e6f03fb1414ed41628f0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "FK_dcf7550e6f03fb1414ed41628f0" FOREIGN KEY ("inventoryId") REFERENCES public.inventory(id);


--
-- Name: warehouse FK_e3166be4143d134babc789bef1c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.warehouse
    ADD CONSTRAINT "FK_e3166be4143d134babc789bef1c" FOREIGN KEY (address_id) REFERENCES public.addresses(id);


--
-- Name: products FK_e40a1dd2909378f0da1f34f7bd6; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "FK_e40a1dd2909378f0da1f34f7bd6" FOREIGN KEY ("sellerId") REFERENCES public.sellers(id);


--
-- Name: cart_items FK_edd714311619a5ad09525045838; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "FK_edd714311619a5ad09525045838" FOREIGN KEY ("cartId") REFERENCES public.carts(id) ON DELETE CASCADE;


--
-- Name: sellers FK_f1b3cbda7fef7c70c02dde19912; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sellers
    ADD CONSTRAINT "FK_f1b3cbda7fef7c70c02dde19912" FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id);


--
-- PostgreSQL database dump complete
--

