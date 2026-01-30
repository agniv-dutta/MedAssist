import React, { useState, useEffect } from 'react'
import { Activity, Pill, ArrowLeft, CheckCircle } from 'lucide-react'

export default function MedicalHistory({ navigate }) {
  const [userProfile, setUserProfile] = useState({
    name: '',
    age: '',
    gender: '',
    location: '',
    chronicConditions: [],
    medications: []
  })
  const [newMedication, setNewMedication] = useState('')
  const [savedMessage, setSavedMessage] = useState(false)

  const userId = localStorage.getItem('userId')

  useEffect(() => {
    if (!userId) {
      navigate('/')
    } else {
      loadUserProfile()
    }
  }, [userId, navigate])

  const loadUserProfile = () => {
    const profile = localStorage.getItem('userProfile')
    if (profile) {
      setUserProfile(JSON.parse(profile))
    }
  }

  const handleProfileChange = (field, value) => {
    const updated = { ...userProfile, [field]: value }
    setUserProfile(updated)
    localStorage.setItem('userProfile', JSON.stringify(updated))
    setSavedMessage(true)
    setTimeout(() => setSavedMessage(false), 2000)
  }

  const addMedication = () => {
    if (newMedication.trim()) {
      const updated = {
        ...userProfile,
        medications: [...userProfile.medications, newMedication]
      }
      setUserProfile(updated)
      localStorage.setItem('userProfile', JSON.stringify(updated))
      setNewMedication('')
      setSavedMessage(true)
      setTimeout(() => setSavedMessage(false), 2000)
    }
  }

  const removeMedication = (index) => {
    const updated = {
      ...userProfile,
      medications: userProfile.medications.filter((_, i) => i !== index)
    }
    setUserProfile(updated)
    localStorage.setItem('userProfile', JSON.stringify(updated))
  }

  const toggleChronicCondition = (condition) => {
    let updated
    if (userProfile.chronicConditions.includes(condition)) {
      updated = {
        ...userProfile,
        chronicConditions: userProfile.chronicConditions.filter(c => c !== condition)
      }
    } else {
      updated = {
        ...userProfile,
        chronicConditions: [...userProfile.chronicConditions, condition]
      }
    }
    setUserProfile(updated)
    localStorage.setItem('userProfile', JSON.stringify(updated))
  }

  const commonConditions = ['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Thyroid', 'Arthritis']

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-800">📋 Medical History</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            Back
          </button>
        </div>

        {savedMessage && (
          <div className="bg-green-500 text-white p-4 rounded-lg mb-6 text-center">
            ✓ Information saved successfully!
          </div>
        )}

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">👤 Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
              <input
                type="text"
                value={userProfile.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Age</label>
              <input
                type="number"
                value={userProfile.age}
                onChange={(e) => handleProfileChange('age', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Gender</label>
              <select
                value={userProfile.gender}
                onChange={(e) => handleProfileChange('gender', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              >
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Location</label>
              <input
                type="text"
                value={userProfile.location}
                onChange={(e) => handleProfileChange('location', e.target.value)}
                placeholder="City, District, State"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Chronic Conditions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">⚕️ Chronic Conditions</h2>
          <p className="text-gray-600 mb-4">Select any conditions you have:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {commonConditions.map(condition => (
              <label key={condition} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-blue-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userProfile.chronicConditions.includes(condition)}
                  onChange={() => toggleChronicCondition(condition)}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">{condition}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Medications */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">💊 Current Medications</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Add New Medication</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                placeholder="e.g., Aspirin 75mg - Daily"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
              <button
                onClick={addMedication}
                className="btn-primary"
              >
                Add
              </button>
            </div>
          </div>

          {userProfile.medications && userProfile.medications.length > 0 ? (
            <div className="space-y-2">
              {userProfile.medications.map((med, idx) => (
                <div key={idx} className="bg-blue-50 p-3 rounded-lg flex justify-between items-center">
                  <span className="text-gray-800">{med}</span>
                  <button
                    onClick={() => removeMedication(idx)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No medications added yet</p>
          )}
        </div>

        {/* Appointment Reminders */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📅 Upcoming Reminders</h2>
          <div className="space-y-2">
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <p className="font-semibold text-gray-800">💉 Regular Check-up</p>
              <p className="text-sm text-gray-600">Due in 30 days</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="font-semibold text-gray-800">🧪 Health Screening</p>
              <p className="text-sm text-gray-600">Annual screening recommended</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
