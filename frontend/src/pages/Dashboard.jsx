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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Welcome, {userProfile.name}! 👋</h1>
              <p className="text-gray-600 mt-2">Your personal health dashboard</p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => navigate('/symptom-checker')}
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition"
          >
            <div className="text-4xl mb-2">🩺</div>
            <div className="text-lg font-bold">Check Symptoms</div>
            <div className="text-sm mt-1">Get AI assessment</div>
          </button>

          <button
            onClick={() => navigate('/medical-history')}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition"
          >
            <div className="text-4xl mb-2">📋</div>
            <div className="text-lg font-bold">Medical History</div>
            <div className="text-sm mt-1">View your records</div>
          </button>

          <button
            onClick={() => navigate('/doctor-connect')}
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition"
          >
            <div className="text-4xl mb-2">👨‍⚕️</div>
            <div className="text-lg font-bold">Connect Doctor</div>
            <div className="text-sm mt-1">Book consultation</div>
          </button>

          <button
            onClick={() => navigate('/medical-history')}
            className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition"
          >
            <div className="text-4xl mb-2">💊</div>
            <div className="text-lg font-bold">Medications</div>
            <div className="text-sm mt-1">Manage reminders</div>
          </button>
        </div>

        {/* Health Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Health Profile</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600">Age:</span>
                <span className="ml-2 font-semibold">{userProfile.age || 'Not set'}</span>
              </div>
              <div>
                <span className="text-gray-600">Gender:</span>
                <span className="ml-2 font-semibold">{userProfile.gender || 'Not set'}</span>
              </div>
              <div>
                <span className="text-gray-600">Location:</span>
                <span className="ml-2 font-semibold">{userProfile.location || 'Not set'}</span>
              </div>
              <div>
                <span className="text-gray-600">Chronic Conditions:</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {userProfile.chronicConditions && userProfile.chronicConditions.length > 0 ? (
                    userProfile.chronicConditions.map((cond, i) => (
                      <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {cond}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">None</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📈 Recent Activity</h2>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : medicalData && medicalData.history && medicalData.history.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {medicalData.history.slice(0, 5).map((item, i) => (
                  <div key={i} className="border-l-4 border-blue-500 pl-3 py-2">
                    <p className="font-semibold text-gray-800">{item.type === 'symptom_check' ? '🩺 Symptom Check' : '📋 Update'}</p>
                    <p className="text-sm text-gray-600">{new Date(item.timestamp).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No recent activity</p>
            )}
          </div>
        </div>

        {/* Health Tips */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">💡 Health Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <p className="font-semibold">💧 Stay Hydrated</p>
              <p className="text-sm mt-1">Drink at least 8 glasses of water daily</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <p className="font-semibold">🏃 Exercise Regular</p>
              <p className="text-sm mt-1">30 minutes of activity daily improves health</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <p className="font-semibold">😴 Sleep Well</p>
              <p className="text-sm mt-1">Get 7-9 hours of quality sleep each night</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
