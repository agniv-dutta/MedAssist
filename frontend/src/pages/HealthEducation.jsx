import React, { useState, useEffect } from 'react'
import { getHealthTips, logAnalyticsEvent } from '../utils/api'
import LanguageToggle from '../components/LanguageToggle'

export default function HealthEducation({ navigate }) {
  const [selectedCategory, setSelectedCategory] = useState('general_wellness')
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(false)

  const categories = [
    { id: 'general_wellness', name: '🏥 General Wellness', icon: '💪' },
    { id: 'fever', name: '🌡️ Fever Management', icon: '🌡️' },
    { id: 'cough', name: '🤧 Cough Relief', icon: '🤧' },
    { id: 'headache', name: '😓 Headache Care', icon: '😓' },
    { id: 'diabetes', name: '🩸 Diabetes Management', icon: '🩸' },
    { id: 'hypertension', name: '❤️ Blood Pressure', icon: '❤️' }
  ]

  useEffect(() => {
    if (!localStorage.getItem('userId')) {
      navigate('/')
    }
    loadHealthTips(selectedCategory)
  }, [selectedCategory])

  const loadHealthTips = async (category) => {
    setLoading(true)
    try {
      logAnalyticsEvent('health_tip_view', { category })
      const data = await getHealthTips(category)
      setContent(data.content)
    } catch (error) {
      console.error('Error loading health tips:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <LanguageToggle />
      {/* Header */}
      <div className="bg-white shadow-md p-6 mb-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Health Education & Tips 📚</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Category Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-4 rounded-lg font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-800 shadow hover:shadow-md'
              }`}
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Content Display */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">⏳</div>
            <p className="mt-4 text-gray-600">Loading health tips...</p>
          </div>
        ) : content ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-4 border-blue-600 pb-4">
              {content.title}
            </h2>

            {/* Tips Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">💡 Key Tips</h3>
              <ul className="space-y-3">
                {content.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start p-4 bg-blue-50 rounded-lg">
                    <span className="text-blue-600 font-bold mr-4 text-xl">{idx + 1}.</span>
                    <span className="text-gray-800">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Red Flags */}
            <div className="mb-8 bg-red-50 border-l-4 border-red-600 p-6 rounded">
              <h3 className="text-2xl font-bold text-red-600 mb-4">🚨 Red Flags - Seek Immediate Care</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {content.red_flags.map((flag, idx) => (
                  <li key={idx} className="flex items-center text-red-700">
                    <span className="text-red-600 font-bold mr-3">⚠️</span>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>

            {/* When to Visit Doctor */}
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded">
              <h3 className="text-2xl font-bold text-yellow-700 mb-3">👨‍⚕️ When to Visit a Doctor</h3>
              <p className="text-gray-800 text-lg">{content.when_to_visit_doctor}</p>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4 flex-wrap">
              <button
                onClick={() => navigate('/symptom-checker')}
                className="btn-primary"
              >
                🩺 Check Symptoms
              </button>
              <button
                onClick={() => navigate('/medical-history')}
                className="btn-secondary"
              >
                📋 View Medical History
              </button>
              <button
                onClick={() => {
                  const text = `${content.title}\n\n${content.tips.join('\n')}`
                  navigator.clipboard.writeText(text)
                  alert('Tips copied to clipboard!')
                }}
                className="btn-secondary"
              >
                📋 Copy Tips
              </button>
            </div>
          </div>
        ) : null}

        {/* Additional Resources */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-green-100 rounded-lg p-6">
            <div className="text-4xl mb-3">🥗</div>
            <h3 className="font-bold text-lg mb-2">Healthy Diet</h3>
            <p className="text-gray-700 text-sm">A balanced diet is the foundation of good health. Include fruits, vegetables, whole grains, and lean proteins.</p>
          </div>
          <div className="bg-blue-100 rounded-lg p-6">
            <div className="text-4xl mb-3">🏃</div>
            <h3 className="font-bold text-lg mb-2">Regular Exercise</h3>
            <p className="text-gray-700 text-sm">30 minutes of moderate physical activity daily strengthens your heart, bones, and improves mental health.</p>
          </div>
          <div className="bg-purple-100 rounded-lg p-6">
            <div className="text-4xl mb-3">😴</div>
            <h3 className="font-bold text-lg mb-2">Quality Sleep</h3>
            <p className="text-gray-700 text-sm">7-8 hours of quality sleep is essential for immune function, mental clarity, and overall wellness.</p>
          </div>
        </div>

        {/* Prevention Tips */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold mb-4">🛡️ Prevention is Better Than Cure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-3">Daily Habits</h3>
              <ul className="space-y-2">
                <li>✓ Wash hands regularly with soap</li>
                <li>✓ Drink clean water</li>
                <li>✓ Maintain personal hygiene</li>
                <li>✓ Avoid tobacco and alcohol</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Regular Check-ups</h3>
              <ul className="space-y-2">
                <li>✓ Annual health screening</li>
                <li>✓ Blood pressure monitoring</li>
                <li>✓ Blood tests for diabetes</li>
                <li>✓ Keep vaccinations updated</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-700 text-sm">
          <p>⚠️ <strong>Disclaimer:</strong> This information is for educational purposes only. Always consult a qualified healthcare provider for diagnosis and treatment.</p>
        </div>
      </div>
    </div>
  )
}
