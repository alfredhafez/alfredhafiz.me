import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Code2, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navLinks = [
  { name: 'Home', href: '#home', num: '01' },
  { name: 'About', href: '#about', num: '02' },
  { name: 'Skills', href: '#skills', num: '03' },
  { name: 'Projects', href: '#projects', num: '04' },
  { name: 'Services', href: '#services', num: '05' },
  { name: 'Contact', href: '#contact', num: '06' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      
      // Determine active section
      const sections = navLinks.map(link => link.href.replace('#', ''))
      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-mono ${
          scrolled 
            ? 'bg-[#0a0e17]/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-white/5' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.a
              href="#home"
              onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }}
              className="flex items-center gap-2 text-white font-bold text-lg sm:text-xl group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-shadow">
                <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="hidden sm:inline">
                <span className="text-gray-400">&lt;</span>
                Alfred
                <span className="text-blue-400">Hafiz</span>
                <span className="text-gray-400">/&gt;</span>
              </span>
              <span className="sm:hidden text-sm">
                <span className="text-blue-400">AH</span>
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Button
                  key={link.name}
                  variant="ghost"
                  onClick={() => scrollToSection(link.href)}
                  className={`relative text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all font-mono text-sm group ${
                    activeSection === link.href.replace('#', '') ? 'text-cyan-400' : ''
                  }`}
                >
                  <span className="text-blue-400/50 mr-1">{link.num}.</span>
                  {link.name}
                  {activeSection === link.href.replace('#', '') && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full"
                    />
                  )}
                </Button>
              ))}
              <Button
                onClick={() => scrollToSection('#contact')}
                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-6 font-mono group"
              >
                <Terminal className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                Hire_Me
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-[280px] bg-[#0f1623] border-l border-white/10 p-6 pt-24 font-mono"
            >
              {/* Mobile Menu Header */}
              <div className="mb-8 pb-4 border-b border-white/10">
                <div className="text-xs text-gray-500 mb-1">// Navigation</div>
                <div className="text-cyan-400 text-sm">Menu.open()</div>
              </div>
              
              <div className="flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Button
                      variant="ghost"
                      onClick={() => scrollToSection(link.href)}
                      className={`w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 py-4 font-mono ${
                        activeSection === link.href.replace('#', '') ? 'text-cyan-400' : ''
                      }`}
                    >
                      <span className="text-blue-400/50 mr-3">{link.num}</span>
                      <span className="text-lg">{link.name}</span>
                      {activeSection === link.href.replace('#', '') && (
                        <span className="ml-auto text-cyan-400">←</span>
                      )}
                    </Button>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="mt-4 pt-4 border-t border-white/10"
                >
                  <Button
                    onClick={() => scrollToSection('#contact')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 font-mono"
                  >
                    <Terminal className="w-4 h-4 mr-2" />
                    Hire_Me()
                  </Button>
                </motion.div>
              </div>
              
              {/* Mobile Menu Footer */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-xs text-gray-600 border-t border-white/5 pt-4">
                  <div className="flex justify-between">
                    <span>// v2.0.0</span>
                    <span className="text-green-400">● online</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
