import { motion } from 'framer-motion'
import { Code2, Lightbulb, Rocket, Users, Terminal } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: Code2,
    title: 'Clean_Code',
    description: 'Writing maintainable, scalable code with best practices and modern standards.'
  },
  {
    icon: Lightbulb,
    title: 'Problem_Solver',
    description: 'Turning complex challenges into elegant, efficient solutions.'
  },
  {
    icon: Rocket,
    title: 'Performance_First',
    description: 'Optimizing applications for speed, scalability, and user experience.'
  },
  {
    icon: Users,
    title: 'Client_Centric',
    description: 'Understanding business needs to deliver solutions that drive results.'
  }
]

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-[#0a0e17] relative overflow-hidden font-mono">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/5 to-transparent" />
      
      {/* Code Decorations */}
      <div className="absolute top-20 left-4 sm:left-8 text-xs text-gray-700 hidden lg:block">
        <div>class Developer {'{'}</div>
        <div className="ml-4">constructor() {'{'}</div>
      </div>
      
      <div className="absolute bottom-20 right-4 sm:right-8 text-xs text-gray-700 hidden lg:block text-right">
        <div>{'}'}</div>
        <div>{'}'}</div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">
                // About_Me
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              <span className="text-gray-500">&lt;</span>
              Developer
              <span className="text-gray-500">&gt;</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Building_Solutions
              </span>
              <br />
              <span className="text-gray-500">&lt;/</span>
              Developer
              <span className="text-gray-500">&gt;</span>
            </h2>
            <div className="space-y-4 text-gray-400 text-base sm:text-lg leading-relaxed">
              <p>
                <span className="text-purple-400">const</span>{' '}
                <span className="text-cyan-400">alfred</span> = {'{'}
                <br />
                <span className="ml-4 text-blue-400">role:</span>{' '}
                <span className="text-green-400">"Full-Stack Developer"</span>,
                <br />
                <span className="ml-4 text-blue-400">experience:</span>{' '}
                <span className="text-orange-400">5+</span>,
                <br />
                <span className="ml-4 text-blue-400">passion:</span>{' '}
                <span className="text-green-400">"Building scalable solutions"</span>
                <br />
                {'}'}
              </p>
              <p className="text-gray-400">
                I specialize in custom WordPress plugin development, theme creation, and building 
                scalable web applications using React, PHP, Python, and modern frameworks.
              </p>
              <p className="text-gray-400">
                <span className="text-cyan-400">return</span>{' '}
                <span className="text-green-400">"Clean, maintainable code that drives results"</span>
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-10">
              {[
                { number: '5+', label: 'Years', sublabel: 'experience' },
                { number: '50+', label: 'Projects', sublabel: 'completed' },
                { number: '30+', label: 'Happy', sublabel: 'clients' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="text-center p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-xs sm:text-sm text-gray-500">{stat.label}</div>
                  <div className="text-xs text-gray-600">{stat.sublabel}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="bg-[#0f1623] border-white/10 hover:border-blue-500/30 transition-all duration-300 group h-full hover:shadow-lg hover:shadow-blue-500/10">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2 font-mono">{feature.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}