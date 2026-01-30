import React, { useState } from 'react'
import Landing from './pages/Landing'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import SymptomChecker from './pages/SymptomChecker'
import Dashboard from './pages/Dashboard'
import MedicalHistory from './pages/MedicalHistory'
import DoctorConnect from './pages/DoctorConnect'

// Simple routing without react-router
function App() {
  const [currentPage, setCurrentPage] = useState('/')
  
  const navigate = (path) => {
    setCurrentPage(path)
    window.scrollTo(0, 0)
  }

  return (
    <>
      {currentPage === '/' && <Landing navigate={navigate} />}
      {currentPage === '/login' && <Login navigate={navigate} />}
      {currentPage === '/signup' && <SignUp navigate={navigate} />}
      {currentPage === '/symptom-checker' && <SymptomChecker navigate={navigate} />}
      {currentPage === '/dashboard' && <Dashboard navigate={navigate} />}
      {currentPage === '/medical-history' && <MedicalHistory navigate={navigate} />}
      {currentPage === '/doctor-connect' && <DoctorConnect navigate={navigate} />}
    </>
  )
}

export default App
