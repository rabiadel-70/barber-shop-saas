
import { useState } from 'react'
import './App.css'

type Service = {
  id: number
  name: string
  description: string
  duration: number
  price: number
  icon: string
}

type Barber = {
  id: number
  name: string
  description: string
}

const services: Service[] = [
  {
    id: 1,
    name: 'Classic Haircut',
    description: 'A clean, timeless cut tailored to your style.',
    duration: 30,
    price: 15,
    icon: '✂',
  },
  {
    id: 2,
    name: 'Beard Trim',
    description: 'Keep your beard sharp, neat and well-shaped.',
    duration: 20,
    price: 10,
    icon: '▤',
  },
  {
    id: 3,
    name: 'Haircut & Beard',
    description: 'A complete grooming session in one appointment.',
    duration: 45,
    price: 25,
    icon: '✦',
  },
]

const barbers: Barber[] = [
  { id: 1, name: 'Alex', description: 'Classic cuts and styling' },
  { id: 2, name: 'Omar', description: 'Fades and beard grooming' },
  { id: 3, name: 'James', description: 'Modern cuts and restyling' },
]

const timeSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

const availableDates = Array.from({ length: 7 }, (_, index) => {
  const date = new Date()
  date.setDate(date.getDate() + index + 1)

  const value = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')

  return {
    value,
    weekday: date.toLocaleDateString('en-GB', { weekday: 'short' }),
    day: date.getDate(),
    month: date.toLocaleDateString('en-GB', { month: 'short' }),
  }
})

function App() {
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [step, setStep] = useState(1)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)

  function goToStep(nextStep: number) {
    setStep(nextStep)
    setBookingConfirmed(false)
    document.getElementById('booking-flow')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  function startNewBooking() {
    setSelectedService(null)
    setSelectedBarber(null)
    setSelectedDate('')
    setSelectedTime('')
    setBookingConfirmed(false)
    setStep(1)
    document.getElementById('services')?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="logo" href="#">
          <span className="logo-icon">B</span>
          BarberBook
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <button className="login-button" type="button" disabled>
          Login coming soon
        </button>
      </header>

      <main>
        <section className="hero">
          <p className="eyebrow">YOUR STYLE, YOUR SCHEDULE</p>
          <h1>
            A better way to
            <br />
            book your next cut.
          </h1>
          <p className="hero-description">
            Find your time. Choose your barber. Book your next appointment
            with ease.
          </p>
          <a className="primary-button" href="#services">
            Explore services
          </a>
        </section>

        <section className="services" id="services">
          <p className="eyebrow">WHAT WE OFFER</p>
          <h2>Services designed around you</h2>
          <p className="section-description">
            Choose a service to start planning your appointment.
          </p>

          <div className="service-grid">
            {services.map((service) => {
              const isSelected = selectedService?.id === service.id

              return (
                <article
                  className={
                    isSelected
                      ? 'service-card service-card--selected'
                      : 'service-card'
                  }
                  key={service.id}
                >
                  <span className="service-icon" aria-hidden="true">
                    {service.icon}
                  </span>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <span className="service-detail">
                    {service.duration} minutes · £{service.price}
                  </span>
                  <button
                    className="service-select-button"
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedService(service)}
                  >
                    {isSelected ? 'Selected ✓' : 'Select service'}
                  </button>
                </article>
              )
            })}
          </div>

          {selectedService && (
            <div className="booking-selection" role="status">
              <div>
                <p className="eyebrow">YOUR SELECTION</p>
                <h3>{selectedService.name}</h3>
                <p>
                  {selectedService.duration} minutes · £{selectedService.price}
                </p>
              </div>
              <button
                className="continue-button"
                type="button"
                onClick={() => goToStep(2)}
              >
                Continue to choose a barber →
              </button>
            </div>
          )}
        </section>

        {step >= 2 && (
          <section className="booking-flow" id="booking-flow">
            <p className="eyebrow">BOOK YOUR APPOINTMENT</p>
            <h2>
              {step === 2 && 'Choose your barber'}
              {step === 3 && 'Choose your date and time'}
              {step === 4 && 'Review your booking'}
            </h2>
            <p className="step-indicator">Step {step - 1} of 3</p>

            {step === 2 && (
              <>
                <div className="option-grid">
                  {barbers.map((barber) => {
                    const isSelected = selectedBarber?.id === barber.id

                    return (
                      <button
                        className={
                          isSelected
                            ? 'option-card option-card--selected'
                            : 'option-card'
                        }
                        type="button"
                        key={barber.id}
                        aria-pressed={isSelected}
                        onClick={() => setSelectedBarber(barber)}
                      >
                        <span className="barber-avatar" aria-hidden="true">
                          {barber.name.charAt(0)}
                        </span>
                        <strong>{barber.name}</strong>
                        <span>{barber.description}</span>
                        {isSelected && <span>Selected ✓</span>}
                      </button>
                    )
                  })}
                </div>

                <div className="booking-actions">
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => goToStep(1)}
                  >
                    Back to services
                  </button>
                  <button
                    className="continue-button"
                    type="button"
                    disabled={!selectedBarber}
                    onClick={() => goToStep(3)}
                  >
                    Continue to date and time →
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h3>Choose a date</h3>
                <div className="date-grid">
                  {availableDates.map((date) => (
                    <button
                      className={
                        selectedDate === date.value
                          ? 'date-option date-option--selected'
                          : 'date-option'
                      }
                      type="button"
                      key={date.value}
                      aria-pressed={selectedDate === date.value}
                      onClick={() => {
                        setSelectedDate(date.value)
                        setSelectedTime('')
                      }}
                    >
                      <span>{date.weekday}</span>
                      <strong>{date.day}</strong>
                      <span>{date.month}</span>
                    </button>
                  ))}
                </div>

                <h3>Choose a time</h3>
                <div className="time-grid">
                  {timeSlots.map((time) => (
                    <button
                      className={
                        selectedTime === time
                          ? 'time-option time-option--selected'
                          : 'time-option'
                      }
                      type="button"
                      key={time}
                      aria-pressed={selectedTime === time}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>

                <div className="booking-actions">
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => goToStep(2)}
                  >
                    Back to barber
                  </button>
                  <button
                    className="continue-button"
                    type="button"
                    disabled={!selectedDate || !selectedTime}
                    onClick={() => goToStep(4)}
                  >
                    Review booking →
                  </button>
                </div>
              </>
            )}

            {step === 4 && !bookingConfirmed && selectedService && selectedBarber && (
              <div className="review-card">
                <div className="review-row">
                  <span>Service</span>
                  <strong>{selectedService.name}</strong>
                </div>
                <div className="review-row">
                  <span>Barber</span>
                  <strong>{selectedBarber.name}</strong>
                </div>
                <div className="review-row">
                  <span>Date</span>
                  <strong>{selectedDate}</strong>
                </div>
                <div className="review-row">
                  <span>Time</span>
                  <strong>{selectedTime}</strong>
                </div>
                <div className="review-row">
                  <span>Duration</span>
                  <strong>{selectedService.duration} minutes</strong>
                </div>
                <div className="review-row review-total">
                  <span>Total</span>
                  <strong>£{selectedService.price}</strong>
                </div>

                <div className="booking-actions">
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => goToStep(3)}
                  >
                    Back to date and time
                  </button>
                  <button
                    className="continue-button"
                    type="button"
                    onClick={() => setBookingConfirmed(true)}
                  >
                    Confirm demo booking
                  </button>
                </div>
              </div>
            )}

            {bookingConfirmed && (
              <div className="confirmation-card" role="status">
                <h3>Demo booking confirmed ✓</h3>
                <p>
                  {selectedService?.name} with {selectedBarber?.name}
                </p>
                <p>
                  {selectedDate} at {selectedTime}
                </p>
                <p>
                  This is a frontend demonstration. Your booking has not been
                  saved to a database.
                </p>
                <button
                  className="continue-button"
                  type="button"
                  onClick={startNewBooking}
                >
                  Start another booking
                </button>
              </div>
            )}
          </section>
        )}

        <section className="about" id="about">
          <h2>Good grooming starts with a good booking.</h2>
          <p>
            We're building a simpler way to discover services and organise
            your next barber appointment.
          </p>
        </section>
      </main>

      <footer id="contact">
        <span>BarberBook</span>
        <span>Appointment booking made simpler.</span>
      </footer>
    </div>
  )
}

export default App
