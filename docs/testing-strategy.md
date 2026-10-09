# Testing Strategy

## 1. Purpose

This document describes how the Barber Shop SaaS application will be tested during development.

## 2. Testing Levels

### Unit Testing
Test individual functions and components, including input validation, booking rules and date/time calculations.

### Integration Testing
Test interactions between application services and the database, including authentication and appointment creation.

### Component Testing
Check that interface components render correctly, accept valid input and display validation errors.

### End-to-End Testing
Test complete workflows, such as selecting a service, choosing an appointment slot and confirming a booking.

## 3. Key Test Scenarios

- Valid and invalid registration and login.
- Unauthenticated users attempting to access protected pages.
- Customers attempting to access another customer's appointments.
- Booking an available appointment slot.
- Rejecting an unavailable or conflicting appointment.
- Cancelling an appointment.
- Preventing invalid dates, times and missing fields.
- Enforcing role-based permissions.
- Handling database errors without exposing sensitive information.

## 4. Security Testing

- Verify that access controls are enforced on the server or database, not only in the interface.
- Test Supabase Row Level Security policies when the database is configured.
- Ensure secrets and credentials are not committed to Git.
- Check that users cannot modify records they are not authorised to manage.

## 5. Tools

The testing tools will be selected as implementation progresses. Potential tools include Vitest for unit tests and Playwright for end-to-end tests.

## 6. Development Workflow

1. Implement a small feature.
2. Run relevant tests.
3. Review and fix failures.
4. Run linting and build checks.
5. Commit the verified changes with a meaningful Git message.

## 7. Current Status

This is the initial testing plan. Tests will be added as application functionality is implemented.