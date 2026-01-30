// src/components/LanguageToggle.jsx
import React, { useState, useEffect } from 'react'

export default function LanguageToggle() {
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en'
    setLanguage(savedLang)
  }, [])

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en'
    setLanguage(newLang)
    localStorage.setItem('language', newLang)
    window.location.reload() // Reload to apply language changes
  }

  return (
    <button
      onClick={toggleLanguage}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'linear-gradient(135deg, #0D9488 0%, #10B981 100%)',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        zIndex: 1000,
        fontWeight: '600',
        fontSize: '0.9rem',
        boxShadow: '0 2px 8px rgba(13, 148, 136, 0.3)',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)'
        e.target.style.boxShadow = '0 4px 12px rgba(13, 148, 136, 0.4)'
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)'
        e.target.style.boxShadow = '0 2px 8px rgba(13, 148, 136, 0.3)'
      }}
      title={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
    >
      🌐 {language === 'en' ? 'हिंदी' : 'English'}
    </button>
  )
}
