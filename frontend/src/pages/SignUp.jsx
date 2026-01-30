import React, { useState } from 'react'

export default function SignUp({ navigate }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          age: formData.age,
          gender: formData.gender
        })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('userId', data.userId)
        localStorage.setItem('userProfile', JSON.stringify(data.profile))
        navigate('/dashboard')
      } else {
        setError(data.message || 'Sign up failed')
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0D9488 0%, #10B981 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        maxWidth: '450px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#0D9488', marginBottom: '8px' }}>
            🏥 MedAssist
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>Create Your Health Account</p>
        </div>

        {error && (
          <div style={{
            background: '#FEE2E2',
            border: '1px solid #FECACA',
            color: '#DC2626',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#0F172A',
              marginBottom: '6px'
            }}>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #E2E8F0',
                borderRadius: '8px',
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
              placeholder="John Doe"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#0F172A',
              marginBottom: '6px'
            }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #E2E8F0',
                borderRadius: '8px',
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
              placeholder="your@email.com"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#0F172A',
              marginBottom: '6px'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #E2E8F0',
                borderRadius: '8px',
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
              placeholder="••••••••"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#0F172A',
              marginBottom: '6px'
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #E2E8F0',
                borderRadius: '8px',
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
              placeholder="••••••••"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: '#0F172A',
                marginBottom: '6px'
              }}>
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="1"
                max="120"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #E2E8F0',
                  borderRadius: '8px',
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
                placeholder="25"
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: '#0F172A',
                marginBottom: '6px'
              }}>
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #E2E8F0',
                  borderRadius: '8px',
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
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 24px',
              background: loading ? '#999999' : 'linear-gradient(135deg, #0D9488 0%, #10B981 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(13, 148, 136, 0.2)'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 8px 16px rgba(13, 148, 136, 0.3)')}
            onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = '0 4px 12px rgba(13, 148, 136, 0.2)')}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: '12px' }}>
            Already have an account?
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: '#F0F9FF',
              color: '#0D9488',
              border: '2px solid #0D9488',
              padding: '10px 24px',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#CCFBF1'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#F0F9FF'
            }}
          >
            Login Here
          </button>
        </div>
      </div>
    </div>
  )
}
