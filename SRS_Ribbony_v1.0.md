📄 Software Requirements Specification (SRS)
Ribbony – Custom Gift Magazine Builder
Spring Boot Modular Monolith
Version 1.0
________________________________________
1. Introduction
1.1 Purpose
This document defines the full software requirements for Ribbony, a Spring Boot–based system allowing users to customize gift magazines and submit production orders.
The SRS is structured according to IEEE SRS guidelines and tailored for SE-2 course requirements:
•	Spring Boot REST APIs
•	Role-based authentication
•	Microservice-ready modular monolith
•	Docker deployment
•	AOP
•	PostgreSQL database
•	Backend + simple frontend
This version is optimized for 3 developers and 2 weeks development.
________________________________________
1.2 Scope
Ribbony is a web platform with:
Customer Features:
•	Register & Login
•	Browse products
•	Customize a Magazine product using multi-step wizard
•	Submit an order
•	View own orders


Admin Features:
•	Login
•	Manage products
•	View / update orders
•	Change order status (Pending → Work In Progress → Shipped)
•	Download magazine content as structured ZIP (optional if time)
Deployment:
•	Spring Boot (backend)
•	PostgreSQL (database)
•	Docker Compose
•	Simple frontend (Next.js or static HTML)
________________________________________
1.3 Definitions
Term		Definition
Modular Monolith		Single application divided into independent modules/packages
Customizer		The module responsible for Magazine page inputs & payload
Payload		JSONB object representing magazine content
Order		Includes product + payload + pricing + status
Admin		User with full permissions
Customer		Registered user with minimal permissions

________________________________________

1.4 Users
•	Customer – Creates account, customizes magazine, submits orders.
•	Admin – Manages products & orders.
(Designer role is removed for 2-week scope.)
________________________________________
1.5 Constraints
•	Only 2 weeks.
•	Team size 3 people.
•	Must satisfy SE-2 technical requirements.
•	Visual frontend can be minimal.
________________________________________
1.6 Assumptions
•	Admin handles production/delivery offline.
•	No payment gateway in this version.
•	Photos stored using Cloudinary/local storage.
________________________________________
2. Overall Description
2.1 Product Perspective
Ribbony is a web-based system with a Spring Boot Modular Monolith architecture composed of modules:
/auth-module
/product-module
/customizer-module
/order-module
/shared-infrastructure
Frontend interacts through REST APIs.
________________________________________

2.2 Product Features Summary
Customer:
•	Register / Login
•	Browse products
•	Customize magazine
•	Submit order
•	View order status
Admin:
•	Login
•	Add/edit/delete products
•	View orders
•	Update status
•	Download ZIP (optional)
________________________________________
2.3 User Characteristics
•	Customers: general users
•	Admin: Power user with full rights
________________________________________
2.4 Constraints
•	Spring Boot only
•	PostgreSQL only
•	Docker Compose required
•	AOP mandatory
•	REST APIs mandatory
________________________________________



3. Functional Requirements
3.1 Auth Module
FR-1 Register Customer
Users register with:
•	name
•	email
•	password
FR-2 Login
JWT authentication (access + refresh tokens).
FR-3 Role-Based Access Control
Roles:
•	ADMIN
•	CUSTOMER
FR-4 Protected Routes
All admin APIs require ADMIN role.
________________________________________
3.2 Product Module
FR-5 List Products
System lists products available for purchase.
FR-6 Product Details
Return:
•	name
•	description
•	images
•	price



FR-7 Product Management (Admin)
Admin can:
•	POST /products
•	PUT /products/{id}
•	DELETE /products/{id}
________________________________________
3.3 Customizer Module
FR-8 Create Magazine Payload
Fields:
•	Page count (8 or 12)
•	Color palette
•	Per-page:
•	fields (text)
•	photos (URLs)
Stored as JSONB in DB.
FR-9 Validate Upload Size
Total uploaded photos ≤ 50 MB.
FR-10 Validate Required Fields
________________________________________
3.4 Order Module
FR-11 Create Order
Stores:
•	customer info
•	product ID
•	custom payload
•	price breakdown
•	timestamps

FR-12 Get Customer Orders
Returns orders belonging to logged-in customer.
FR-13 Admin Order Management
Admin can:
•	View all orders
•	Filter by status
FR-14 Order Status Updates
Statuses:
•	PENDING
•	WORK_IN_PROGRESS
•	SHIPPED
FR-15 Download ZIP (Optional)
(Optional for 2 weeks)
Admin downloads ZIP of images.
________________________________________
4. Non-Functional Requirements
NFR-1 Performance
API responses ≤ 300ms on local Docker.
NFR-2 Security
•	BCrypt password hashing
•	JWT
•	Role-based access
NFR-3 AOP
Aspect-Oriented Programming for:
•	Logging
•	Error monitoring
•	Admin action auditing

NFR-4 Database
PostgreSQL 14+
Tables:
•	users
•	products
•	orders
•	palette tables (optional)
NFR-5 Reliability
Graceful handling of invalid inputs.
NFR-6 Docker
Full system runs via Docker Compose.
________________________________________
5. System Modules
Required by course (≥4 modules):
1.	Auth Module
2.	Product Module
3.	Customizer Module
4.	Order Module
5.	(Optional) Admin Module
6.	Shared Infrastructure Module
________________________________________
6. Models & Diagrams (Text Specification)
6.1 ERD Model 
________________________________________
6.2 Order Status Machine
________________________________________
6.3 Sequence
________________________________________
7. Future Enhancements
•	Payment gateway
•	Multi-product cart
•	Designer role
•	Email notifications
•	Analytics dashboard

