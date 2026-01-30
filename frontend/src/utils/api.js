import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  }
})

export const analyzeSymptoms = async (userId, symptoms, conversationHistory) => {
  try {
    const response = await api.post('/analyze-symptoms', {
      userId,
      symptoms,
      conversationHistory
    })
    return response.data
  } catch (error) {
    console.error('Error analyzing symptoms:', error)
    throw error
  }
}

export const saveMedicalHistory = async (userId, data) => {
  try {
    const response = await api.post('/medical-history/save', {
      userId,
      data
    })
    return response.data
  } catch (error) {
    console.error('Error saving medical history:', error)
    throw error
  }
}

export const getMedicalHistory = async (userId) => {
  try {
    const response = await api.get(`/medical-history/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching medical history:', error)
    throw error
  }
}

export const getAvailableDoctors = async (location) => {
  try {
    const response = await api.get('/doctors/available', { params: { location } })
    return response.data
  } catch (error) {
    console.error('Error fetching doctors:', error)
    throw error
  }
}

export const bookAppointment = async (userId, doctorId, timeSlot) => {
  try {
    const response = await api.post('/appointment/book', {
      userId,
      doctorId,
      timeSlot
    })
    return response.data
  } catch (error) {
    console.error('Error booking appointment:', error)
    throw error
  }
}

export default api
