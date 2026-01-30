import React, { useState, useEffect } from 'react'
import { getMedicalHistory } from '../utils/api'

export default function Dashboard({ navigate }) {
  const [medicalData, setMedicalData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState({
    name: 'Patient',
    age: null,
    gender: null,
    location: null,
    chronicConditions: []
  })

  const userId = localStorage.getItem('userId')

  useEffect(() => {
    if (!userId) {
      navigate('/')
    } else {
      loadMedicalHistory()
      loadUserProfile()
    }
  }, [userId, navigate])

  const loadMedicalHistory = async () => {
    try {
      const data = await getMedicalHistory(userId)
      setMedicalData(data)
    } catch (error) {
      console.error('Error loading medical history:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserProfile = () => {
    const profile = localStorage.getItem('userProfile')
    if (profile) {
      setUserProfile(JSON.parse(profile))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('userProfile')
    navigate('/')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#0F172A', marginBottom: '10px' }}>
              Welcome, {userProfile.name}! 👋
            </h1>
            <p style={{ color: '#64748B', marginTop: '8px' }}>Your personal health dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary"
            style={{ whiteSpace: 'nowrap' }}
          >
            Logout
          </button>
        </div>

        {/* Quick Actions Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <button
            onClick={() => navigate('/symptom-checker')}
            style={{
              background: 'linear-gradient(135deg, #0D9488 0%, #10B981 100%)',
              color: 'white',
              padding: '24px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(13, 148, 136, 0.2)',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)'
              e.target.style.boxShadow = '0 10px 15px rgba(13, 148, 136, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 6px rgba(13, 148, 136, 0.2)'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🩺</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Check Symptoms</div>
            <div style={{ fontSize: '0.875rem', marginTop: '8px', opacity: 0.9 }}>Get AI assessment</div>
          </button>

          <button
            onClick={() => navigate('/medical-history')}
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white',
              padding: '24px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)'
              e.target.style.boxShadow = '0 10px 15px rgba(16, 185, 129, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 6px rgba(16, 185, 129, 0.2)'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📋</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Medical History</div>
            <div style={{ fontSize: '0.875rem', marginTop: '8px', opacity: 0.9 }}>View your records</div>
          </button>

          <button
            onClick={() => navigate('/doctor-connect')}
            style={{
              background: 'linear-gradient(135deg, #0D9488 0%, #10B981 100%)',
              color: 'white',
              padding: '24px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(13, 148, 136, 0.2)',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)'
              e.target.style.boxShadow = '0 10px 15px rgba(13, 148, 136, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 6px rgba(13, 148, 136, 0.2)'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>👨‍⚕️</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Connect Doctor</div>
            <div style={{ fontSize: '0.875rem', marginTop: '8px', opacity: 0.9 }}>Book consultation</div>
          </button>

          <button
            onClick={() => navigate('/medical-history')}
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white',
              padding: '24px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)'
              e.target.style.boxShadow = '0 10px 15px rgba(16, 185, 129, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 6px rgba(16, 185, 129, 0.2)'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>💊</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Medications</div>
            <div style={{ fontSize: '0.875rem', marginTop: '8px', opacity: 0.9 }}>Manage reminders</div>
          </button>
        </div>

        {/* Health Profile & Recent Activity */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E2E8F0'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#0F172A', marginBottom: '16px' }}>📊 Health Profile</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ color: '#64748B' }}>Age:</span>
                <span style={{ marginLeft: '8px', fontWeight: 600, color: '#0F172A' }}>{userProfile.age || 'Not set'}</span>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Gender:</span>
                <span style={{ marginLeft: '8px', fontWeight: 600, color: '#0F172A' }}>{userProfile.gender || 'Not set'}</span>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Location:</span>
                <span style={{ marginLeft: '8px', fontWeight: 600, color: '#0F172A' }}>{userProfile.location || 'Not set'}</span>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Chronic Conditions:</span>
                <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {userProfile.chronicConditions && userProfile.chronicConditions.length > 0 ? (
                    userProfile.chronicConditions.map((cond, i) => (
                      <span key={i} style={{
                        background: '#CCFBF1',
                        color: '#0D9488',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        {cond}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: '#94A3B8' }}>None</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E2E8F0'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#0F172A', marginBottom: '16px' }}>📈 Recent Activity</h2>
            {loading ? (
              <p style={{ color: '#64748B' }}>Loading...</p>
            ) : medicalData && medicalData.history && medicalData.history.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '256px', overflowY: 'auto' }}>
                {medicalData.history.slice(0, 5).map((item, i) => (
                  <div key={i} style={{
                    borderLeft: '4px solid #0D9488',
                    paddingLeft: '12px',
                    paddingTop: '8px',
                    paddingBottom: '8px'
                  }}>
                    <p style={{ fontWeight: 600, color: '#0F172A' }}>{item.type === 'symptom_check' ? '🩺 Symptom Check' : '📋 Update'}</p>
                    <p style={{ fontSize: '0.875rem', color: '#64748B' }}>{new Date(item.timestamp).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#64748B' }}>No recent activity</p>
            )}
          </div>
        </div>

        {/* Health Tips */}
        <div style={{
          background: 'linear-gradient(135deg, #0D9488 0%, #10B981 100%)',
          color: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>💡 Health Tips</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '16px',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{ fontWeight: 600, marginBottom: '8px' }}>💧 Stay Hydrated</p>
              <p style={{ fontSize: '0.875rem', opacity: 0.95 }}>Drink at least 8 glasses of water daily</p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '16px',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{ fontWeight: 600, marginBottom: '8px' }}>🏃 Exercise Regular</p>
              <p style={{ fontSize: '0.875rem', opacity: 0.95 }}>30 minutes of activity daily improves health</p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '16px',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{ fontWeight: 600, marginBottom: '8px' }}>😴 Sleep Well</p>
              <p style={{ fontSize: '0.875rem', opacity: 0.95 }}>Get 7-9 hours of quality sleep each night</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
