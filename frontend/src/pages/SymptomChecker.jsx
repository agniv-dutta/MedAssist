import React, { useState, useRef, useEffect } from 'react'
import { analyzeSymptoms, saveMedicalHistory } from '../utils/api'

export default function SymptomChecker({ navigate }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [phase, setPhase] = useState('initial') // initial, analyzing, result
  const [userInfo, setUserInfo] = useState(null)
  const messagesEndRef = useRef(null)

  const userId = localStorage.getItem('userId')

  useEffect(() => {
    if (!userId) {
      navigate('/')
    }
  }, [userId, navigate])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Emergency':
        return 'severity-emergency'
      case 'Consult Soon':
        return 'severity-urgent'
      case 'Home Care':
        return 'severity-moderate'
      case 'Monitor':
        return 'severity-low'
      default:
        return 'severity-low'
    }
  }

  const handleInitialSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMessages = [
      ...messages,
      { type: 'user', content: input }
    ]
    setMessages(newMessages)

    setUserInfo({
      symptom: input,
      timestamp: new Date().toISOString()
    })

    setPhase('analyzing')
    analyzeSymptomMessage(input, newMessages)
    setInput('')
  }

  const analyzeSymptomMessage = async (symptom, currentMessages) => {
    setLoading(true)
    try {
      const response = await analyzeSymptoms(userId, symptom, currentMessages)
      
      setMessages(prev => [
        ...prev,
        { 
          type: 'bot', 
          content: response.message,
          data: response
        }
      ])

      if (response.severity && response.severity !== 'follow-up') {
        setResult(response)
        setPhase('result')
      } else {
        setPhase('analyzing')
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [
        ...prev,
        { type: 'bot', content: 'Sorry, there was an error. Please try again.' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleFollowUp = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMessages = [
      ...messages,
      { type: 'user', content: input }
    ]
    setMessages(newMessages)
    analyzeSymptomMessage(input, newMessages)
    setInput('')
  }

  const handleSaveAndContinue = async () => {
    try {
      await saveMedicalHistory(userId, {
        type: 'symptom_check',
        result,
        messages,
        timestamp: new Date().toISOString()
      })
      navigate('/dashboard')
    } catch (error) {
      console.error('Error saving:', error)
      alert('Error saving. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-gray-800">🩺 Symptom Checker</h1>
            <p className="text-gray-600 mt-1">Describe your symptoms for AI assessment</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Dashboard
          </button>
        </div>

        {/* Chat Container */}
        <div className="chat-container h-96 mb-4 overflow-y-auto p-6">
          {messages.length === 0 && phase === 'initial' && (
            <div className="text-center text-gray-500 mt-10">
              <p className="text-lg">Hi! I'm your health assistant.</p>
              <p className="mt-2">Tell me about your symptoms to get started.</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${msg.type === 'user' ? 'user' : 'bot'}`}
            >
              {msg.content}
              {msg.data && msg.data.questions && (
                <div className="mt-3 text-sm">
                  {msg.data.questions.length > 0 && (
                    <p className="font-semibold">Follow-up questions:</p>
                  )}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="message bot">
              <div className="flex items-center gap-2">
                <div className="animate-spin">⏳</div>
                Analyzing your symptoms...
              </div>
            </div>
          )}

          {result && phase === 'result' && (
            <div className="bg-white p-6 rounded-lg mb-4 border-l-4 border-blue-600">
              <div className="mb-4">
                <p className="text-sm text-gray-600 font-semibold mb-2">SEVERITY ASSESSMENT:</p>
                <div className={`severity-badge ${getSeverityColor(result.severity)}`}>
                  {result.severity}
                </div>
              </div>

              {result.red_flags && result.red_flags.length > 0 && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-800 font-bold mb-2">⚠️ Red Flags Detected:</p>
                  <ul className="text-red-700 text-sm">
                    {result.red_flags.map((flag, i) => (
                      <li key={i}>• {flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.recommendations && (
                <div className="mb-4">
                  <p className="font-semibold text-gray-800 mb-2">📝 Recommendations:</p>
                  <ul className="text-gray-700 text-sm space-y-1">
                    {result.recommendations.map((rec, i) => (
                      <li key={i}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.first_aid && result.first_aid.length > 0 && (
                <div className="mb-4">
                  <p className="font-semibold text-gray-800 mb-2">🏥 First Aid:</p>
                  <ul className="text-gray-700 text-sm space-y-1">
                    {result.first_aid.map((aid, i) => (
                      <li key={i}>• {aid}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={phase === 'initial' || phase === 'analyzing' ? handleFollowUp : handleInitialSubmit} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={phase === 'initial' ? 'Describe your symptoms...' : 'Ask a follow-up question...'}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>

        {/* Action Buttons */}
        {result && phase === 'result' && (
          <div className="flex gap-4">
            <button
              onClick={handleSaveAndContinue}
              className="btn-primary flex-1"
            >
              Save & Continue to Dashboard
            </button>
            <button
              onClick={() => {
                setMessages([])
                setResult(null)
                setPhase('initial')
              }}
              className="btn-secondary flex-1"
            >
              Check Another Symptom
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
