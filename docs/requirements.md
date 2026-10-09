# Software Requirements

## 1. Purpose

The Barber Shop SaaS project aims to provide a web-based platform for managing barber shop appointments, services and availability.

## 2. User Roles

- **Customer:** Browse services, book appointments and manage their own bookings.
- **Barber:** View assigned appointments and manage availability.
- **Administrator:** Manage services, users and appointments.

These roles are planned and will be implemented incrementally.

## 3. Functional Requirements

### FR-01: Authentication
The system shall allow users to register, log in and log out securely.

### FR-02: Role-Based Access
The system shall restrict functionality according to the authenticated user's role.

### FR-03: Service Management
The system shall display available services, including descriptions, prices and durations.

### FR-04: Appointment Booking
Customers shall be able to select a service, barber, date and available time slot.

### FR-05: Availability Management
Barbers shall be able to manage their working availability.

### FR-06: Appointment Management
Customers shall be able to view and cancel their own appointments, subject to cancellation rules.

### FR-07: Administrative Management
Administrators shall be able to manage services, users and appointments.

### FR-08: Booking Conflict Prevention
The system shall prevent overlapping active appointments for the same barber.

## 4. Non-Functional Requirements

- **Security:** Protect user information and enforce access controls.
- **Usability:** Provide a clear and accessible interface.
- **Maintainability:** Use modular code and separation of concerns.
- **Reliability:** Validate booking data and handle errors appropriately.
- **Data integrity:** Enforce appropriate database constraints.
- **Testability:** Design functionality so that it can be tested independently.

## 5. Constraints

- The frontend uses React and TypeScript.
- Vite is used for development and building.
- Supabase is the planned authentication and database platform.
- Git and GitHub are used for version control.

## 6. Initial Scope

The initial version will focus on authentication, service listings, availability and appointment booking. Additional functionality will be considered after the core workflows are working.

## 7. Acceptance Criteria

The initial release should allow an authorised customer to view services, select an available appointment slot and create a booking without creating a conflicting active appointment.

Authentication, authorisation, validation and booking behaviour must be tested before the application is considered ready for use.

## 8. Status

This document records planned requirements. Requirements may be refined as the architecture and implementation develop.