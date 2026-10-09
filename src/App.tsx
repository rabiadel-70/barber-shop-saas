
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <a className="logo" href="/">
          <span className="logo-icon">B</span>
          BarberBook
        </a>

        <nav className="nav-links">
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <button className="login-button" type="button">
          Log in
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

          <div className="service-grid">
            <article className="service-card">
              <span className="service-icon">✂</span>
              <h3>Classic Haircut</h3>
              <p>A clean, timeless cut tailored to your style.</p>
              <span className="service-detail">30 minutes · From £15</span>
            </article>

            <article className="service-card">
              <span className="service-icon">▤</span>
              <h3>Beard Trim</h3>
              <p>Keep your beard sharp, neat and well-shaped.</p>
              <span className="service-detail">20 minutes · From £10</span>
            </article>

            <article className="service-card">
              <span className="service-icon">✦</span>
              <h3>Haircut & Beard</h3>
              <p>A complete grooming session in one appointment.</p>
              <span className="service-detail">45 minutes · From £25</span>
            </article>
          </div>
        </section>

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
