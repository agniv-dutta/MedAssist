import React, { useState } from 'react'
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-800">👨‍⚕️ Connect with Doctor</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            Back
          </button>
        </div>

        {booked && (
          <div className="bg-green-500 text-white p-6 rounded-lg mb-6 text-center">
            <p className="text-2xl font-bold">✓ Appointment Booked!</p>
            <p className="mt-2">Redirecting to dashboard...</p>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🔍 Find Available Doctors</h2>
          <form onSubmit={handleSearchDoctors} className="flex gap-3">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Doctors List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {doctors.map(doctor => (
            <div
              key={doctor.id}
              onClick={() => setSelectedDoctor(doctor)}
              className={`p-6 rounded-lg shadow-lg cursor-pointer transition ${
                selectedDoctor?.id === doctor.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 hover:shadow-xl'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold">{doctor.name}</h3>
                  <p className={`text-sm ${selectedDoctor?.id === doctor.id ? 'text-blue-100' : 'text-gray-600'}`}>
                    {doctor.specialty}
                  </p>
                </div>
                <div className="text-3xl">👨‍⚕️</div>
              </div>
              <div className="flex gap-4 text-sm">
                <div>
                  <p className="font-semibold">⭐ Rating</p>
                  <p>{doctor.rating}/5</p>
                </div>
                <div>
                  <p className="font-semibold">📅 Experience</p>
                  <p>{doctor.experience}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Time Slot Selection */}
        {selectedDoctor && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📅 Select Appointment Time
            </h2>
            <p className="text-gray-600 mb-4">
              Booking with <span className="font-semibold">{selectedDoctor.name}</span>
            </p>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {timeSlots.map(time => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-2 px-3 rounded-lg font-semibold transition ${
                    selectedTime === time
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>

            {selectedTime && (
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-gray-800">
                  <span className="font-semibold">Confirmed Appointment:</span><br/>
                  {selectedDoctor.name}<br/>
                  Specialty: {selectedDoctor.specialty}<br/>
                  Time: <span className="text-blue-600 font-bold">{selectedTime}</span>
                </p>
              </div>
            )}

            <button
              onClick={handleBookAppointment}
              disabled={!selectedTime}
              className="btn-primary w-full disabled:opacity-50"
            >
              Confirm Appointment
            </button>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
          <h3 className="font-bold text-gray-800 mb-2">💡 Consultation Info</h3>
          <ul className="text-gray-700 text-sm space-y-1">
            <li>• Consultation via video call (link sent 30 min before)</li>
            <li>• Initial consultation: 15-20 minutes</li>
            <li>• Prescription and medical advice provided</li>
            <li>• Follow-up care recommendations included</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
