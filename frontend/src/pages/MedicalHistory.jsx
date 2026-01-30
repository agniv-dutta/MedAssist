import React, { useState, useEffect } from 'react'
import { Activity, Pill, ArrowLeft, CheckCircle, User, Clock } from 'lucide-react'

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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #F3F4F6, #E5E7EB)', padding: '16px' }}>
      <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Activity size={32} color="#0D9488" />
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1F2937' }}>Medical History</h1>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              backgroundColor: '#0D9488',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>

        {savedMessage && (
          <div style={{ backgroundColor: '#10B981', color: 'white', padding: '16px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <CheckCircle size={20} />
            Information saved successfully!
          </div>
        )}

        {/* Personal Information */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px', fontWeight: 'bold', color: '#1F2937', marginBottom: '16px' }}>
            <User size={28} color="#0D9488" />
            Personal Information
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', color: '#374151', fontWeight: '600', marginBottom: '8px' }}>Full Name</label>
              <input
                type="text"
                value={userProfile.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                style={{ width: '100%', padding: '10px 16px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '16px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#374151', fontWeight: '600', marginBottom: '8px' }}>Age</label>
              <input
                type="number"
                value={userProfile.age}
                onChange={(e) => handleProfileChange('age', e.target.value)}
                style={{ width: '100%', padding: '10px 16px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '16px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#374151', fontWeight: '600', marginBottom: '8px' }}>Gender</label>
              <select
                value={userProfile.gender}
                onChange={(e) => handleProfileChange('gender', e.target.value)}
                style={{ width: '100%', padding: '10px 16px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '16px' }}
              >
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: '#374151', fontWeight: '600', marginBottom: '8px' }}>Location</label>
              <input
                type="text"
                value={userProfile.location}
                onChange={(e) => handleProfileChange('location', e.target.value)}
                placeholder="City, District, State"
                style={{ width: '100%', padding: '10px 16px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '16px' }}
              />
            </div>
          </div>
        </div>

        {/* Chronic Conditions */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px', fontWeight: 'bold', color: '#1F2937', marginBottom: '16px' }}>
            <CheckCircle size={28} color="#0D9488" />
            Chronic Conditions
          </div>
          <p style={{ color: '#4B5563', marginBottom: '16px' }}>Select any conditions you have:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            {commonConditions.map(condition => (
              <label key={condition} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <input
                  type="checkbox"
                  checked={userProfile.chronicConditions.includes(condition)}
                  onChange={() => toggleChronicCondition(condition)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ color: '#374151' }}>{condition}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Medications */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px', fontWeight: 'bold', color: '#1F2937', marginBottom: '16px' }}>
            <Pill size={28} color="#0D9488" />
            Current Medications
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: '#374151', fontWeight: '600', marginBottom: '8px' }}>Add New Medication</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                placeholder="e.g., Aspirin 75mg - Daily"
                style={{ flex: 1, padding: '10px 16px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '16px' }}
              />
              <button
                onClick={addMedication}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#0D9488',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Add
              </button>
            </div>
          </div>

          {userProfile.medications && userProfile.medications.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {userProfile.medications.map((med, idx) => (
                <div key={idx} style={{ backgroundColor: '#F0FDFA', padding: '12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #0D9488' }}>
                  <span style={{ color: '#1F2937' }}>{med}</span>
                  <button
                    onClick={() => removeMedication(idx)}
                    style={{
                      color: '#EF4444',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#9CA3AF' }}>No medications added yet</p>
          )}
        </div>

        {/* Appointment Reminders */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px', fontWeight: 'bold', color: '#1F2937', marginBottom: '16px' }}>
            <Clock size={28} color="#0D9488" />
            Upcoming Reminders
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ backgroundColor: '#FFFBEB', padding: '16px', borderRadius: '6px', borderLeft: '4px solid #FBBF24' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>
                <Activity size={20} color="#0D9488" />
                Regular Check-up
              </div>
              <p style={{ fontSize: '14px', color: '#6B7280' }}>Due in 30 days</p>
            </div>
            <div style={{ backgroundColor: '#EFF6FF', padding: '16px', borderRadius: '6px', borderLeft: '4px solid #3B82F6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>
                <Pill size={20} color="#0D9488" />
                Health Screening
              </div>
              <p style={{ fontSize: '14px', color: '#6B7280' }}>Annual screening recommended</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
