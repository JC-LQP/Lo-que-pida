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
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES ('6cbbf5ab-84cb-46a0-971c-d197ed5ecc77', 'admin@loquepida.com', NULL, 'customer', true, '2025-07-31 11:06:03.10423', '2v5PZXij86awZH1JV8hcTvWYKy63', NULL);
INSERT INTO public.users VALUES ('c6a39b1a-526c-4613-a71a-c06fb4679322', 'testuser@example.com', 'Test User', 'seller', true, '2025-07-31 12:14:14.402236', NULL, NULL);
INSERT INTO public.users VALUES ('7a505670-ab7e-461e-9b98-7de45b5d0a44', 'testuser@loquepida.com', 'Test User', 'seller', true, '2025-08-01 09:10:27.454114', 'loquepida-d1366', 'https://loquepida.com/avatar.jpg');


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.customers VALUES ('0c1f8173-1e84-4dd6-a8f5-4390afe24339', '2025-07-31 16:00:13.10011', 'c6a39b1a-526c-4613-a71a-c06fb4679322');
INSERT INTO public.customers VALUES ('4c498162-1bc1-4092-a313-cc727f5e388c', '2025-08-01 09:17:58.911481', '7a505670-ab7e-461e-9b98-7de45b5d0a44');


--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.addresses VALUES ('df8e2642-3241-4068-afd3-da702cbb6dd0', 'John Doe', '123 Main Street', 'New York', 'NY', 'USA', '10001', '+1234567890', true, '4c498162-1bc1-4092-a313-cc727f5e388c', '2025-08-01 09:18:36.872195', '2025-08-01 09:18:36.872195');


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.carts VALUES ('cf5dbcef-5e36-44e7-8316-0180a1b3d7bf', '2025-08-01 10:05:18.274091', '4c498162-1bc1-4092-a313-cc727f5e388c');


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.categories VALUES ('53a2c077-189f-4a20-9e83-44658d4dd81c', 'Electronics', 'Electronic products and gadgets', NULL);
INSERT INTO public.categories VALUES ('84090259-24dd-4fff-8c01-18bf7e0b4b8a', 'Electronics', 'Electronic products and gadgets', NULL);


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.inventory VALUES ('5a9c7c6b-18e8-451b-bb1c-22a63d56ef9c', 50, 0, 0, '2025-07-31 14:54:49.052491', '2025-07-31 14:54:49.052491', '53a2c077-189f-4a20-9e83-44658d4dd81c');
INSERT INTO public.inventory VALUES ('eccac25e-38b0-4d69-a9dd-0c1073a3da5c', 100, 0, 0, '2025-08-01 09:29:04.316159', '2025-08-01 09:29:04.316159', '84090259-24dd-4fff-8c01-18bf7e0b4b8a');


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.subscriptions VALUES ('7f41aa2f-0511-4bca-8e6a-6ee2e64b7753', 'premium', 'monthly', 'unpaid', '2023-12-31 19:00:00', '2024-01-31 19:00:00', '2025-08-01 09:35:16.32118', NULL);
INSERT INTO public.subscriptions VALUES ('b9bfbb46-e4d9-44ff-8da1-62682529dff0', 'premium', 'monthly', 'unpaid', '2024-01-01 00:00:00', '2024-02-01 00:00:00', '2025-08-01 09:37:06.799613', NULL);
INSERT INTO public.subscriptions VALUES ('8b5f90ab-234b-4b7a-a06d-35b8be2d487b', 'premium', 'monthly', 'unpaid', '2024-01-01 00:00:00', '2024-02-01 00:00:00', '2025-08-01 09:37:48.414031', NULL);
INSERT INTO public.subscriptions VALUES ('52366b60-1568-43e0-9f67-1c09b761dfa1', 'premium', 'monthly', 'unpaid', '2024-01-01 00:00:00', '2024-02-01 00:00:00', '2025-08-01 09:45:02.975071', '44cbe545-d2be-4eeb-8637-5905e61706c8');


--
-- Data for Name: sellers; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.sellers VALUES ('d1419d53-daa8-4ba7-9807-cb81bbb0c237', 'Tech Store', 'Best electronics store', NULL, 'active', '2025-07-31 12:42:39.995964', 'c6a39b1a-526c-4613-a71a-c06fb4679322', NULL);
INSERT INTO public.sellers VALUES ('669f87f4-69a1-47a2-8e91-d1f7b86bca8f', 'Tech Store', 'Best electronics store', NULL, 'active', '2025-07-31 14:32:11.66003', 'c6a39b1a-526c-4613-a71a-c06fb4679322', NULL);
INSERT INTO public.sellers VALUES ('44cbe545-d2be-4eeb-8637-5905e61706c8', 'Tech Store', 'Your trusted electronics store', 'https://example.com/logo.png', 'active', '2025-08-01 09:34:24.531783', '7a505670-ab7e-461e-9b98-7de45b5d0a44', NULL);


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.products VALUES ('875de8ce-079c-42c7-9b91-0d3e051b3a9d', 'iPhone 15', 'Latest iPhone model', 999.99, 'NEW', '2025-07-31 14:33:25.156902', '2025-07-31 14:33:25.156902', '669f87f4-69a1-47a2-8e91-d1f7b86bca8f', NULL);
INSERT INTO public.products VALUES ('004f8212-d402-423d-8af5-65ce3c116f19', 'iPhone 15', 'Latest iPhone model with advanced features', 999.99, 'NEW', '2025-08-01 09:59:51.492427', '2025-08-01 09:59:51.492427', '44cbe545-d2be-4eeb-8637-5905e61706c8', NULL);


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.orders VALUES ('c1adb365-42ef-49ae-9b14-1959ed0bd83c', 'pending', 99.99, '2025-08-01 10:33:33.195277', '2025-08-01 10:33:33.195277', NULL);
INSERT INTO public.orders VALUES ('ed6fa978-347a-43af-b6eb-c196c4ff0ea6', 'pending', 999.99, '2025-08-01 10:41:56.466072', '2025-08-01 10:41:56.466072', NULL);
INSERT INTO public.orders VALUES ('5c943b29-92aa-4a81-adc4-65efd48d3032', 'pending', 999.99, '2025-08-01 10:42:24.206244', '2025-08-01 10:42:24.206244', NULL);
INSERT INTO public.orders VALUES ('d48a16e2-7d75-4d92-8a44-4ddb2896dac8', 'pending', 999.99, '2025-08-01 10:42:28.354275', '2025-08-01 10:42:28.354275', NULL);
INSERT INTO public.orders VALUES ('286f0c8d-80b7-4cab-a5b2-0b20ef053ff7', 'pending', 999.99, '2025-08-01 10:49:41.202269', '2025-08-01 10:49:41.202269', '4c498162-1bc1-4092-a313-cc727f5e388c');


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.payments VALUES ('3ba34921-297b-4220-a349-1f119933e4e3', 'stripe', 'pending', 'txn_1234567890', '2025-08-01 10:55:53.963699', '286f0c8d-80b7-4cab-a5b2-0b20ef053ff7');


--
-- Data for Name: product_reviews; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.product_reviews VALUES ('eb5112ca-81c4-44ad-96d8-439ff4d4e625', 5, 'Excellent product! Highly recommended.', '2025-08-01 11:01:46.177623', '2025-08-01 11:01:46.177623', '7a505670-ab7e-461e-9b98-7de45b5d0a44', '004f8212-d402-423d-8af5-65ce3c116f19');


--
-- Data for Name: shipping_info; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.shipping_info VALUES ('cde64ec3-054a-4c83-a957-68c455a5227e', 'Standard Shipping', '1Z999AA1234567890', 'UPS', NULL, NULL, NULL);
INSERT INTO public.shipping_info VALUES ('0796d4d4-4c16-4f88-81e9-217808ba8edf', 'Express Shipping', '1Z999AA1234567891', 'FedEx', 'c1adb365-42ef-49ae-9b14-1959ed0bd83c', 'df8e2642-3241-4068-afd3-da702cbb6dd0', '2025-01-10 05:00:00');
INSERT INTO public.shipping_info VALUES ('f3f4db2e-3506-48aa-a9f6-dd678f80a96c', 'Express Shipping', '1Z999AA1234567891', 'FedEx', '286f0c8d-80b7-4cab-a5b2-0b20ef053ff7', 'df8e2642-3241-4068-afd3-da702cbb6dd0', '2025-01-10 05:00:00');


--
-- Data for Name: warehouse; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.warehouse VALUES ('9c10a1dc-0e85-4e8b-83ff-f33258534a2e', 'Main Warehouse', '2025-08-01 09:53:58.826445', '2025-08-01 09:53:58.826445', '44cbe545-d2be-4eeb-8637-5905e61706c8', 'df8e2642-3241-4068-afd3-da702cbb6dd0');


--
-- PostgreSQL database dump complete
--

