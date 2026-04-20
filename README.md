    
🚗 RentiGo
Vehicle Rental Management System
Detailed Project Report
Tech Stack: React.js | Node.js | Express.js | MongoDB | JWT
Version 1.0.0 | Development Period: 2024
1. Project Overview
RentiGo is a comprehensive, full-stack vehicle rental management system designed to connect vehicle owners with customers seeking rental services. The platform facilitates the rental of both two-wheelers and four-wheelers across multiple cities in India, delivering a seamless experience for all stakeholders — customers, vehicle owners, and platform administrators.

RentiGo operates as a peer-to-peer vehicle rental marketplace, automating the entire rental lifecycle from vehicle discovery and booking to owner approval and payment calculation. The system supports multi-city coverage and flexible rental plans including daily, weekly, and monthly options.

1.1 Core Business Model
•	Peer-to-peer vehicle rental marketplace connecting owners and renters
•	Multi-role user system: Customers, Vehicle Owners, and Administrators
•	Automated booking and owner approval workflows
•	Dynamic pricing based on rental duration and vehicle category
•	Instant booking capabilities with real-time availability checking

1.2 Project Objectives
•	Build a scalable, secure platform for vehicle rental transactions
•	Provide vehicle owners a simple interface to list, manage, and earn from their vehicles
•	Enable customers to discover, filter, and book vehicles with minimal friction
•	Give administrators full visibility and control over the platform ecosystem
•	Implement industry-standard security practices for user data and transactions

2. Technology Stack
RentiGo is built on the MERN stack — a modern, JavaScript-based full-stack architecture that enables rapid development, consistent data flow, and scalable deployment. Below is a detailed breakdown of all technologies used:

2.1 Backend Technologies
Technology	Version	Purpose
Node.js	LTS	Server-side JavaScript runtime environment
Express.js	4.18.2	Web framework for REST API development
MongoDB + Mongoose	Mongoose 8.0.3	NoSQL database with ODM for schema management
JWT (jsonwebtoken)	Latest	Stateless authentication and session management
bcryptjs	Latest	Secure password hashing and verification
Multer	Latest	Multipart file upload handling for vehicle images
dotenv	Latest	Environment variable and secrets management
Nodemon	Dev	Hot reloading during development

2.2 Frontend Technologies
Technology	Version	Purpose
React.js	18.2.0	Component-based UI framework
Vite	Latest	Fast build tool and dev server
React Router DOM	6.21.1	Client-side routing and navigation
Axios	1.6.2	HTTP client for API communication
React Context API	Built-in	Global authentication state management
React Hot Toast	2.4.1	User-friendly notification system
date-fns	3.0.6	Date formatting and manipulation utilities
Custom CSS + Variables	—	Responsive styling and theming

3. System Architecture
RentiGo follows a classic three-tier client-server architecture. The React/Vite frontend communicates with the Express.js backend via RESTful HTTP APIs. The backend processes all business logic and interacts with MongoDB through the Mongoose ODM layer. JWT tokens secure every authenticated request, and role-based middleware enforces authorization rules across all API routes.

3.1 User Roles & Permissions
Role	Description	Key Capabilities
Customer	End users who rent vehicles	Browse listings, book vehicles, view booking history
Owner	Vehicle owners who list assets	Add/manage vehicles, approve/reject booking requests
Admin	Platform administrator	Approve vehicles, manage users, oversee all bookings

3.2 Backend Module Structure
•	Models Layer — User.js, Vehicle.js, Booking.js: data schemas and business rules
•	Routes Layer — auth.js, vehicles.js, bookings.js, admin.js, dashboard.js: API endpoints
•	Middleware Layer — JWT verification and role-based authorization guard

3.3 Frontend Module Structure
•	Pages — Home, Vehicles, VehicleDetail, MyBookings, OwnerDashboard, AdminDashboard, AddVehicle
•	Components — Navbar (navigation + user menu), VehicleCard (reusable listing card)
•	Context — AuthContext.jsx managing global authentication state and user data

3.4 Data Flow
•	Authentication Flow: User logs in → JWT issued → token stored → sent in Authorization header on all requests
•	Booking Flow: Customer selects vehicle → checks availability → submits booking → owner approves/rejects → status updates
•	File Upload Flow: Owner submits vehicle form with images → Multer processes → files stored locally → URLs saved in MongoDB

4. Key Features
4.1 Multi-Role User Management
RentiGo supports three distinct user roles, each with tailored dashboards and route-level access control. Customers browse and book vehicles, owners list and manage their fleet with an approval workflow, and administrators oversee the entire platform including vehicle approvals and user management. All roles share a single authentication system secured with JWT and bcryptjs password hashing.

4.2 Vehicle Management System
Vehicle owners can register their vehicles with up to 6 images, detailed specifications, and flexible pricing. The platform supports a wide range of vehicle categories, fuel types, and transmission options:
Category	Vehicle Types	Fuel Types	Transmission
2-Wheelers	Scooters, Motorcycles	Petrol, Electric, CNG	Manual, Automatic
4-Wheelers	Cars, SUVs	Petrol, Diesel, Electric, Hybrid, CNG	Manual, Automatic

4.3 Booking & Pricing System
The booking system supports daily, weekly, and monthly rental types with automated price calculation. It includes real-time availability checking, an owner approval mechanism with status-based lifecycle management, and protection against double bookings through atomic database operations. Customers can view their full booking history and track status updates in real time.

4.4 Advanced Search & Discovery
•	Filter by vehicle type, fuel type, transmission, and location
•	Price range filtering with dynamic results
•	Brand and model text search
•	Featured vehicles showcase on the landing page
•	Grid and list view toggle for vehicle listings

4.5 Admin Dashboard
The administrator dashboard provides complete platform visibility: booking statistics, vehicle inventory overview, user account management, and vehicle approval workflows. Admins can approve or reject newly listed vehicles, activate or deactivate user accounts, and monitor all active and historical bookings from a single interface.

5. Challenges & Solutions
Challenge	Solution Implemented
Multiple vehicle image uploads	Multer middleware with 50MB per-file limit, unique filename generation, and organized directory structure
Secure multi-role authentication	JWT stateless authentication with role-based middleware on every protected route and token expiration management
Preventing double bookings	Atomic MongoDB operations and real-time status updates to ensure vehicle availability is locked during booking creation
Dynamic pricing logic	Automated calculation algorithms supporting daily, weekly, and monthly pricing tiers per vehicle
Multi-role authorization	Role-based access control middleware with granular permissions per route for customers, owners, and admins
Booking approval coordination	Status-based booking state machine with transitions covering pending, approved, rejected, and completed states
Data integrity across schemas	Comprehensive Mongoose schema validation rules with custom error handling and input sanitization

6. Learnings & Takeaways
6.1 Technical Learnings
•	Mastered MERN stack development and RESTful API design principles end-to-end
•	Implemented industry-standard JWT authentication with role-based access control patterns
•	Gained hands-on experience with MongoDB schema design, relationships in NoSQL, and Mongoose validation
•	Learned file upload handling in Node.js including storage strategies and performance considerations
•	Applied React Context API for scalable global state management across complex component trees
•	Understood Vite as a modern build tool — faster hot reloads and optimized production builds vs. CRA

6.2 Business Logic Learnings
•	Designed a multi-sided marketplace with distinct flows for each role (customer, owner, admin)
•	Built status-based state machines for booking lifecycle management with clean transitions
•	Understood peer-to-peer marketplace dynamics including trust, verification, and approval workflows
•	Implemented dynamic pricing logic that adapts to rental duration and vehicle category

6.3 Project Architecture Learnings
•	Separation of concerns through modular MVC-style backend architecture
•	Importance of environment variable management for secure and portable deployments
•	RESTful API design principles: consistent naming, proper HTTP methods, and error response patterns
•	Responsive UI design with CSS variables for consistent theming across device sizes

7. Future Improvements
7.1 Technical Enhancements
•	Redis caching for frequently accessed vehicle listings and search results
•	Image compression pipeline and CDN integration for faster media delivery
•	OAuth 2.0 integration for Google/Facebook social login
•	Rate limiting and DDoS protection for all public API endpoints
•	Real-time application monitoring and error tracking with tools like Sentry

7.2 Feature Enhancements
•	Payment gateway integration (Razorpay/Stripe) with escrow for secure transactions and automated refunds
•	Real-time calendar integration for accurate availability and scheduling
•	In-app messaging between customers and owners for seamless communication
•	React Native mobile app with push notifications and GPS-based location services
•	AI-powered recommendation engine for personalized vehicle suggestions
•	Automated SMS/email notifications for booking status changes

7.3 Business & Scalability Improvements
•	Insurance provider partnership integration with automated coverage processing
•	Document and driving license verification automation for customer onboarding
•	Advanced analytics dashboard for revenue optimization and market trend analysis
•	Microservices architecture migration for independent scaling of high-load modules
•	Multi-language support for regional expansion across India

8. Conclusion
RentiGo represents a comprehensive and well-engineered solution in the vehicle rental marketplace domain. The project successfully delivers on its core promise — connecting vehicle owners with customers through a secure, automated, and user-friendly platform. Built on a modern MERN stack, RentiGo demonstrates strong technical foundations including robust authentication, scalable architecture, and clean separation of concerns.

The project showcases full-stack development capabilities across the entire application lifecycle: from database schema design and REST API development, to React component architecture, file management, and role-based security. Every technical decision — from JWT authentication to Multer-based image handling — reflects industry-standard practices applicable to real-world production systems.

With the identified roadmap of future improvements, RentiGo has strong potential for growth — expanding into mobile platforms, integrating payments and insurance, and scaling to handle higher traffic with microservices and caching. The solid foundation established through this project positions it well for real-world deployment and continued development.

— End of Project Report —
