import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare,
  Github,
  Linkedin,
  Twitter,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Terminal
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'ask@alfredhafiz.me',
    href: 'mailto:ask@alfredhafiz.me',
    color: 'from-blue-500 to-cyan-400'
  },
  {
    icon: Phone,
    label: 'WhatsApp',
    value: '+880 1944-003260',
    href: 'https://wa.me/8801944003260',
    color: 'from-green-500 to-emerald-400'
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Dhaka, Bangladesh',
    href: '#',
    color: 'from-orange-500 to-red-400'
  }
]

const socialLinks = [
  { icon: Github, label: 'GitHub', href: '#', color: 'hover:text-white' },
  { icon: Linkedin, label: 'LinkedIn', href: '#', color: 'hover:text-blue-400' },
  { icon: Twitter, label: 'Twitter', href: '#', color: 'hover:text-sky-400' },
]

// API URL - change this to your backend URL when deployed
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      // First, store message in Supabase
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            status: 'unread',
            is_read: false,
          }
        ])

      if (dbError) {
        console.error('Supabase error:', dbError)
        // Continue anyway to try email delivery
      }

      // Then, send email via backend API (if configured)
      if (API_URL && API_URL !== 'http://localhost:3001') {
        try {
          const response = await fetch(`${API_URL}/api/contact`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          })

          if (!response.ok) {
            console.warn('Email service returned error, but message was saved to database')
          }
        } catch (emailErr) {
          console.warn('Email service unavailable, but message was saved to database')
        }
      }

      setIsSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      console.error('Contact form error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  return (
    <section id="contact" className="py-24 md:py-32 bg-[#0a0e17] relative font-mono">
      {/* Background */}
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-blue-500/5 to-transparent" />
      
      {/* Code decorations */}
      <div className="absolute top-20 left-4 sm:left-8 text-xs text-gray-800 hidden lg:block">
        <div>async function sendMessage() {'{'}</div>
        <div className="ml-4">await contact.submit();</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">
              // Get_In_Touch
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            <span className="text-gray-500">&lt;</span>
            Let_s_Work_Together
            <span className="text-gray-500">/&gt;</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            <span className="text-purple-400">await</span>{' '}
            <span className="text-cyan-400"> collaboration</span>.
            <span className="text-blue-400">initiate</span>({'{'}
            <span className="text-green-400">"Your Project"</span>
            {'}'})
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {contactInfo.map((info, index) => (
              <motion.a
                key={info.label}
                href={info.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="block"
              >
                <Card className="bg-[#0f1623] border-white/10 hover:border-blue-500/30 transition-all duration-300 group">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">{info.label}</p>
                      <p className="text-white font-medium group-hover:text-blue-400 transition-colors font-mono text-sm">
                        {info.value}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.a>
            ))}

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="pt-4"
            >
              <p className="text-gray-500 text-sm mb-4 font-mono">// Follow me on</p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 rounded-xl bg-[#0f1623] border border-white/10 flex items-center justify-center text-gray-400 ${social.color} transition-colors`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-[#0f1623] border-white/10">
              <CardContent className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center py-12"
                    >
                      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2 font-mono">
                        Message_Sent!
                      </h3>
                      <p className="text-gray-400">
                        Thank you for reaching out. I&apos;ll get back to you within 24 hours.
                      </p>
                      <div className="mt-6 text-sm text-gray-500 font-mono">
                        status: <span className="text-green-400">200 OK</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      {/* Error Message */}
                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400"
                          >
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-gray-300 text-sm font-medium font-mono">
                            <span className="text-purple-400">const</span> name
                          </label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="bg-[#0a0e17] border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-blue-500/20 font-mono"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-gray-300 text-sm font-medium font-mono">
                            <span className="text-purple-400">const</span> email
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            className="bg-[#0a0e17] border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-blue-500/20 font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-gray-300 text-sm font-medium font-mono">
                          <span className="text-purple-400">const</span> subject
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Project Inquiry"
                          className="bg-[#0a0e17] border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-blue-500/20 font-mono"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="message" className="text-gray-300 text-sm font-medium font-mono">
                          <span className="text-purple-400">const</span> message
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell me about your project..."
                          rows={5}
                          className="bg-[#0a0e17] border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-blue-500/20 resize-none font-mono"
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 font-mono group"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                            <span className="mr-1">&gt;</span>
                            Send_Message()
                          </>
                        )}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick WhatsApp CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 mb-4 font-mono">// Prefer a quick chat?</p>
          <a
            href="https://wa.me/8801944003260"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors font-mono"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Chat_on_WhatsApp()</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
