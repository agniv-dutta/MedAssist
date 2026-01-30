import React from 'react'

export default function Landing({ navigate }) {
  React.useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (userId) {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleGetStarted = () => {
    const userId = 'user_' + Date.now()
    localStorage.setItem('userId', userId)
    navigate('/symptom-checker')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <div className="text-6xl mb-4">🏥</div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">MedAssist</h1>
          <p className="text-xl text-gray-600 mb-2">AI-Powered Rural Healthcare Bridge</p>
        </div>

        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Access quality healthcare advice anytime, anywhere. Our AI assistant helps with:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-3">🩺</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Symptom Checker</h3>
            <p className="text-gray-600">Describe your symptoms and get instant AI-powered triage assessment</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Medical History</h3>
            <p className="text-gray-600">Track your health records and medications in one secure place</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-3">💊</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Medication Reminders</h3>
            <p className="text-gray-600">Never miss a dose with smart reminder notifications</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-3">👨‍⚕️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Doctor Connect</h3>
            <p className="text-gray-600">Book appointments with qualified doctors for consultation</p>
          </div>
        </div>

        <button
          onClick={handleGetStarted}
          className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-blue-700 transition shadow-lg"
        >
          Check Symptoms Now →
        </button>

        <p className="text-sm text-gray-600 mt-8">
          Secure • Free • Available 24/7
        </p>
      </div>
    </div>
  )
}
