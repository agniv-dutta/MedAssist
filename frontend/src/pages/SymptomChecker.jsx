import React, { useState, useRef, useEffect } from 'react'
import { Thermometer, Wind, Heart, Brain, Activity, AlertCircle, CheckCircle, AlertTriangle, Phone, Stethoscope } from 'lucide-react'

// Hardcoded symptom analysis data for MVP
const SYMPTOM_ANALYSIS = {
  fever: {
    severity: 'Consult Soon',
    recommendations: [
      'Stay hydrated - drink plenty of water and electrolyte solutions',
      'Get adequate rest and sleep to help your body fight the infection',
      'Use mild fever-reducing medications like paracetamol as needed',
      'Avoid antibiotics unless prescribed by a doctor',
      'Monitor temperature regularly, especially during evening hours'
    ],
    red_flags: [
      'High fever (>103°F) lasting more than 3 days',
      'Severe headache or body aches',
      'Difficulty breathing or chest pain',
      'Persistent vomiting preventing food/water intake'
    ],
    first_aid: [
      'Take tepid sponging if fever is very high (>103°F)',
      'Keep room cool and well-ventilated',
      'Wear light cotton clothing',
      'Do not use ice baths or cold water',
      'Eat nutritious foods when appetite returns'
    ],
    specialist_recommendation: 'General Physician'
  },
  cough: {
    severity: 'Monitor',
    recommendations: [
      'Stay hydrated - drink warm water, herbal tea, and honey',
      'Avoid irritants like smoke and pollution',
      'Get adequate sleep for recovery',
      'Use gentle cough drops or lozenges',
      'Maintain good air quality at home'
    ],
    red_flags: [
      'Cough lasting more than 2 weeks',
      'Coughing up blood or rusty-colored sputum',
      'Severe shortness of breath',
      'Chest pain while coughing',
      'Signs of pneumonia (high fever + difficulty breathing)'
    ],
    first_aid: [
      'Gargle with warm salt water to soothe throat',
      'Use steam inhalation 2-3 times daily',
      'Keep humidifier running at night',
      'Avoid cold drinks and cold foods',
      'Do not suppress cough with medications if it helps clear phlegm'
    ],
    specialist_recommendation: 'Pulmonologist'
  },
  chestPain: {
    severity: 'Emergency',
    recommendations: [
      'Seek medical attention immediately - do not ignore chest pain',
      'If severe, call ambulance or go to nearest ER',
      'Rest and avoid strenuous activity',
      'Keep medications (if prescribed) handy',
      'Inform doctor about any previous heart conditions'
    ],
    red_flags: [
      'Severe crushing or pressing chest pain',
      'Pain radiating to arm, neck, or jaw',
      'Shortness of breath with chest pain',
      'Dizziness, nausea, or cold sweats',
      'Pain worse with exertion or lying down'
    ],
    first_aid: [
      'Sit or lie down immediately',
      'Try to relax and breathe slowly',
      'If prescribed, take aspirin (if not allergic)',
      'If available, use prescribed angina medication',
      'Call emergency services - do not wait'
    ],
    specialist_recommendation: 'Cardiologist'
  },
  headache: {
    severity: 'Home Care',
    recommendations: [
      'Rest in a quiet, dark room for 30 minutes to 1 hour',
      'Apply warm or cold compress to forehead as tolerated',
      'Take mild pain relief medication if needed',
      'Stay hydrated - dehydration often causes headaches',
      'Manage stress through relaxation or meditation'
    ],
    red_flags: [
      'Worst headache of your life',
      'Sudden severe headache with high fever',
      'Headache with stiff neck and sensitivity to light',
      'Headache with confusion or loss of consciousness',
      'Recurring severe headaches in new location'
    ],
    first_aid: [
      'Apply gentle pressure to temples or neck',
      'Try warm water massage on head and shoulders',
      'Ensure good sleep schedule',
      'Avoid bright screens and loud noises',
      'Try herbal tea with ginger or chamomile'
    ],
    specialist_recommendation: 'Neurologist'
  },
  abdominalPain: {
    severity: 'Consult Soon',
    recommendations: [
      'Rest and avoid heavy foods temporarily',
      'Drink clear fluids - water, coconut water, or diluted juice',
      'Avoid dairy, spicy, and oily foods',
      'Take antacids if pain is related to acidity',
      'Maintain good hygiene to prevent infection'
    ],
    red_flags: [
      'Severe abdominal pain that comes suddenly',
      'Pain with high fever (>101°F)',
      'Persistent vomiting preventing fluid intake',
      'Visible blood in stool or vomit',
      'Abdomen appears hard, swollen, or very tender'
    ],
    first_aid: [
      'Apply warm compress to abdomen for 10-15 minutes',
      'Massage gently in clockwise direction',
      'Sip ginger water or warm lemon water',
      'Avoid lying flat - use pillows for support',
      'Do not eat solid food until pain subsides'
    ],
    specialist_recommendation: 'Gastroenterologist'
  }
}

// Predefined symptoms with follow-up questions
const SYMPTOMS_DB = {
  fever: {
    name: 'Fever',
    icon: Thermometer,
    description: 'High body temperature',
    questions: [
      'For how many days have you had fever?',
      'Is the fever continuous or does it come and go?',
      'Are you experiencing chills or sweating?',
      'Do you have any other symptoms like cough or body aches?',
      'Have you taken any medicine? If yes, did it reduce the fever?'
    ]
  },
  cough: {
    name: 'Cough',
    icon: Wind,
    description: 'Persistent cough',
    questions: [
      'Is your cough dry or do you have phlegm?',
      'For how many days have you had this cough?',
      'Does the cough worsen at night or when lying down?',
      'Are you coughing up blood or any unusual color sputum?',
      'Do you have a sore throat or difficulty breathing?'
    ]
  },
  chestPain: {
    name: 'Chest Pain',
    icon: Heart,
    description: 'Chest discomfort or pain',
    questions: [
      'Where exactly is the pain located in your chest?',
      'On a scale of 1-10, how severe is the pain?',
      'Is the pain constant or does it come and go?',
      'Does the pain get worse with breathing or physical activity?',
      'Do you have shortness of breath along with the chest pain?'
    ]
  },
  headache: {
    name: 'Headache',
    icon: Brain,
    description: 'Head pain or migraines',
    questions: [
      'Where is the headache located - front, back, or entire head?',
      'Is this a throbbing pain or a constant pressure?',
      'How long have you had this headache?',
      'Are you experiencing nausea, vomiting, or sensitivity to light?',
      'Have you had any recent head injury or trauma?'
    ]
  },
  abdominalPain: {
    name: 'Abdominal Pain',
    icon: Activity,
    description: 'Stomach or belly pain',
    questions: [
      'Where exactly is the pain in your abdomen?',
      'On a scale of 1-10, how severe is the pain?',
      'When did the pain start and is it constant or intermittent?',
      'Are you experiencing nausea, vomiting, or changes in bowel movements?',
      'Have you eaten anything unusual or do you have any food allergies?'
    ]
  }
}

export default function SymptomChecker({ navigate }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [phase, setPhase] = useState('symptom-selection')
  const [selectedSymptom, setSelectedSymptom] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState([])
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

  const handleSelectSymptom = (symptomKey) => {
    setSelectedSymptom(symptomKey)
    setPhase('questions')
    setCurrentQuestionIndex(0)
    setAnswers([])
    
    const symptomName = SYMPTOMS_DB[symptomKey].name
    const firstQuestion = SYMPTOMS_DB[symptomKey].questions[0]
    
    setMessages([
      {
        type: 'bot',
        content: `I see you have ${symptomName}. Let me ask some follow-up questions to better understand your condition.`
      },
      {
        type: 'bot',
        content: firstQuestion
      }
    ])
  }

  const handleAnswerQuestion = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userAnswer = input.trim()
    const currentQuestion = SYMPTOMS_DB[selectedSymptom].questions[currentQuestionIndex]
    
    // Add user's answer to messages
    const newMessages = [...messages, {
      type: 'user',
      content: userAnswer
    }]
    
    // Save answer
    const newAnswers = [...answers, { question: currentQuestion, answer: userAnswer }]
    setAnswers(newAnswers)
    setMessages(newMessages)
    setInput('')
    
    // Check if there are more questions
    if (currentQuestionIndex < SYMPTOMS_DB[selectedSymptom].questions.length - 1) {
      // Ask next question
      const nextQuestion = SYMPTOMS_DB[selectedSymptom].questions[currentQuestionIndex + 1]
      setTimeout(() => {
        setMessages([...newMessages, {
          type: 'bot',
          content: nextQuestion
        }])
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      }, 500)
    } else {
      // All questions answered, analyze with AI
      analyzeSymptoms(newAnswers)
    }
  }

  const analyzeSymptoms = async (answersData) => {
    setLoading(true)
    setPhase('analyzing')
    
    // Use hardcoded analysis for MVP
    setTimeout(() => {
      const analysis = SYMPTOM_ANALYSIS[selectedSymptom]
      setResult(analysis)
      setPhase('result')
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'Based on your symptoms, here is my assessment:'
      }])
      setLoading(false)
    }, 1500) // Simulate thinking time
  }

  const handleSaveAndContinue = async () => {
    try {
      await fetch('http://localhost:5000/api/medical-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          type: 'symptom_check',
          result,
          messages,
          timestamp: new Date().toISOString()
        })
      })
      navigate('/dashboard')
    } catch (error) {
      console.error('Error saving:', error)
      alert('Error saving. Please try again.')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8FAFC',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
              <Stethoscope size={32} color="#0D9488" strokeWidth={2} />
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0D9488', margin: 0 }}>
                Symptom Checker
              </h1>
            </div>
            <p style={{ color: '#64748B', marginTop: '4px' }}>AI-powered health assessment</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'linear-gradient(135deg, #0D9488 0%, #10B981 100%)',
              color: 'white',
              padding: '10px 16px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(13, 148, 136, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Dashboard
          </button>
        </div>

        {/* Symptom Selection Phase */}
        {phase === 'symptom-selection' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E2E8F0'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0F172A', marginBottom: '16px' }}>
              Select your primary symptom:
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {Object.keys(SYMPTOMS_DB).map((key) => {
                const Icon = SYMPTOMS_DB[key].icon
                return (
                  <button
                    key={key}
                    onClick={() => handleSelectSymptom(key)}
                    style={{
                      padding: '16px',
                      background: 'white',
                      border: '2px solid #E2E8F0',
                      borderRadius: '12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontFamily: 'inherit'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#0D9488'
                      e.currentTarget.style.background = '#CCFBF1'
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(13, 148, 136, 0.2)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E2E8F0'
                      e.currentTarget.style.background = 'white'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Icon size={24} color="#0D9488" strokeWidth={2} />
                      <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0F172A' }}>
                        {SYMPTOMS_DB[key].name}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#64748B', marginLeft: '32px' }}>
                      {SYMPTOMS_DB[key].description}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Chat Container - Questions Phase */}
        {phase === 'questions' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '16px',
            minHeight: '400px',
            maxHeight: '500px',
            overflowY: 'auto',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E2E8F0'
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  marginBottom: '12px',
                  maxWidth: '70%',
                  wordWrap: 'break-word',
                  marginLeft: msg.type === 'user' ? 'auto' : '0',
                  marginRight: msg.type === 'user' ? '0' : 'auto',
                  background: msg.type === 'user' 
                    ? 'linear-gradient(135deg, #0D9488 0%, #10B981 100%)'
                    : '#CCFBF1',
                  color: msg.type === 'user' ? 'white' : '#0F172A',
                  borderLeft: msg.type === 'user' ? 'none' : '4px solid #0D9488',
                  animation: 'slideIn 0.3s ease-out'
                }}
              >
                {msg.content}
              </div>
            ))}
            
            {loading && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '10px',
                marginBottom: '12px',
                background: '#CCFBF1',
                color: '#0F172A',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                animation: 'slideIn 0.3s ease-out'
              }}>
                <div style={{
                  animation: 'spin 1s linear infinite',
                  fontSize: '1rem'
                }}>⏳</div>
                Analyzing your symptoms...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Answer Input Form */}
        {phase === 'questions' && !loading && (
          <form onSubmit={handleAnswerQuestion} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your answer..."
                autoFocus
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px solid #E2E8F0',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0D9488'
                  e.target.style.boxShadow = '0 0 0 3px rgba(13, 148, 136, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E2E8F0'
                  e.target.style.boxShadow = 'none'
                }}
              />
              <button
                type="submit"
                disabled={!input.trim()}
                style={{
                  background: !input.trim() 
                    ? '#CCCCCC'
                    : 'linear-gradient(135deg, #0D9488 0%, #10B981 100%)',
                  color: 'white',
                  padding: '12px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: !input.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(13, 148, 136, 0.2)'
                }}
                onMouseEnter={(e) => {
                  if (input.trim()) {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 6px 12px rgba(13, 148, 136, 0.3)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (input.trim()) {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 2px 8px rgba(13, 148, 136, 0.2)'
                  }
                }}
              >
                Send
              </button>
            </div>
          </form>
        )}

        {/* Results Chat Container */}
        {phase === 'result' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '16px',
            maxHeight: '500px',
            overflowY: 'auto',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E2E8F0'
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  marginBottom: '12px',
                  maxWidth: '70%',
                  wordWrap: 'break-word',
                  marginLeft: msg.type === 'user' ? 'auto' : '0',
                  marginRight: msg.type === 'user' ? '0' : 'auto',
                  background: msg.type === 'user' 
                    ? 'linear-gradient(135deg, #0D9488 0%, #10B981 100%)'
                    : '#CCFBF1',
                  color: msg.type === 'user' ? 'white' : '#0F172A',
                  borderLeft: msg.type === 'user' ? 'none' : '4px solid #0D9488',
                  animation: 'slideIn 0.3s ease-out'
                }}
              >
                {msg.content}
              </div>
            ))}

            {result && (
              <div style={{
                background: 'white',
                padding: '16px',
                borderRadius: '8px',
                marginTop: '16px',
                borderLeft: '4px solid #0D9488'
              }}>
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: '600', marginBottom: '8px' }}>
                    SEVERITY ASSESSMENT:
                  </p>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    borderRadius: '20px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    ...getSeverityStyle(result.severity)
                  }}>
                    {result.severity === 'Emergency' && <AlertTriangle size={18} />}
                    {result.severity === 'Consult Soon' && <AlertCircle size={18} />}
                    {(result.severity === 'Home Care' || result.severity === 'Monitor') && <CheckCircle size={18} />}
                    {result.severity}
                  </div>
                </div>

                {result.red_flags && result.red_flags.length > 0 && (
                  <div style={{ marginBottom: '16px', padding: '12px', background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '8px' }}>
                    <p style={{ color: '#DC2626', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle size={18} /> Red Flags Detected
                    </p>
                    <ul style={{ color: '#DC2626', fontSize: '0.875rem', margin: '0', paddingLeft: '26px' }}>
                      {result.red_flags.map((flag, i) => (
                        <li key={i} style={{ margin: '4px 0' }}>• {flag}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.recommendations && (
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontWeight: '600', color: '#0F172A', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle size={18} color="#0D9488" /> Recommendations
                    </p>
                    <ul style={{ color: '#64748B', fontSize: '0.875rem', margin: '0', paddingLeft: '26px' }}>
                      {result.recommendations.map((rec, i) => (
                        <li key={i} style={{ margin: '4px 0' }}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.first_aid && result.first_aid.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontWeight: '600', color: '#0F172A', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={18} color="#0D9488" /> First Aid
                    </p>
                    <ul style={{ color: '#64748B', fontSize: '0.875rem', margin: '0', paddingLeft: '26px' }}>
                      {result.first_aid.map((aid, i) => (
                        <li key={i} style={{ margin: '4px 0' }}>• {aid}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.specialist_recommendation && (
                  <div style={{ marginTop: '16px', padding: '12px', background: '#CCFBF1', border: '2px solid #0D9488', borderRadius: '8px' }}>
                    <p style={{ fontWeight: 'bold', color: '#0D9488', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle size={18} /> Recommended Specialist
                    </p>
                    <p style={{ color: '#0F172A', fontSize: '1rem', fontWeight: '600', marginLeft: '26px' }}>{result.specialist_recommendation}</p>
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Action Buttons - Result Phase */}
        {result && phase === 'result' && (
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <button
              onClick={handleSaveAndContinue}
              style={{
                flex: 1,
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #0D9488 0%, #10B981 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(13, 148, 136, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 8px 16px rgba(13, 148, 136, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 4px 12px rgba(13, 148, 136, 0.2)'
              }}
            >
              Save & Continue to Dashboard
            </button>
            <button
              onClick={() => {
                setMessages([])
                setResult(null)
                setAnswers([])
                setSelectedSymptom(null)
                setCurrentQuestionIndex(0)
                setPhase('symptom-selection')
              }}
              style={{
                flex: 1,
                padding: '12px 24px',
                background: 'white',
                color: '#0D9488',
                border: '2px solid #0D9488',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#CCFBF1'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white'
              }}
            >
              Check Another Symptom
            </button>
          </div>
        )}

        <style>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </div>
  )
}

function getSeverityStyle(severity) {
  switch (severity) {
    case 'Emergency':
      return {
        background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
        color: '#DC2626'
      }
    case 'Consult Soon':
      return {
        background: 'linear-gradient(135deg, #FEF3C7 0%, #FCD34D 100%)',
        color: '#F59E0B'
      }
    case 'Home Care':
      return {
        background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
        color: '#0284C7'
      }
    case 'Monitor':
      return {
        background: 'linear-gradient(135deg, #DCFCE7 0%, #BBFB9B 100%)',
        color: '#10B981'
      }
    default:
      return {
        background: 'linear-gradient(135deg, #DCFCE7 0%, #BBFB9B 100%)',
        color: '#10B981'
      }
  }
}
