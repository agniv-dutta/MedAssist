import React, { useState } from 'react'
import { Search, Clock, MapPin, Star, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { getAvailableDoctors, bookAppointment } from '../utils/api'

export default function DoctorConnect({ navigate }) {
  const [doctors, setDoctors] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedTime, setSelectedTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [booked, setBooked] = useState(false)
  const [location, setLocation] = useState('')

  const userId = localStorage.getItem('userId')

  const handleSearchDoctors = async (e) => {
    e.preventDefault()
    if (!location.trim()) return

    setLoading(true)
    try {
      const response = await getAvailableDoctors(location)
      setDoctors(response.doctors || [])
    } catch (error) {
      console.error('Error fetching doctors:', error)
      // Mock data for demo
      setDoctors([
        { id: 1, name: 'Dr. Raj Kumar', specialty: 'General Physician', rating: 4.5, experience: '10 years' },
        { id: 2, name: 'Dr. Priya Singh', specialty: 'Pediatrician', rating: 4.8, experience: '8 years' },
        { id: 3, name: 'Dr. Amit Patel', specialty: 'Cardiologist', rating: 4.6, experience: '12 years' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedTime) {
      alert('Please select a doctor and time slot')
      return
    }

    try {
      const response = await bookAppointment(userId, selectedDoctor.id, selectedTime)
      setBooked(true)
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (error) {
      console.error('Error booking appointment:', error)
      alert('Error booking appointment. Please try again.')
    }
  }

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM'
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', padding: '20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E0F2FE'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <ArrowLeft size={24} color="#0D9488" />
            </button>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0F172A', margin: 0 }}>Connect with Doctor</h1>
          </div>
        </div>

        {booked && (
          <div style={{ backgroundColor: '#10B981', color: 'white', padding: '24px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <CheckCircle size={24} />
              <p style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Appointment Booked!</p>
            </div>
            <p style={{ marginTop: '8px' }}>Redirecting to dashboard...</p>
          </div>
        )}

        {/* Search */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px', fontWeight: 'bold', color: '#1F2937', marginBottom: '16px' }}>
            <Search size={28} color="#0D9488" />
            Find Available Doctors
          </div>
          <form onSubmit={handleSearchDoctors} style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
              style={{ flex: 1, padding: '12px 16px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '16px' }}
            />
            <button type="submit" style={{
              padding: '12px 24px',
              backgroundColor: '#0D9488',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Doctors List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          {doctors.map(doctor => (
            <div
              key={doctor.id}
              onClick={() => setSelectedDoctor(doctor)}
              style={{
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: selectedDoctor?.id === doctor.id ? '#0D9488' : 'white',
                color: selectedDoctor?.id === doctor.id ? 'white' : '#1F2937',
                border: selectedDoctor?.id === doctor.id ? 'none' : '2px solid transparent',
                transform: selectedDoctor?.id === doctor.id ? 'scale(1.02)' : 'scale(1)'
              }}
              onMouseEnter={(e) => {
                if (selectedDoctor?.id !== doctor.id) {
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.15)'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedDoctor?.id !== doctor.id) {
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'
                }
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{doctor.name}</h3>
                  <p style={{ fontSize: '14px', color: selectedDoctor?.id === doctor.id ? '#D1FAE5' : '#6B7280', margin: '4px 0 0 0' }}>
                    {doctor.specialty}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600', marginBottom: '4px' }}>
                    <Star size={16} />
                    Rating
                  </div>
                  <p style={{ margin: 0 }}>{doctor.rating}/5</p>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600', marginBottom: '4px' }}>
                    <Clock size={16} />
                    Experience
                  </div>
                  <p style={{ margin: 0 }}>{doctor.experience}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Time Slot Selection */}
        {selectedDoctor && (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px', fontWeight: 'bold', color: '#1F2937', marginBottom: '16px' }}>
              <Clock size={28} color="#0D9488" />
              Select Appointment Time
            </div>
            <p style={{ color: '#6B7280', marginBottom: '16px' }}>
              Booking with <span style={{ fontWeight: '600' }}>{selectedDoctor.name}</span>
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px', marginBottom: '24px' }}>
              {timeSlots.map(time => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: selectedTime === time ? '#0D9488' : '#F3F4F6',
                    color: selectedTime === time ? 'white' : '#1F2937'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedTime !== time) {
                      e.currentTarget.style.backgroundColor = '#E5E7EB'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedTime !== time) {
                      e.currentTarget.style.backgroundColor = '#F3F4F6'
                    }
                  }}
                >
                  {time}
                </button>
              ))}
            </div>

            {selectedTime && (
              <div style={{ backgroundColor: '#F0FDFA', padding: '16px', borderRadius: '6px', marginBottom: '24px', borderLeft: '4px solid #0D9488' }}>
                <p style={{ fontWeight: '600', color: '#1F2937', margin: '0 0 8px 0' }}>Confirmed Appointment:</p>
                <p style={{ color: '#4B5563', margin: '4px 0', fontSize: '14px' }}>{selectedDoctor.name}</p>
                <p style={{ color: '#4B5563', margin: '4px 0', fontSize: '14px' }}>Specialty: {selectedDoctor.specialty}</p>
                <p style={{ color: '#0D9488', margin: '4px 0', fontSize: '14px', fontWeight: '600' }}>Time: {selectedTime}</p>
              </div>
            )}

            <button
              onClick={handleBookAppointment}
              disabled={!selectedTime}
              style={{
                width: '100%',
                padding: '12px 24px',
                backgroundColor: selectedTime ? '#0D9488' : '#D1D5DB',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: selectedTime ? 'pointer' : 'not-allowed',
                fontWeight: '600',
                fontSize: '16px'
              }}
            >
              Confirm Appointment
            </button>
          </div>
        )}

        {/* Info Box */}
        <div style={{ backgroundColor: '#F0FDFA', borderRadius: '8px', padding: '24px', borderLeft: '4px solid #0D9488' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', color: '#1F2937', marginBottom: '12px' }}>
            <AlertCircle size={20} color="#0D9488" />
            Consultation Info
          </div>
          <ul style={{ color: '#4B5563', fontSize: '14px', margin: 0, paddingLeft: '24px' }}>
            <li style={{ marginBottom: '8px' }}>Consultation via video call (link sent 30 min before)</li>
            <li style={{ marginBottom: '8px' }}>Initial consultation: 15-20 minutes</li>
            <li style={{ marginBottom: '8px' }}>Prescription and medical advice provided</li>
            <li>Follow-up care recommendations included</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
