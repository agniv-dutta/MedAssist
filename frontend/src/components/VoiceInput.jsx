// src/components/VoiceInput.jsx
import React, { useState, useRef } from 'react'

export default function VoiceInput({ onTranscript, placeholder = "Click microphone to speak..." }) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef(null)

  const startListening = () => {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in your browser')
      return
    }

    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.lang = 'en-IN' // India English
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = true

    recognitionRef.current.onstart = () => {
      setIsListening(true)
      setTranscript('')
    }

    recognitionRef.current.onresult = (event) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          setTranscript(prev => prev + t + ' ')
          if (onTranscript) {
            onTranscript(prev => prev + t + ' ')
          }
        } else {
          interim += t
        }
      }
    }

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      alert('Error: ' + event.error)
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current.start()
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`px-4 py-2 rounded-lg font-semibold transition ${
          isListening
            ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        title="Click to use voice input"
      >
        {isListening ? '⏹️ Stop Recording' : '🎤 Voice Input'}
      </button>
      {transcript && (
        <div className="text-sm text-gray-600 px-2 py-1 bg-gray-100 rounded">
          {transcript}
        </div>
      )}
    </div>
  )
}
