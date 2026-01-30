import React from 'react'
import { Activity, FileText, Users, Stethoscope } from 'lucide-react'

export default function Landing({ navigate }) {
  React.useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (userId) {
      navigate('/dashboard')
    }
  }, [navigate])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0D9488 0%, #10B981 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '900px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>
            <Stethoscope size={80} color="white" />
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
            MedAssist
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', marginBottom: '8px' }}>
            AI-Powered Rural Healthcare Bridge
          </p>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)' }}>
            Quality healthcare at your fingertips
          </p>
        </div>

        <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.95)', marginBottom: '32px', lineHeight: '1.6' }}>
          Access quality healthcare advice anytime, anywhere. Our AI assistant helps with:
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
              <Activity size={40} color="#0D9488" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0F172A', marginBottom: '8px' }}>
              Symptom Checker
            </h3>
            <p style={{ color: '#64748B' }}>
              Describe your symptoms and get instant AI-powered triage assessment
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.95)',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
              <FileText size={40} color="#0D9488" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0F172A', marginBottom: '8px' }}>
              Medical History
            </h3>
            <p style={{ color: '#64748B' }}>
              Track your health records and medications in one secure place
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.95)',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
              <Activity size={40} color="#0D9488" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0F172A', marginBottom: '8px' }}>
              Medication Reminders
            </h3>
            <p style={{ color: '#64748B' }}>
              Never miss a dose with smart reminder notifications
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.95)',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
              <Users size={40} color="#0D9488" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0F172A', marginBottom: '8px' }}>
              Doctor Connect
            </h3>
            <p style={{ color: '#64748B' }}>
              Book appointments with qualified doctors for consultation
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.95)',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
              <Stethoscope size={40} color="#0D9488" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0F172A', marginBottom: '8px' }}>
              Health Education
            </h3>
            <p style={{ color: '#64748B' }}>
              Learn about diseases, prevention, and healthy living
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.95)',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
              <Activity size={40} color="#0D9488" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0F172A', marginBottom: '8px' }}>
              Emergency Hotline
            </h3>
            <p style={{ color: '#64748B' }}>
              Quick access to emergency contacts and first-aid guidance
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
          <button
            onClick={() => navigate('/signup')}
            style={{
              background: 'white',
              color: '#0D9488',
              padding: '16px 32px',
              borderRadius: '8px',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            Create Account →
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '8px',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: 'pointer',
              border: '2px solid white',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.3)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)'
            }}
          >
            Sign In
          </button>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.85)' }}>
          🔒 Secure • ✨ Free • 🕐 Available 24/7
        </p>
      </div>
    </div>
  )
}
