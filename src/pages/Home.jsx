import { useEffect, useState, useCallback, Suspense, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import { coupleData, getCountdown, events } from '../data/weddingData'
import FloatingElements from '../components/3d/FloatingElements'
import Canvas3D from '../components/3d/Canvas3D'
import SacredFire from '../components/3d/SacredFire'
import { DiyaArrangement } from '../components/3d/Diya'

// Weather code to description and icon mapping
const weatherDescriptions = {
  0: { text: 'Clear sky', icon: '☀️' },
  1: { text: 'Mostly clear', icon: '🌤️' },
  2: { text: 'Partly cloudy', icon: '⛅' },
  3: { text: 'Overcast', icon: '☁️' },
  45: { text: 'Foggy', icon: '🌫️' },
  48: { text: 'Icy fog', icon: '🌫️' },
  51: { text: 'Light drizzle', icon: '🌦️' },
  53: { text: 'Drizzle', icon: '🌦️' },
  55: { text: 'Heavy drizzle', icon: '🌧️' },
  61: { text: 'Light rain', icon: '🌧️' },
  63: { text: 'Rain', icon: '🌧️' },
  65: { text: 'Heavy rain', icon: '🌧️' },
  80: { text: 'Light showers', icon: '🌦️' },
  81: { text: 'Showers', icon: '🌧️' },
  82: { text: 'Heavy showers', icon: '🌧️' },
  95: { text: 'Thunderstorm', icon: '⛈️' },
}

function getWeatherInfo(code) {
  return weatherDescriptions[code] || { text: 'Clear', icon: '☀️' }
}

// Weather Component - fetches hourly data from Open-Meteo API
function WeatherSection() {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const lat = 27.627449722305748
    const lon = 76.60525920859347
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max,sunrise,sunset&hourly=temperature_2m,weathercode,relativehumidity_2m,windspeed_10m,precipitation_probability&timezone=Asia/Kolkata&start_date=2026-02-07&end_date=2026-02-08`

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.daily && data.hourly) {
          const days = data.daily.time.map((date, i) => {
            // Get hourly data for this day (every 3 hours for key times)
            const dayStart = i * 24
            const keyHours = [0, 3, 6, 9, 12, 15, 18, 21] // midnight to 9PM
            const hourlyData = keyHours.map(h => ({
              hour: h,
              label: h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`,
              temp: Math.round(data.hourly.temperature_2m[dayStart + h]),
              weatherCode: data.hourly.weathercode[dayStart + h],
              humidity: data.hourly.relativehumidity_2m[dayStart + h],
              windSpeed: Math.round(data.hourly.windspeed_10m[dayStart + h]),
              precipChance: data.hourly.precipitation_probability[dayStart + h],
            }))

            return {
              date,
              dateLabel: i === 0 ? 'Feb 7 – Day One' : 'Feb 8 – Day Two',
              maxTemp: Math.round(data.daily.temperature_2m_max[i]),
              minTemp: Math.round(data.daily.temperature_2m_min[i]),
              weatherCode: data.daily.weathercode[i],
              precipChance: data.daily.precipitation_probability_max?.[i] ?? null,
              sunrise: data.daily.sunrise?.[i]?.split('T')[1] || '',
              sunset: data.daily.sunset?.[i]?.split('T')[1] || '',
              hourly: hourlyData,
            }
          })
          setWeather(days)
        }
      })
      .catch(() => setError(true))
  }, [])

  if (error || !weather) return null

  return (
    <section id="weather" className="weather-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>Weather in Alwar <ShareLink sectionId="weather" /></h2>
          <div className="ornament" />
        </motion.div>

        <div className="weather-days">
          {weather.map((day, i) => {
            const dayInfo = getWeatherInfo(day.weatherCode)
            return (
              <motion.div
                key={day.date}
                className="weather-day-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                {/* Day Summary */}
                <div className="weather-day-summary">
                  <span className="weather-day-label">{day.dateLabel}</span>
                  <div className="weather-summary-row">
                    <span className="weather-icon-lg">{dayInfo.icon}</span>
                    <div className="weather-summary-info">
                      <div className="weather-temps">
                        <span className="weather-high">{day.maxTemp}°</span>
                        <span className="weather-sep">/</span>
                        <span className="weather-low">{day.minTemp}°C</span>
                      </div>
                      <span className="weather-desc">{dayInfo.text}</span>
                    </div>
                  </div>
                  <div className="weather-meta">
                    {day.precipChance !== null && <span>💧 Rain: {day.precipChance}%</span>}
                    <span>🌅 {day.sunrise}</span>
                    <span>🌇 {day.sunset}</span>
                  </div>
                </div>

                {/* Hourly Breakdown */}
                <div className="weather-hourly">
                  {day.hourly.map(h => {
                    const hInfo = getWeatherInfo(h.weatherCode)
                    return (
                      <div key={h.hour} className="weather-hour">
                        <span className="hour-label">{h.label}</span>
                        <span className="hour-icon">{hInfo.icon}</span>
                        <span className="hour-temp">{h.temp}°</span>
                        <span className="hour-detail">💧{h.precipChance}%</span>
                        <span className="hour-detail">💨{h.windSpeed}</span>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Smooth scroll function for anchor navigation
const scrollToSection = (e, sectionId) => {
  e.preventDefault()
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
}

// Countdown Component
function Countdown() {
  const [countdown, setCountdown] = useState(getCountdown())

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const timeUnits = [
    { label: 'Days', value: countdown.days },
    { label: 'Hours', value: countdown.hours },
    { label: 'Minutes', value: countdown.minutes },
    { label: 'Seconds', value: countdown.seconds }
  ]

  return (
    <div className="countdown">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          className="countdown-unit"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + index * 0.1 }}
        >
          <span className="countdown-value">{String(unit.value).padStart(2, '0')}</span>
          <span className="countdown-label">{unit.label}</span>
        </motion.div>
      ))}
    </div>
  )
}

// 3D Marigold for Events section
function Marigold3D({ position = [0, 0, 0], scale = 1 }) {
  const groupRef = useRef()
  const petalCount = 20

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <Float speed={1.5} floatIntensity={0.3}>
      <group ref={groupRef} position={position} scale={scale}>
        <mesh>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#FF6600" roughness={0.7} />
        </mesh>
        {Array.from({ length: petalCount }, (_, i) => {
          const angle = (i / petalCount) * Math.PI * 2
          const layer = Math.floor(i / 10)
          const radius = 0.35 + layer * 0.15
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                layer * 0.08,
                Math.sin(angle) * radius
              ]}
              rotation={[0, angle, Math.PI / 5]}
            >
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#FF9933' : '#FFCC00'}
                roughness={0.5}
              />
            </mesh>
          )
        })}
      </group>
    </Float>
  )
}

// 3D Scene for Events with Diyas in Rangoli Pattern
function EventsScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#FFF8DC" />
      <pointLight position={[-5, -5, 5]} intensity={0.4} color="#FF9933" />
      <pointLight position={[0, 3, 2]} intensity={0.5} color="#FF8C00" />

      {/* Marigolds for color variety */}
      <Marigold3D position={[-3, 1.5, -1]} scale={0.8} />
      <Marigold3D position={[3, 1.2, -0.5]} scale={0.7} />

      {/* Diya Arrangement in Rangoli Pattern - symbolizes light and prosperity */}
      <Suspense fallback={null}>
        <group position={[0, -0.5, 0]} scale={0.6}>
          <DiyaArrangement
            count={8}
            radius={2.5}
            pattern="rangoli"
            centerDiya={true}
            scale={1}
          />
        </group>
      </Suspense>

      {/* Golden sparkles */}
      <Sparkles count={100} scale={10} size={2} speed={0.3} color="#FFD700" opacity={0.5} />
      <Sparkles count={60} scale={8} size={1.5} speed={0.2} color="#FF9933" opacity={0.4} />
    </>
  )
}

// Event Card Component
function EventCard({ event, index }) {
  return (
    <motion.div
      className="event-card"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      style={{ '--event-color': event.color }}
    >
      {/* Subtle background pattern */}
      <div className="event-card-pattern" style={{ color: event.color }}>
        {getEventPattern(event.id)}
      </div>

      <div className="event-icon">{event.icon}</div>

      <div className="event-header">
        <h3 className="event-name">{event.name}</h3>
        <div className="event-date-badge" style={{ background: event.gradient }}>
          {event.dateDisplay}
        </div>
      </div>

      <div className="event-details">
        <div className="event-detail">
          <span className="detail-icon">🕐</span>
          <span className="detail-text">{event.time}</span>
        </div>

        <div className="event-detail">
          <span className="detail-icon">📍</span>
          <span className="detail-text">{event.venue}</span>
        </div>

        <div className="event-detail dress-code">
          <span className="detail-icon">👗</span>
          <div className="detail-text">
            <strong>Dress Code:</strong> {event.dressCode}
            {event.dressCodeNote && (
              <span className="dress-note">({event.dressCodeNote})</span>
            )}
          </div>
        </div>

        <div className="event-detail">
          <span className="detail-icon">🍽️</span>
          <span className="detail-text">Followed by {event.followedBy}</span>
        </div>
      </div>

      <p className="event-description">{event.description}</p>

      <div className="event-accent" style={{ background: event.gradient }} />
    </motion.div>
  )
}

// Decorative Paisley SVG
function PaisleyDecor({ className = '' }) {
  return (
    <svg
      className={`paisley-decor ${className}`}
      viewBox="0 0 100 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 10C30 10 15 30 15 55C15 80 30 100 50 130C70 100 85 80 85 55C85 30 70 10 50 10Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="1" fill="none" />
      <path
        d="M50 35C45 45 45 55 50 65C55 55 55 45 50 35Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  )
}

// Mehendi Pattern - Paisley and henna designs
function MehendiPattern() {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.5">
      <path d="M100 30 Q130 50 125 90 Q120 120 100 130 Q80 120 75 90 Q70 50 100 30" strokeWidth="0.75"/>
      <path d="M100 45 Q118 58 115 85 Q112 105 100 112 Q88 105 85 85 Q82 58 100 45"/>
      <path d="M100 60 Q108 68 106 82 Q104 92 100 96 Q96 92 94 82 Q92 68 100 60"/>
      <circle cx="100" cy="75" r="3"/>
      <ellipse cx="100" cy="165" rx="8" ry="12"/>
      <ellipse cx="88" cy="162" rx="6" ry="10" transform="rotate(-20 88 162)"/>
      <ellipse cx="112" cy="162" rx="6" ry="10" transform="rotate(20 112 162)"/>
      <circle cx="100" cy="170" r="4"/>
      <path d="M30 100 Q45 85 50 100 Q45 115 30 100"/>
      <circle cx="40" cy="100" r="2"/>
      <path d="M170 100 Q155 85 150 100 Q155 115 170 100"/>
      <circle cx="160" cy="100" r="2"/>
      <circle cx="25" cy="25" r="15"/>
      <circle cx="25" cy="25" r="10"/>
      <circle cx="25" cy="25" r="5"/>
      <circle cx="175" cy="25" r="15"/>
      <circle cx="175" cy="25" r="10"/>
      <circle cx="175" cy="25" r="5"/>
      <circle cx="25" cy="175" r="15"/>
      <circle cx="25" cy="175" r="10"/>
      <circle cx="25" cy="175" r="5"/>
      <circle cx="175" cy="175" r="15"/>
      <circle cx="175" cy="175" r="10"/>
      <circle cx="175" cy="175" r="5"/>
    </svg>
  )
}

// Sangeet Pattern - Dhol, music notes, dancing
function SangeetPattern() {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor">
      <g strokeWidth="1.5">
        <ellipse cx="100" cy="100" rx="25" ry="15"/>
        <ellipse cx="100" cy="130" rx="25" ry="15"/>
        <line x1="75" y1="100" x2="75" y2="130"/>
        <line x1="125" y1="100" x2="125" y2="130"/>
        <ellipse cx="100" cy="108" rx="25" ry="12"/>
        <ellipse cx="100" cy="122" rx="25" ry="12"/>
        <line x1="130" y1="95" x2="145" y2="80" strokeLinecap="round"/>
        <line x1="70" y1="95" x2="55" y2="80" strokeLinecap="round"/>
        <circle cx="147" cy="78" r="3" fill="currentColor"/>
        <circle cx="53" cy="78" r="3" fill="currentColor"/>
      </g>
      <g strokeWidth="1.2">
        <circle cx="35" cy="45" r="4" fill="currentColor"/>
        <line x1="39" y1="45" x2="39" y2="25"/>
        <path d="M39 25 Q45 28 39 32"/>
        <circle cx="165" cy="40" r="4" fill="currentColor"/>
        <line x1="169" y1="40" x2="169" y2="20"/>
        <path d="M169 20 Q175 23 169 27"/>
        <circle cx="30" cy="160" r="3.5" fill="currentColor"/>
        <circle cx="45" cy="165" r="3.5" fill="currentColor"/>
        <line x1="33.5" y1="160" x2="33.5" y2="140"/>
        <line x1="48.5" y1="165" x2="48.5" y2="140"/>
        <line x1="33.5" y1="140" x2="48.5" y2="140"/>
        <circle cx="170" cy="155" r="4" fill="currentColor"/>
        <line x1="174" y1="155" x2="174" y2="135"/>
        <path d="M174 135 Q180 138 174 142"/>
      </g>
      <g strokeWidth="2" strokeLinecap="round">
        <line x1="85" y1="25" x2="115" y2="55"/>
        <line x1="115" y1="25" x2="85" y2="55"/>
        <circle cx="85" cy="25" r="3" fill="currentColor"/>
        <circle cx="115" cy="25" r="3" fill="currentColor"/>
        <circle cx="85" cy="55" r="3" fill="currentColor"/>
        <circle cx="115" cy="55" r="3" fill="currentColor"/>
      </g>
      <g strokeWidth="1.5" strokeLinecap="round">
        <circle cx="100" cy="168" r="5"/>
        <line x1="100" y1="173" x2="100" y2="188"/>
        <path d="M100 178 Q90 170 82 175"/>
        <path d="M100 178 Q110 170 118 175"/>
        <line x1="100" y1="188" x2="92" y2="198"/>
        <line x1="100" y1="188" x2="108" y2="196"/>
      </g>
    </svg>
  )
}

// Haldi Pattern - Kalash, turmeric, marigolds
function HaldiPattern() {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <g>
        <ellipse cx="100" cy="145" rx="25" ry="8"/>
        <path d="M75 145 Q70 120 80 100 Q90 85 100 82 Q110 85 120 100 Q130 120 125 145"/>
        <path d="M88 82 L88 72 Q88 68 92 68 L108 68 Q112 68 112 72 L112 82"/>
        <ellipse cx="100" cy="62" rx="12" ry="10"/>
        <path d="M88 60 Q75 50 70 35 Q72 50 88 62"/>
        <path d="M100 52 Q100 38 100 25 Q102 38 100 52"/>
        <path d="M112 60 Q125 50 130 35 Q128 50 112 62"/>
        <ellipse cx="100" cy="95" rx="18" ry="5"/>
        <ellipse cx="100" cy="120" rx="22" ry="6"/>
      </g>
      <g transform="translate(25, 25)">
        <circle cx="0" cy="0" r="4"/>
        <path d="M0 -4 Q2 -12 0 -16 Q-2 -12 0 -4"/>
        <path d="M4 0 Q12 2 16 0 Q12 -2 4 0"/>
        <path d="M0 4 Q2 12 0 16 Q-2 12 0 4"/>
        <path d="M-4 0 Q-12 2 -16 0 Q-12 -2 -4 0"/>
      </g>
      <g transform="translate(175, 25)">
        <circle cx="0" cy="0" r="4"/>
        <path d="M0 -4 Q2 -12 0 -16 Q-2 -12 0 -4"/>
        <path d="M4 0 Q12 2 16 0 Q12 -2 4 0"/>
        <path d="M0 4 Q2 12 0 16 Q-2 12 0 4"/>
        <path d="M-4 0 Q-12 2 -16 0 Q-12 -2 -4 0"/>
      </g>
      <g transform="translate(30, 170)">
        <path d="M0 0 Q5 -3 12 -2 Q18 0 22 5 Q18 8 12 7 Q5 5 0 0"/>
        <path d="M5 -5 Q8 -15 5 -22 Q2 -15 5 -5"/>
        <line x1="5" y1="-5" x2="5" y2="-20"/>
      </g>
      <g transform="translate(170, 170) scale(-1, 1)">
        <path d="M0 0 Q5 -3 12 -2 Q18 0 22 5 Q18 8 12 7 Q5 5 0 0"/>
        <path d="M5 -5 Q8 -15 5 -22 Q2 -15 5 -5"/>
        <line x1="5" y1="-5" x2="5" y2="-20"/>
      </g>
      <circle cx="60" cy="75" r="2" fill="currentColor" stroke="none"/>
      <circle cx="140" cy="75" r="2" fill="currentColor" stroke="none"/>
      <circle cx="50" cy="110" r="2" fill="currentColor" stroke="none"/>
      <circle cx="150" cy="110" r="2" fill="currentColor" stroke="none"/>
    </svg>
  )
}

// Wedding Pattern - Sacred fire, mandap
function WeddingPattern() {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor">
      <path d="M60 160 L80 140 L120 140 L140 160 L60 160" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1"/>
      <path d="M70 160 L70 170 L130 170 L130 160" strokeWidth="1.5"/>
      <path d="M75 170 L75 175 L125 175 L125 170" strokeWidth="1"/>
      <line x1="85" y1="170" x2="85" y2="175" strokeWidth="1"/>
      <line x1="100" y1="170" x2="100" y2="175" strokeWidth="1"/>
      <line x1="115" y1="170" x2="115" y2="175" strokeWidth="1"/>
      <path d="M100 135 Q95 120 100 105 Q105 90 100 70 Q110 85 115 75 Q112 95 118 105 Q125 120 115 135 Q108 125 100 135" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15"/>
      <path d="M100 135 Q97 125 100 115 Q103 105 100 90 Q107 100 105 115 Q103 125 100 135" strokeWidth="1" fill="currentColor" fillOpacity="0.2"/>
      <path d="M85 138 Q82 130 85 120 Q88 110 85 100 Q90 108 88 120 Q86 130 85 138" strokeWidth="1" fill="currentColor" fillOpacity="0.12"/>
      <path d="M115 138 Q112 130 115 120 Q118 110 115 100 Q120 108 118 120 Q116 130 115 138" strokeWidth="1" fill="currentColor" fillOpacity="0.12"/>
      <circle cx="95" cy="85" r="1.5" fill="currentColor" fillOpacity="0.3"/>
      <circle cx="108" cy="78" r="1" fill="currentColor" fillOpacity="0.3"/>
      <circle cx="88" cy="95" r="1" fill="currentColor" fillOpacity="0.25"/>
      <circle cx="112" cy="88" r="1.5" fill="currentColor" fillOpacity="0.25"/>
      <line x1="30" y1="50" x2="30" y2="180" strokeWidth="2"/>
      <line x1="170" y1="50" x2="170" y2="180" strokeWidth="2"/>
      <path d="M30 50 Q100 20 170 50" strokeWidth="1.5"/>
      <path d="M35 55 Q100 30 165 55" strokeWidth="1"/>
      <ellipse cx="100" cy="35" rx="8" ry="5" strokeWidth="1" fill="currentColor" fillOpacity="0.1"/>
      <path d="M94 35 Q94 28 100 25 Q106 28 106 35" strokeWidth="1"/>
      <circle cx="100" cy="22" r="4" strokeWidth="1" fill="currentColor" fillOpacity="0.15"/>
      <path d="M96 30 Q90 25 88 18" strokeWidth="0.8"/>
      <path d="M104 30 Q110 25 112 18" strokeWidth="0.8"/>
      <path d="M15 15 Q25 10 30 20 Q28 30 18 28 Q12 25 15 15" strokeWidth="1" fill="currentColor" fillOpacity="0.08"/>
      <path d="M185 15 Q175 10 170 20 Q172 30 182 28 Q188 25 185 15" strokeWidth="1" fill="currentColor" fillOpacity="0.08"/>
      <path d="M15 185 Q25 190 30 180 Q28 170 18 172 Q12 175 15 185" strokeWidth="1" fill="currentColor" fillOpacity="0.08"/>
      <path d="M185 185 Q175 190 170 180 Q172 170 182 172 Q188 175 185 185" strokeWidth="1" fill="currentColor" fillOpacity="0.08"/>
    </svg>
  )
}

// Get pattern component based on event id
function getEventPattern(eventId) {
  switch (eventId) {
    case 'mehendi':
      return <MehendiPattern />
    case 'sangeet':
      return <SangeetPattern />
    case 'haldi':
      return <HaldiPattern />
    case 'wedding':
      return <WeddingPattern />
    default:
      return null
  }
}

function ShareLink({ sectionId }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(() => {
    const url = `${window.location.origin}/#${sectionId}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [sectionId])

  return (
    <button
      className="share-link-btn"
      onClick={handleCopy}
      title={`Copy link to ${sectionId}`}
      aria-label={`Copy shareable link for ${sectionId} section`}
    >
      {copied ? '✓' : '🔗'}
      {copied && <span className="share-tooltip">Copied!</span>}
    </button>
  )
}

function Home() {
  // Scroll to hash section on load (for shareable links like /#venue)
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 500)
    }
  }, [])

  return (
    <motion.div
      className="home-page"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      variants={containerVariants}
    >
      {/* Hero Section */}
      <section className="hero">
        {/* Sacred Fire Background - Agni is central to Hindu wedding ceremonies */}
        <div className="hero-sacred-fire">
          <Suspense fallback={null}>
            <SacredFire intensity={0.8} showKund={false} />
          </Suspense>
        </div>

        {/* Decorative Elements */}
        <PaisleyDecor className="hero-paisley left" />
        <PaisleyDecor className="hero-paisley right" />

        {/* Content */}
        <div className="hero-content">
          <motion.div className="hero-text" variants={itemVariants}>
            <motion.h1
              className="couple-names"
              variants={itemVariants}
            >
              <span className="name">{coupleData.groomName}</span>
              <span className="ampersand">&</span>
              <span className="name">{coupleData.brideName}</span>
            </motion.h1>

            <motion.p className="wedding-tagline" variants={itemVariants}>
              {coupleData.tagline}
            </motion.p>

            <motion.div className="ornament ornament-lg" variants={itemVariants} />

            <motion.div className="wedding-date-section" variants={itemVariants}>
              <h2 className="wedding-date">February 7-8, 2026</h2>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Countdown />
            </motion.div>

            <motion.div className="hero-cta" variants={itemVariants}>
              <a
                href="#events"
                className="btn btn-primary"
                onClick={(e) => scrollToSection(e, 'events')}
              >
                View Events
              </a>
              <Link to="/our-story" className="btn btn-secondary">
                Our Story
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <span>Scroll to explore</span>
          <motion.div
            className="scroll-arrow"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ↓
          </motion.div>
        </motion.div>
      </section>

      {/* Events Section */}
      <section id="events" className="events-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2>Functions & Ceremonies <ShareLink sectionId="events" /></h2>
            <div className="ornament ornament-lg" />
            <p className="events-intro">
              Two days of celebration, traditions, and joy as we begin our forever together.
            </p>
          </motion.div>

          {/* Day 1 */}
          <motion.div
            className="day-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="day-title">Day One</h3>
            <p className="day-date">Saturday, February 7th, 2026</p>
          </motion.div>

          <div className="events-grid">
            {events
              .filter(event => event.date === '2026-02-07')
              .map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
          </div>

          {/* Day 2 */}
          <motion.div
            className="day-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="day-title">Day Two</h3>
            <p className="day-date">Sunday, February 8th, 2026</p>
          </motion.div>

          <div className="events-grid">
            {events
              .filter(event => event.date === '2026-02-08')
              .map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
          </div>
        </div>
      </section>

      {/* Venue & How to Reach Section */}
      <section id="venue" className="venue-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Venue & How to Reach <ShareLink sectionId="venue" /></h2>
            <div className="ornament" />
          </motion.div>

          {/* Venue Card with Map */}
          <motion.div
            className="venue-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <div className="venue-info">
              <p className="venue-name-text">{coupleData.venue.name}</p>
              <p className="venue-full-address">
                8km Stone, Narnaul-Behror-Alwar Rd,<br />
                Opp. National Academy School, Alwar, Rajasthan 301001
              </p>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=27.627449722305748,76.60525920859347"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary directions-btn"
              >
                📍 Get Directions
              </a>
            </div>
            <div className="venue-map">
              <iframe
                src="https://maps.google.com/maps?q=27.627449722305748,76.60525920859347&z=15&output=embed"
                width="100%"
                height="250"
                style={{ border: 0, borderRadius: 'var(--radius-md)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Venue Map"
              />
            </div>
          </motion.div>

          {/* Travel Routes */}
          <div className="travel-routes">
            <motion.div
              className="travel-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <span className="travel-icon">✈️</span>
              <h4>From Delhi Airport (IGI)</h4>
              <p className="travel-distance">~160 km · 3 – 3.5 hrs by car</p>
              <p className="travel-tip">Pre-book a cab via MakeMyTrip or CabBazar. Ola/Uber available for pickup.</p>
            </motion.div>

            <motion.div
              className="travel-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <span className="travel-icon">✈️</span>
              <h4>From Jaipur Airport</h4>
              <p className="travel-distance">~150 km · 3 hrs by car</p>
              <p className="travel-tip">Hire a taxi from the airport or take an RSRTC bus to Alwar.</p>
            </motion.div>

            <motion.div
              className="travel-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <span className="travel-icon">🚂</span>
              <h4>By Train to Alwar Junction</h4>
              <p className="travel-distance">~10 km from station · 20 min by auto</p>
              <p className="travel-tip">Frequent trains from Delhi (~2.5 hrs). Shatabdi, Kota Janshatabdi, Double Decker available.</p>
            </motion.div>

            <motion.div
              className="travel-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <span className="travel-icon">🚗</span>
              <h4>By Road / Self Drive</h4>
              <p className="travel-distance">NH 48 via Gurgaon → Bhiwadi → Alwar</p>
              <p className="travel-tip">Ola/Uber have limited availability in Alwar. Pre-book cabs or arrange through the resort.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Weather Section */}
      <WeatherSection />

      <style>{`
        .home-page {
          overflow-x: hidden;
        }

        /* Share Link Button */
        .share-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.45em;
          opacity: 0.4;
          transition: opacity 0.2s ease;
          vertical-align: middle;
          position: relative;
          padding: 4px;
        }
        .share-link-btn:hover {
          opacity: 0.8;
        }
        .share-tooltip {
          position: absolute;
          top: -28px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--gold-dark);
          color: var(--cream);
          font-family: var(--font-body);
          font-size: 11px;
          padding: 3px 10px;
          border-radius: var(--radius-sm);
          white-space: nowrap;
          pointer-events: none;
          animation: tooltipFade 0.3s ease;
        }
        @keyframes tooltipFade {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* Hero Section */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: var(--space-2xl) var(--space-lg);
          background: linear-gradient(
            135deg,
            var(--cream) 0%,
            var(--cream-dark) 50%,
            var(--gold-light) 100%
          );
          overflow: hidden;
        }

        /* Sacred Fire Background */
        .hero-sacred-fire {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -40%);
          width: 600px;
          height: 600px;
          z-index: 1;
          opacity: 0.55;
          pointer-events: none;
          filter: blur(1px);
        }

        .hero-sacred-fire *,
        .hero-sacred-fire canvas {
          pointer-events: none !important;
        }

        .section-3d-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          opacity: 0.4;
          pointer-events: none;
        }

        .section-3d-bg *,
        .section-3d-bg canvas {
          pointer-events: none !important;
        }

        .hashtag-3d {
          opacity: 0.5;
        }

        .hero-paisley {
          position: absolute;
          width: 150px;
          height: auto;
          color: var(--gold);
          opacity: 0.15;
          z-index: 0;
        }

        .hero-paisley.left {
          left: 5%;
          top: 20%;
          transform: rotate(-15deg);
        }

        .hero-paisley.right {
          right: 5%;
          bottom: 20%;
          transform: rotate(15deg) scaleX(-1);
        }

        .hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          max-width: 800px;
        }

        .wedding-invite-text {
          font-family: var(--font-display);
          font-style: italic;
          font-size: 1.25rem;
          color: var(--warm-gray);
          margin-bottom: var(--space-md);
        }

        .couple-names {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-sm);
          margin-bottom: var(--space-md);
        }

        .couple-names .name {
          font-family: var(--font-display);
          font-size: clamp(3rem, 10vw, 6rem);
          font-weight: 400;
          color: var(--dark-brown);
          line-height: 1;
        }

        .couple-names .ampersand {
          font-family: var(--font-display);
          font-size: clamp(2rem, 6vw, 3.5rem);
          color: var(--gold);
          font-style: italic;
        }

        .wedding-tagline {
          font-family: var(--font-display);
          font-style: italic;
          font-size: 1.5rem;
          color: var(--gold-dark);
          margin-bottom: var(--space-lg);
        }

        .save-the-date {
          font-family: var(--font-body);
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.875rem;
          color: var(--warm-gray);
          margin-bottom: var(--space-sm);
        }

        .wedding-date {
          font-family: var(--font-display);
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          color: var(--dark-brown);
          margin-bottom: var(--space-sm);
        }

        .wedding-venue {
          font-family: var(--font-body);
          color: var(--warm-gray);
          line-height: 1.8;
        }

        /* Countdown */
        .countdown {
          display: flex;
          justify-content: center;
          gap: var(--space-lg);
          margin: var(--space-xl) 0;
        }

        .countdown-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 70px;
        }

        .countdown-value {
          font-family: var(--font-display);
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 500;
          color: var(--gold-dark);
          line-height: 1;
          background: linear-gradient(135deg, var(--gold-dark), var(--gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .countdown-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--warm-gray);
          margin-top: var(--space-xs);
        }

        /* Hero CTA */
        .hero-cta {
          display: flex;
          gap: var(--space-md);
          justify-content: center;
          flex-wrap: wrap;
        }

        /* Scroll Indicator */
        .scroll-indicator {
          position: absolute;
          bottom: var(--space-xl);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-sm);
          color: var(--warm-gray);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .scroll-arrow {
          font-size: 1.25rem;
          color: var(--gold);
        }

        /* Events Section */
        .events-section {
          padding: var(--space-2xl) 0;
          background: var(--cream);
          position: relative;
          overflow: hidden;
        }

        .events-section .container {
          position: relative;
          z-index: 1;
        }

        .events-3d-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 400px;
          opacity: 0.7;
          pointer-events: none;
          z-index: 0;
        }

        .events-intro {
          font-family: var(--font-display);
          font-size: 1.125rem;
          font-style: italic;
          color: var(--warm-gray);
          max-width: 600px;
          margin: var(--space-md) auto 0;
        }

        .day-header {
          text-align: center;
          margin: var(--space-2xl) 0 var(--space-xl);
        }

        .day-header:first-of-type {
          margin-top: var(--space-xl);
        }

        .day-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3rem);
          color: var(--gold-dark);
          margin-bottom: var(--space-sm);
        }

        .day-date {
          font-family: var(--font-body);
          font-size: 1.125rem;
          color: var(--warm-gray);
          margin: 0;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: var(--space-xl);
          max-width: 1000px;
          margin: 0 auto;
        }

        /* Event Card */
        .event-card {
          background: var(--ivory);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-soft);
          border: 1px solid rgba(212, 175, 55, 0.1);
          transition: all var(--transition-medium);
        }

        .event-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-medium);
        }

        .event-card-pattern {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.15;
          pointer-events: none;
          z-index: 0;
        }

        .event-card-pattern svg {
          width: 100%;
          height: 100%;
        }

        .event-card > *:not(.event-card-pattern):not(.event-accent) {
          position: relative;
          z-index: 1;
        }

        .event-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .event-icon {
          font-size: 3rem;
          margin-bottom: var(--space-md);
        }

        .event-header {
          margin-bottom: var(--space-lg);
        }

        .event-name {
          font-family: var(--font-display);
          font-size: 2rem;
          color: var(--dark-brown);
          margin: 0 0 var(--space-sm);
        }

        .event-date-badge {
          display: inline-block;
          color: white;
          padding: var(--space-xs) var(--space-md);
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          font-weight: 500;
        }

        .event-details {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          margin-bottom: var(--space-lg);
        }

        .event-detail {
          display: flex;
          align-items: flex-start;
          gap: var(--space-sm);
        }

        .detail-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .detail-text {
          color: var(--charcoal);
          font-size: 0.9375rem;
          line-height: 1.5;
        }

        .dress-code .detail-text {
          display: flex;
          flex-direction: column;
        }

        .dress-note {
          font-size: 0.8125rem;
          color: var(--warm-gray);
          font-style: italic;
          margin-top: 2px;
        }

        .event-description {
          color: var(--warm-gray);
          font-size: 0.9375rem;
          font-style: italic;
          margin: 0;
          padding-top: var(--space-md);
          border-top: 1px solid var(--light-gray);
        }

        /* Venue Section */
        .venue-section {
          padding: var(--space-2xl) 0;
          background: linear-gradient(
            135deg,
            var(--cream-dark) 0%,
            var(--gold-light) 100%
          );
          position: relative;
          overflow: hidden;
        }

        .venue-section .container {
          position: relative;
          z-index: 1;
        }

        .venue-card {
          max-width: 700px;
          margin: 0 auto var(--space-xl);
          background: var(--ivory);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
          box-shadow: var(--shadow-soft);
          text-align: center;
        }

        .venue-name-text {
          font-family: var(--font-display);
          font-size: 1.5rem;
          color: var(--dark-brown);
          margin: 0 0 var(--space-sm);
        }

        .venue-full-address {
          color: var(--warm-gray);
          font-size: 0.9375rem;
          line-height: 1.6;
          margin: 0 0 var(--space-md);
        }

        .venue-info {
          position: relative;
          z-index: 2;
        }

        .directions-btn {
          margin-bottom: var(--space-lg);
          display: inline-block;
          position: relative;
          z-index: 2;
        }

        .venue-map {
          position: relative;
          z-index: 1;
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        /* Travel Routes - 2x2 Grid */
        .travel-routes {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-lg);
          max-width: 900px;
          margin: 0 auto;
        }

        .travel-card {
          background: var(--ivory);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          box-shadow: var(--shadow-soft);
          border: 1px solid rgba(212, 175, 55, 0.1);
          text-align: center;
        }

        .travel-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: var(--space-sm);
        }

        .travel-card h4 {
          font-family: var(--font-display);
          font-size: 1.125rem;
          color: var(--dark-brown);
          margin: 0 0 var(--space-sm);
        }

        .travel-distance {
          font-weight: 500;
          color: var(--gold-dark);
          font-size: 0.9375rem;
          margin: 0 0 var(--space-sm);
        }

        .travel-tip {
          color: var(--warm-gray);
          font-size: 0.8125rem;
          margin: 0;
          line-height: 1.5;
        }

        /* Weather Section */
        .weather-section {
          padding: var(--space-2xl) 0;
          background: var(--cream);
        }

        .weather-days {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: var(--space-xl);
          max-width: 900px;
          margin: 0 auto;
        }

        .weather-day-card {
          background: var(--ivory);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-soft);
          border: 1px solid rgba(212, 175, 55, 0.1);
        }

        .weather-day-summary {
          padding: var(--space-lg);
          text-align: center;
        }

        .weather-day-label {
          font-family: var(--font-display);
          font-size: 1.25rem;
          color: var(--dark-brown);
          font-weight: 500;
          display: block;
          margin-bottom: var(--space-md);
        }

        .weather-summary-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-md);
          margin-bottom: var(--space-md);
        }

        .weather-icon-lg {
          font-size: 3rem;
          line-height: 1;
        }

        .weather-summary-info {
          text-align: left;
        }

        .weather-temps {
          display: flex;
          align-items: baseline;
          gap: var(--space-xs);
        }

        .weather-high {
          font-family: var(--font-display);
          font-size: 2rem;
          color: var(--dark-brown);
          font-weight: 500;
        }

        .weather-sep {
          color: var(--warm-gray);
          font-size: 1.25rem;
        }

        .weather-low {
          font-family: var(--font-display);
          font-size: 1.25rem;
          color: var(--warm-gray);
        }

        .weather-desc {
          font-family: var(--font-body);
          color: var(--warm-gray);
          font-size: 0.9375rem;
        }

        .weather-meta {
          display: flex;
          justify-content: center;
          gap: var(--space-md);
          font-size: 0.8125rem;
          color: var(--warm-gray);
          flex-wrap: wrap;
        }

        /* Hourly Breakdown */
        .weather-hourly {
          display: flex;
          overflow-x: auto;
          border-top: 1px solid var(--light-gray);
          background: rgba(212, 175, 55, 0.03);
        }

        .weather-hour {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: var(--space-md) var(--space-sm);
          min-width: 65px;
          flex-shrink: 0;
        }

        .hour-label {
          font-size: 0.6875rem;
          text-transform: uppercase;
          color: var(--warm-gray);
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        .hour-icon {
          font-size: 1.25rem;
        }

        .hour-temp {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 500;
          color: var(--dark-brown);
        }

        .hour-detail {
          font-size: 0.625rem;
          color: var(--warm-gray);
        }

        .weather-note {
          text-align: center;
          font-size: 0.75rem;
          color: var(--warm-gray);
          margin-top: var(--space-lg);
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .hero {
            padding: var(--space-xl) var(--space-md);
          }

          .hero-paisley {
            width: 80px;
            opacity: 0.1;
          }

          .hero-sacred-fire {
            width: 350px;
            height: 350px;
            opacity: 0.4;
            transform: translate(-50%, -35%);
          }

          .countdown {
            gap: var(--space-md);
          }

          .countdown-unit {
            min-width: 50px;
          }

          .hero-cta {
            flex-direction: column;
            align-items: center;
          }

          .hero-cta .btn {
            width: 100%;
            max-width: 250px;
          }

          .events-grid {
            grid-template-columns: 1fr;
          }

          .events-3d-bg {
            height: 300px;
            opacity: 0.5;
          }

          .event-card {
            padding: var(--space-lg);
          }

          .travel-routes {
            grid-template-columns: 1fr;
          }
        }

        /* Tablet - keep 2x2 grid */
        @media (min-width: 481px) and (max-width: 768px) {
          .travel-routes {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </motion.div>
  )
}

export default Home
