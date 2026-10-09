# Barber Shop SaaS — Use Cases

## 1. Purpose

This document defines the main use cases for the Barber Shop SaaS platform. The use cases describe how customers, barbers and administrators interact with the system and will be used to guide the system design, implementation and testing.

---

## 2. Actors

| Actor | Description |
|---|---|
| Customer | A customer who uses the platform to browse services and make/manage appointments. |
| Barber | A barber who manages availability and views/manages appointments. |
| Administrator | A user responsible for managing the barber shop, users, services and appointments. |

---

## 3. UC-01 — Register and Login

**Primary Actor:** Customer / Barber / Administrator

**Goal:** Allow an authorised user to securely access the platform.

### Preconditions
- The user has access to the application.
- A user account exists for login.

### Main Flow
1. User opens the login page.
2. User enters their credentials.
3. System validates the credentials.
4. System authenticates the user.
5. System identifies the user's role.
6. System redirects the user to the appropriate dashboard.

### Alternative Flow
- If the credentials are invalid, the system displays an appropriate error message.
- If required fields are missing, the system asks the user to complete them.

### Postconditions
- The authenticated user receives access only to functionality permitted by their role.

---

## 4. UC-02 — Book an Appointment

**Primary Actor:** Customer

**Goal:** Allow a customer to reserve an available appointment with a barber.

### Preconditions
- Customer has an account.
- Customer is logged in.
- At least one barber and service are available.

### Main Flow
1. Customer opens the booking page.
2. Customer selects a service.
3. Customer selects a barber.
4. System displays available dates and times.
5. Customer selects a date and time.
6. System verifies that the selected slot is still available.
7. Customer confirms the booking.
8. System creates the appointment.
9. System displays a booking confirmation.

### Alternative Flow
- If another customer has already taken the selected slot, the system rejects the booking and asks the customer to select another available time.
- If the selected barber is unavailable, the customer must choose another available barber or time.

### Postconditions
- A valid appointment is stored in the database.
- The selected time cannot be used for another conflicting appointment.

---

## 5. UC-03 — Manage Barber Availability

**Primary Actor:** Barber

**Goal:** Allow a barber to define when they are available for appointments.

### Preconditions
- Barber is authenticated.
- Barber has permission to manage their availability.

### Main Flow
1. Barber opens the availability section.
2. Barber views current working hours.
3. Barber adds or modifies available working periods.
4. System validates the submitted availability.
5. System saves the updated availability.
6. System uses the updated availability when generating customer booking slots.

### Alternative Flow
- If the submitted availability is invalid or conflicts with an existing rule, the system displays an error and does not save the invalid change.

### Postconditions
- The barber's availability is updated.
- Customer booking slots reflect the updated availability.

---

## 6. UC-04 — Cancel an Appointment

**Primary Actor:** Customer

**Goal:** Allow a customer to cancel an existing appointment.

### Preconditions
- Customer is authenticated.
- Customer has an existing appointment.
- The appointment is eligible for cancellation under the system's cancellation rules.

### Main Flow
1. Customer opens their appointments.
2. Customer selects an upcoming appointment.
3. Customer selects the cancellation option.
4. System displays cancellation information.
5. Customer confirms cancellation.
6. System updates the appointment status.
7. The relevant time slot becomes available according to the booking rules.

### Alternative Flow
- If cancellation is not permitted, the system informs the customer and does not cancel the appointment.

### Postconditions
- The appointment is marked as cancelled.
- The slot can become available for future booking where appropriate.

---

## 7. UC-05 — Manage Services

**Primary Actor:** Administrator

**Goal:** Allow the administrator to maintain the services offered by the barber shop.

### Preconditions
- Administrator is authenticated.
- Administrator has permission to manage services.

### Main Flow
1. Administrator opens the services management section.
2. Administrator views existing services.
3. Administrator adds, edits or disables a service.
4. System validates the information.
5. System saves the change.
6. The updated service information becomes available to customers where appropriate.

### Alternative Flow
- If service information is invalid, the system displays an error and does not save the invalid data.

### Postconditions
- The service catalogue reflects the administrator's changes.

---

## 8. UC-06 — Manage Users

**Primary Actor:** Administrator

**Goal:** Allow the administrator to manage users and their permitted roles.

### Preconditions
- Administrator is authenticated.
- Administrator has appropriate permissions.

### Main Flow
1. Administrator opens the user management section.
2. Administrator views registered users.
3. Administrator selects a user.
4. Administrator performs an authorised management action.
5. System validates the action.
6. System saves the change.
7. System displays the updated user information.

### Alternative Flow
- If the administrator does not have permission for the requested action, the system rejects the action.
- If the submitted information is invalid, the system displays an error.

### Postconditions
- The user's permitted information or status is updated according to the administrator's action.

---

## 9. UC-07 — Manage Appointments

**Primary Actor:** Administrator / Barber

**Goal:** Allow authorised staff to view and manage appointments.

### Preconditions
- User is authenticated.
- User has the appropriate role and permissions.

### Main Flow
1. User opens the appointment management section.
2. System displays appointments relevant to the user's permissions.
3. User selects an appointment.
4. User performs an authorised action.
5. System validates the action.
6. System updates the appointment.
7. System displays the updated appointment status.

### Alternative Flow
- If the requested action would create a scheduling conflict, the system rejects the action and displays an appropriate message.
- If the user does not have permission, the system rejects the action.

### Postconditions
- The appointment reflects the authorised change.
- The system maintains appointment and availability consistency.

---

## 10. Use Case Relationships

The major system flow can be summarised as:

```text
Customer
   |
   +--> Register / Login
   |
   +--> View Services
   |
   +--> View Availability
   |
   +--> Book Appointment
   |
   +--> View Appointments
   |
   +--> Cancel Appointment


Barber
   |
   +--> Login
   |
   +--> Manage Availability
   |
   +--> View Appointments
   |
   +--> Manage Appointments


Administrator
   |
   +--> Login
   |
   +--> Manage Users
   |
   +--> Manage Services
   |
   +--> Manage Appointments
```

---

## 11. Acceptance-Criteria Considerations

The use cases will later be converted into specific acceptance criteria and test cases.

For example, **UC-02 — Book an Appointment** should eventually demonstrate that:

- A customer can select a valid service.
- A customer can select an eligible barber.
- Only valid available slots are presented.
- A valid appointment can be created.
- The appointment is stored correctly.
- A conflicting appointment cannot be created.
- Appropriate errors are shown when booking fails.

These criteria will be used during implementation and testing.
