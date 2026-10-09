# Barber Shop SaaS — System Architecture

## 1. Purpose

This document defines the initial software architecture for the Barber Shop SaaS platform. It describes the major application layers, responsibilities, data flow, authentication approach, project structure, security boundaries and software engineering principles that will guide implementation.

The architecture is intentionally kept simple enough for the initial release while allowing the system to be extended later.

---

## 2. Architecture Goals

The architecture should:

- Separate presentation, application logic and data access.
- Keep business rules independent from UI components where practical.
- Make important logic easy to test.
- Support secure authentication and role-based authorisation.
- Reduce duplicated code.
- Make the codebase maintainable and understandable.
- Allow future features to be added without unnecessary redesign.
- Keep external services such as Supabase behind clear boundaries.

---

## 3. High-Level Architecture

The planned architecture is:

```text
┌─────────────────────────────┐
│            User             │
│ Customer / Barber / Admin   │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│     Presentation Layer      │
│ React + TypeScript          │
│ Pages / Components / Forms  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Application / Service Layer │
│ Booking / Availability /    │
│ User / Service Operations   │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      Data Access Layer      │
│ Supabase Client / Queries   │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      Supabase Services      │
│ Auth + PostgreSQL + RLS     │
└─────────────────────────────┘
```

---

## 4. Architecture Layers

### 4.1 Presentation Layer

**Responsibility:** Display information and collect user input.

Examples:

- Login page
- Registration page
- Service listing
- Booking form
- Customer dashboard
- Barber dashboard
- Admin dashboard
- Appointment lists
- Availability management forms

The presentation layer should not contain large amounts of database or business logic.

For example, a booking page should collect the user's choices and call an appropriate application/service function rather than directly implementing every booking rule.

---

### 4.2 Application / Service Layer

**Responsibility:** Coordinate application operations and enforce business rules.

Potential services include:

```text
authService
bookingService
availabilityService
serviceService
userService
```

Examples of business rules:

- A customer must be authenticated before booking.
- A selected service must be active.
- A barber must be available.
- An appointment must not conflict with another active appointment.
- A customer should only be able to cancel eligible appointments.
- A user should only perform actions permitted by their role.

Keeping these rules outside UI components improves maintainability and testability.

---

### 4.3 Data Access Layer

**Responsibility:** Handle communication with Supabase/PostgreSQL.

Database operations should be kept in appropriate service/data-access modules rather than scattered throughout components.

For example:

```text
bookingService
      ↓
booking data-access functions
      ↓
Supabase
      ↓
PostgreSQL
```

This creates a clearer boundary between application logic and database implementation.

---

### 4.4 Backend / Supabase Layer

Supabase will provide:

- Authentication
- PostgreSQL database
- Row Level Security
- Backend services required by the application

The frontend will communicate with Supabase through controlled application/data-access functions.

---

## 5. Authentication Architecture

The planned authentication flow is:

```text
User
  │
  ▼
Login / Registration
  │
  ▼
Supabase Auth
  │
  ▼
Authenticated Session
  │
  ▼
Application identifies user/profile
  │
  ▼
Role
  │
  ├── Customer → Customer Dashboard
  ├── Barber   → Barber Dashboard
  └── Admin    → Admin Dashboard
```

Authentication credentials should be managed by Supabase Auth rather than storing passwords in the application database.

The application will use the authenticated session when making protected operations.

---

## 6. Authorisation and Role-Based Access

Authentication answers:

> Who is the user?

Authorisation answers:

> What is the user allowed to do?

The application will use role-based access.

### Customer

Can access:

- Customer dashboard
- Own profile
- Services
- Available appointments
- Own appointments

### Barber

Can access:

- Barber dashboard
- Own availability
- Assigned appointments
- Permitted barber functionality

### Administrator

Can access:

- Administrative dashboard
- User management
- Barber management
- Service management
- Appointment management

Both application-level checks and database-level security policies should be used where appropriate.

---

## 7. Booking Data Flow

The booking process will follow a controlled flow:

```text
Customer selects service
        │
        ▼
Customer selects barber
        │
        ▼
System requests available slots
        │
        ▼
Customer selects date/time
        │
        ▼
Application validates booking
        │
        ├── Invalid → Error
        │
        ▼
Check barber availability
        │
        ├── Unavailable → Error
        │
        ▼
Check appointment conflict
        │
        ├── Conflict → Reject booking
        │
        ▼
Create appointment
        │
        ▼
Return confirmation
```

The double-booking rule is a critical business rule and should be protected against race conditions as far as practical through appropriate database/transaction design.

---

## 8. Cancellation Data Flow

```text
Customer selects appointment
        │
        ▼
System verifies ownership
        │
        ▼
System checks cancellation rules
        │
        ├── Not allowed → Error
        │
        ▼
Update appointment status
        │
        ▼
Appointment becomes inactive
        │
        ▼
Slot may become available
```

The application should normally change an appointment to a cancelled state rather than immediately deleting the historical booking record.

---

## 9. Planned Project Structure

The initial project structure is expected to follow a separation similar to:

```text
barber-shop-saas/
│
├── docs/
│   ├── requirements.md
│   ├── use-cases.md
│   ├── database-design.md
│   ├── architecture.md
│   └── testing-strategy.md
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── types/
│   ├── lib/
│   ├── utils/
│   └── ...
│
├── tests/
│
├── .env.example
├── .gitignore
├── README.md
├── package.json
└── ...
```

The exact structure may change during implementation if there is a clear reason.

---

## 10. Folder Responsibilities

### `components/`

Reusable UI components such as:

- Buttons
- Forms
- Navigation
- Appointment cards
- Service cards
- Modal/dialog components

### `pages/`

Higher-level application pages/routes such as:

- Login
- Register
- Customer dashboard
- Barber dashboard
- Admin dashboard
- Booking page

### `services/`

Application operations and business logic such as:

- Booking operations
- Availability operations
- Service operations
- User operations

### `hooks/`

Reusable React hooks for application behaviour and state interaction.

### `types/`

Shared TypeScript types and interfaces.

### `lib/`

External service configuration and reusable clients, such as the Supabase client.

### `utils/`

Small general-purpose utilities that do not belong to a specific business service.

### `tests/`

Automated tests and supporting test files.

---

## 11. Separation of Responsibilities

A key architectural rule is:

```text
UI Component
     ↓
Application Service
     ↓
Data Access
     ↓
Supabase
```

Avoid:

```text
UI Component
     ↓
Large business logic
     ↓
Many direct database queries
     ↓
Supabase
```

The second approach can make components difficult to understand and test.

---

## 12. Software Engineering Principles

### Separation of Concerns

Each part of the application should have a focused responsibility.

### Single Responsibility

A module or component should have a clear primary responsibility.

### DRY

Common logic should be reused rather than duplicated.

### KISS

The architecture should remain as simple as possible while meeting requirements.

### YAGNI

Features should not be implemented without a justified requirement.

### SOLID

SOLID principles will be applied where they provide a practical improvement to maintainability and testability.

### Encapsulation

Implementation details should be hidden behind appropriate interfaces or service functions.

### Low Coupling

Modules should avoid unnecessary dependencies on each other.

### High Cohesion

Related responsibilities should be kept together.

---

## 13. Security Architecture

Security is considered throughout the architecture rather than added after development.

The application should include:

- Supabase authentication.
- Role-based authorisation.
- Supabase Row Level Security.
- Input validation.
- Appropriate database constraints.
- Protected environment variables.
- No secrets committed to GitHub.
- Safe error messages that do not expose sensitive information.
- Appropriate ownership checks for customer data.
- Appropriate permission checks for barber and administrator actions.

---

## 14. Environment Configuration

Sensitive configuration should be stored through environment variables.

A local environment file should not be committed if it contains secrets.

The repository should include:

```text
.env.example
```

with placeholder values showing which configuration variables are required.

The real `.env` file should be included in `.gitignore`.

---

## 15. Error Handling

Errors should be handled at appropriate boundaries.

Examples:

- Invalid form input → display validation feedback.
- Authentication failure → display a safe authentication error.
- Database failure → log useful diagnostic information without exposing sensitive details to users.
- Booking conflict → explain that the selected slot is no longer available.
- Unauthorised action → reject the operation.

The application should avoid exposing raw database errors to end users.

---

## 16. Testing Architecture

The architecture should support testing at multiple levels.

```text
Unit Tests
    ↓
Component / Integration Tests
    ↓
System / Workflow Tests
    ↓
Manual Acceptance Testing
```

Important business rules such as booking conflicts, cancellation rules, permissions and availability should be testable independently from the user interface where practical.

---

## 17. Scalability Considerations

The initial system is designed for a small-to-medium project scope.

Potential future scaling areas include:

- Multiple barber shops.
- Multiple locations.
- Larger numbers of appointments.
- Background notifications.
- Payment processing.
- Analytics.
- External calendar integration.

The initial architecture should not introduce unnecessary complexity solely for hypothetical future requirements.

---

## 18. Architecture Decisions

The following decisions have currently been made:

| Decision | Choice | Reason |
|---|---|---|
| Frontend | React + TypeScript | Component-based UI and strong typing. |
| Backend services | Supabase | Provides authentication and PostgreSQL-backed services. |
| Database | PostgreSQL | Relational model suits users, services, availability and appointments. |
| IDE | Visual Studio Code | Flexible development environment. |
| Version control | Git + GitHub | Version history and professional development workflow. |
| Documentation | Markdown in GitHub | Easy to version and view directly in the repository. |
| Authentication | Supabase Auth | Avoid implementing password management from scratch. |
| Database security | Supabase RLS | Database-level access control. |

---

## 19. Architecture Review

This architecture will be reviewed during implementation.

Changes should be documented when they materially affect:

- Application structure.
- Database interactions.
- Authentication.
- Authorisation.
- Security.
- Testing.
- Major technology choices.

Architecture should evolve based on actual requirements rather than speculative complexity.

---

## 20. Next Step

After this architecture has been reviewed, the next stage is the practical development environment setup:

1. Create the personal GitHub repository.
2. Install/check Git and Node.js.
3. Create the React + TypeScript project in VS Code.
4. Initialise Git.
5. Add the documentation.
6. Create the initial `.gitignore`.
7. Make the first meaningful commit.
8. Create the Supabase project.
9. Connect the application to Supabase safely.
