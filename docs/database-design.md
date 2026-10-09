# Barber Shop SaaS — Database Design

## 1. Purpose

This document defines the initial database design for the Barber Shop SaaS platform. It identifies the main entities, attributes, relationships, constraints and database rules required to support authentication, users, barbers, services, availability and appointments.

The design will be reviewed and refined before implementation in Supabase PostgreSQL.

---

## 2. Database Design Goals

The database should:

- Store information in a structured and consistent form.
- Minimise unnecessary duplication.
- Maintain referential integrity through primary and foreign keys.
- Support secure role-based access.
- Support appointment availability and booking.
- Prevent conflicting appointments.
- Allow the system to be extended in the future.
- Work effectively with Supabase PostgreSQL and Row Level Security.

---

## 3. Main Entities

The initial database will contain the following core entities:

1. Profiles
2. Barbers
3. Services
4. Availability
5. Appointments

---

## 4. Entity: Profiles

The `profiles` table stores application-level information associated with authenticated users.

| Attribute | Type | Key / Constraint | Description |
|---|---|---|---|
| id | UUID | Primary Key | Identifies the user/profile. |
| full_name | TEXT | NOT NULL | User's name. |
| email | TEXT | NOT NULL | User's email address. |
| phone | TEXT | Optional | User's contact number. |
| role | TEXT / ENUM | NOT NULL | Application role, such as customer, barber or admin. |
| created_at | TIMESTAMP | NOT NULL | Date/time the profile was created. |

### Notes

Authentication credentials should be handled by Supabase Auth rather than storing passwords in the application database.

The exact relationship between the Supabase Auth user and `profiles.id` will be finalised during implementation.

---

## 5. Entity: Barbers

The `barbers` table stores information specific to users who operate as barbers.

| Attribute | Type | Key / Constraint | Description |
|---|---|---|---|
| id | UUID | Primary Key | Identifies the barber record. |
| profile_id | UUID | Foreign Key → profiles.id, UNIQUE | Links the barber to a user profile. |
| bio | TEXT | Optional | Barber description. |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Indicates whether the barber is currently active. |
| created_at | TIMESTAMP | NOT NULL | Date/time the barber record was created. |

### Relationship

One profile can be associated with zero or one barber record.

One barber can have many availability records and many appointments.

---

## 6. Entity: Services

The `services` table stores the services offered by the barber shop.

| Attribute | Type | Key / Constraint | Description |
|---|---|---|---|
| id | UUID | Primary Key | Identifies the service. |
| name | TEXT | NOT NULL | Service name. |
| description | TEXT | Optional | Description of the service. |
| price | NUMERIC | NOT NULL | Service price. |
| duration_minutes | INTEGER | NOT NULL | Expected service duration. |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Whether the service can currently be booked. |
| created_at | TIMESTAMP | NOT NULL | Date/time the service was created. |

### Constraints

- `price` should not be negative.
- `duration_minutes` should be greater than zero.
- Service names should be validated appropriately.

---

## 7. Entity: Availability

The `availability` table defines when a barber can accept appointments.

| Attribute | Type | Key / Constraint | Description |
|---|---|---|---|
| id | UUID | Primary Key | Identifies the availability record. |
| barber_id | UUID | Foreign Key → barbers.id | Identifies the barber. |
| day_of_week | INTEGER / ENUM | NOT NULL | Represents the recurring working day. |
| start_time | TIME | NOT NULL | Availability start time. |
| end_time | TIME | NOT NULL | Availability end time. |
| created_at | TIMESTAMP | NOT NULL | Date/time the record was created. |

### Constraints

- `start_time` must be earlier than `end_time`.
- A barber should not have overlapping availability records.
- Availability must belong to an existing barber.

### Future consideration

Specific date exceptions such as holidays, annual leave or one-off schedule changes may require an additional availability/exceptions table. This will be considered after the core system is working.

---

## 8. Entity: Appointments

The `appointments` table is the central booking entity.

| Attribute | Type | Key / Constraint | Description |
|---|---|---|---|
| id | UUID | Primary Key | Identifies the appointment. |
| customer_id | UUID | Foreign Key → profiles.id | Identifies the customer. |
| barber_id | UUID | Foreign Key → barbers.id | Identifies the barber. |
| service_id | UUID | Foreign Key → services.id | Identifies the selected service. |
| appointment_date | DATE | NOT NULL | Appointment date. |
| start_time | TIME | NOT NULL | Appointment start time. |
| end_time | TIME | NOT NULL | Appointment end time. |
| status | TEXT / ENUM | NOT NULL | Appointment status. |
| created_at | TIMESTAMP | NOT NULL | Date/time the booking was created. |

### Suggested appointment statuses

```text
pending
confirmed
completed
cancelled
```

The exact status model will be reviewed during implementation.

### Constraints

- `start_time` must be earlier than `end_time`.
- The referenced customer must exist.
- The referenced barber must exist.
- The referenced service must exist.
- Cancelled appointments must not be treated as active bookings.
- Conflicting active appointments for the same barber must be prevented.

---

## 9. Relationships

The initial relationships are:

```text
profiles 1 ───────── 0..1 barbers

barbers 1 ───────── * availability

profiles 1 ───────── * appointments
         (customer)

barbers 1 ───────── * appointments

services 1 ───────── * appointments
```

### Relationship summary

| Relationship | Cardinality | Explanation |
|---|---|---|
| Profile → Barber | 1 : 0..1 | A profile may represent a barber. |
| Barber → Availability | 1 : many | A barber can have multiple availability records. |
| Customer Profile → Appointment | 1 : many | A customer can make many appointments. |
| Barber → Appointment | 1 : many | A barber can have many appointments. |
| Service → Appointment | 1 : many | A service can be selected in many appointments. |

---

## 10. ER Diagram — Initial Model

```text
┌─────────────────────┐
│      PROFILES       │
├─────────────────────┤
│ PK id               │
│ full_name           │
│ email               │
│ phone               │
│ role                │
│ created_at          │
└──────────┬──────────┘
           │ 0..1
           │
           ▼
┌─────────────────────┐
│      BARBERS        │
├─────────────────────┤
│ PK id               │
│ FK profile_id       │
│ bio                 │
│ is_active           │
│ created_at          │
└───────┬─────────────┘
        │ 1
        ├───────────────────┐
        │                   │
        ▼ *                 ▼ *
┌─────────────────┐   ┌─────────────────────┐
│  AVAILABILITY   │   │    APPOINTMENTS     │
├─────────────────┤   ├─────────────────────┤
│ PK id           │   │ PK id               │
│ FK barber_id    │   │ FK customer_id      │
│ day_of_week     │   │ FK barber_id        │
│ start_time      │   │ FK service_id       │
│ end_time        │   │ appointment_date    │
│ created_at      │   │ start_time          │
└─────────────────┘   │ end_time            │
                      │ status              │
                      │ created_at          │
                      └──────────┬──────────┘
                                 │
                     ┌───────────┴───────────┐
                     │                       │
                     ▼                       ▼
              PROFILES (customer)       SERVICES
                                      ┌─────────────────┐
                                      │ PK id           │
                                      │ name            │
                                      │ description     │
                                      │ price           │
                                      │ duration_minutes│
                                      │ is_active       │
                                      │ created_at      │
                                      └─────────────────┘
```

---

## 11. Appointment and Double-Booking Rules

Preventing double bookings is one of the most important database/business rules.

The system must check that an active appointment does not overlap with another active appointment for the same barber.

Conceptually:

```text
New appointment:
        |
        ▼
Check barber availability
        |
        ▼
Check existing appointments
        |
        ├── Conflict → Reject booking
        |
        └── No conflict → Create booking
```

The final implementation should enforce this as reliably as possible using both application-level validation and appropriate database constraints/transaction logic.

---

## 12. Data Integrity

The database should use:

- Primary keys to uniquely identify records.
- Foreign keys to maintain relationships.
- NOT NULL constraints where values are required.
- CHECK constraints for valid values where appropriate.
- Appropriate unique constraints.
- Appropriate default values.
- Referential integrity rules.
- Transactions for operations that require multiple related database changes.

---

## 13. Security and Row Level Security

Because the application will use Supabase, Row Level Security (RLS) should be used to restrict database access.

Initial access principles:

### Customer
A customer should be able to:
- View and update permitted profile information.
- View their own appointments.
- Create their own appointments.
- Cancel their own eligible appointments.

### Barber
A barber should be able to:
- View their own availability.
- Manage their permitted availability.
- View appointments assigned to them.
- Perform authorised appointment actions.

### Administrator
An administrator should have broader permissions required to manage the system.

The exact RLS policies will be designed and tested during implementation.

---

## 14. Normalisation Considerations

The initial design separates users, barbers, services, availability and appointments rather than storing all information in a single table.

This reduces unnecessary duplication and makes relationships explicit.

For example, a service name and price should not be copied into every customer profile. The appointment references the relevant service through `service_id`.

The final design will be reviewed for appropriate normalisation before implementation.

---

## 15. Future Database Extensions

The following entities may be added later if the requirements justify them:

- `availability_exceptions`
- `reviews`
- `payments`
- `notifications`
- `barber_services`
- `shop_locations`
- `promotions`
- `audit_logs`

These are deliberately not included in the initial database until there is a confirmed requirement for them.

---

## 16. Database Design Decisions to Review Before Implementation

Before creating the Supabase schema, the following decisions must be finalised:

1. Whether a barber can offer only selected services or all services.
2. Whether the system represents one barber shop or multiple shops.
3. How recurring availability and one-off exceptions will work.
4. Exact appointment status values.
5. Cancellation rules.
6. Whether customers can choose a specific barber or allow automatic assignment.
7. Exact strategy for preventing overlapping appointments.
8. Supabase Auth and `profiles` relationship.
9. Exact Row Level Security policies.
10. Whether payments are included in the first release.

These decisions will be resolved before the database is implemented.

---

## 17. Next Step

After reviewing this design, the next development document will define the **system architecture**, including:

- Frontend structure
- Business/application logic
- Supabase integration
- Data-access approach
- Authentication flow
- Role-based access
- Component structure
- Project folder structure
- Data flow between the UI and database
