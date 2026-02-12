import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Mail, Terminal, Code, Cpu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import RippleEffect from '@/components/RippleEffect'

export default function Hero() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const codeSnippets = [
    { icon: Terminal, text: 'npm run dev', color: 'text-green-400' },
    { icon: Code, text: 'const dev = new Developer()', color: 'text-blue-400' },
    { icon: Cpu, text: 'Building...', color: 'text-purple-400' },
  ]

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0e17]">
      {/* Ripple Effect Canvas */}
      <RippleEffect />
      
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-3xl"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Additional floating orbs */}
        <motion.div 
          className="absolute top-1/3 right-1/3 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl"
          animate={{
            y: [0, -50, 0],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Animated Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(56, 189, 248, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Code Matrix Rain Effect (Subtle) */}
      <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-cyan-400 text-xs font-mono whitespace-nowrap"
            style={{
              left: `${Math.random() * 100}%`,
              top: -20,
            }}
            animate={{
              y: ['0vh', '100vh'],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear"
            }}
          >
            {Array.from({ length: 15 }).map((_, j) => (
              <div key={j}>{Math.random() > 0.5 ? '1' : '0'}</div>
            ))}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Code-style Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8 font-mono"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-blue-400 text-sm">
              <span className="text-purple-400">const</span>
              <span className="text-white"> status</span>
              <span className="text-blue-400"> = </span>
              <span className="text-green-400">"available"</span>
            </span>
          </motion.div>

          {/* Main Headline with Code Style */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight tracking-tight"
          >
            <span className="block mb-2">
              <span className="text-gray-500">&lt;</span>
              <span className="text-cyan-400">Developer</span>
              <span className="text-gray-500">&gt;</span>
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 animate-gradient">
              Full-Stack Web & App
            </span>
            <span className="block mt-2">
              <span className="text-gray-500">&lt;/</span>
              <span className="text-cyan-400">Developer</span>
              <span className="text-gray-500">&gt;</span>
            </span>
          </motion.h1>

          {/* Animated Code Snippets */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            {codeSnippets.map((snippet, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs sm:text-sm font-mono"
              >
                <snippet.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${snippet.color}`} />
                <span className="text-gray-300">{snippet.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed px-4"
          >
            I craft <span className="text-cyan-400 font-mono">clean</span>,{' '}
            <span className="text-purple-400 font-mono">scalable</span>, and{' '}
            <span className="text-pink-400 font-mono">performance-focused</span> web applications 
            that help businesses grow.
          </motion.p>

          {/* CTA Buttons with Glow Effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 px-4"
          >
            <Button
              size="lg"
              onClick={() => scrollToSection('#projects')}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base sm:text-lg rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:shadow-blue-600/40 hover:scale-105 font-mono group"
            >
              <span className="mr-2">&gt;</span>
              View_Projects
              <span className="ml-1 animate-pulse">_</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('#contact')}
              className="w-full sm:w-auto border-gray-600 text-white hover:bg-white/10 hover:border-cyan-500/50 px-8 py-6 text-base sm:text-lg rounded-xl transition-all hover:scale-105 font-mono group"
            >
              <span className="mr-2 text-cyan-400 group-hover:text-cyan-300">$</span>
              Contact_Me
              <span className="ml-1 animate-pulse">_</span>
            </Button>
          </motion.div>

          {/* Social Links with Enhanced Styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex items-center justify-center gap-3 sm:gap-4"
          >
            {[
              { icon: Github, href: '#', label: 'GitHub', color: 'hover:text-purple-400' },
              { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-400' },
              { icon: Mail, href: 'mailto:ask@alfredhafiz.me', label: 'Email', color: 'hover:text-pink-400' },
            ].map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 ${social.color} hover:bg-white/10 hover:border-white/20 transition-all duration-300`}
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-gray-500"
          >
            <span className="text-xs uppercase tracking-widest font-mono">scroll.down()</span>
            <ArrowDown className="w-4 h-4" />
          </motion.div>
        </motion.div>

        {/* Corner Decorations */}
        <div className="absolute top-20 left-4 sm:left-8 text-xs sm:text-sm text-gray-600 font-mono hidden sm:block">
          <div>// Initialize</div>
          <div>// Portfolio v2.0</div>
        </div>
        
        <div className="absolute top-20 right-4 sm:right-8 text-xs sm:text-sm text-gray-600 font-mono hidden sm:block text-right">
          <div>&lt;React /&gt;</div>
          <div>&lt;TypeScript /&gt;</div>
        </div>
      </div>
    </section>
  )
}
