import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'sonner'
import Navigation from './components/Navigation'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Projects from './components/sections/Projects'
import Services from './components/sections/Services'
import Contact from './components/sections/Contact'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import { AdminLogin } from './components/admin/AdminLogin'
import { AdminLayout } from './components/admin/AdminLayout'
import { AdminDashboard } from './components/admin/AdminDashboard'
import { ProtectedRoute } from './components/admin/ProtectedRoute'

// Main Portfolio Site
function Portfolio() {
  useEffect(() => {
    const handleScroll = () => {}
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0e17] overflow-x-hidden selection:bg-cyan-500/30">
      {/* Custom cursor on all pages */}
      <CustomCursor />
      <Navigation />
      
      <main>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Services />
          <Contact />
        </motion.div>
      </main>
      
      <Footer />
    </div>
  )
}

import { MessagesPage } from './components/admin/MessagesPage';
import { SettingsPage } from './components/admin/SettingsPage';



  // Activity Log Component (placeholder for now)
function ActivityPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Activity Log</h1>
      <p className="text-muted-foreground">Activity log coming soon...</p>
    </div>
  )
}

// Main App Component
function AppContent() {
  return (
    <>
      <Router>
        <Routes>
          {/* Main Portfolio Site */}
          <Route path="/" element={<Portfolio />} />
          
          {/* Admin Login - Hidden URL */}
          <Route path="/secret-admin-login" element={<AdminLogin />} />
          
          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/messages" element={<MessagesPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
              <Route path="/admin/activity" element={<ActivityPage />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
          </Route>
          
          {/* Catch all - redirect to portfolio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-right" richColors />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
