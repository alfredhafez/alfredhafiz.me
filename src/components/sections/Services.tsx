import { motion } from 'framer-motion'
import { 
  Globe, 
  Puzzle, 
  ShoppingCart, 
  Cpu, 
  Zap,
  ArrowRight,
  CheckCircle2
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const services = [
  {
    icon: Globe,
    title: 'Custom Web Application Development',
    description: 'End-to-end development of scalable web applications using modern technologies like React, Node.js, and Python. From concept to deployment, I build solutions tailored to your business needs.',
    features: [
      'Full-stack development',
      'Scalable architecture',
      'Modern tech stack',
      'API development',
      'Database design'
    ],
    color: 'from-blue-500 to-cyan-400',
    popular: true
  },
  {
    icon: Puzzle,
    title: 'WordPress Plugin & Theme Development',
    description: 'Custom WordPress solutions built from scratch. I create powerful plugins and themes that extend WordPress functionality beyond standard capabilities.',
    features: [
      'Custom plugin development',
      'Theme customization',
      'Gutenberg blocks',
      'WooCommerce extensions',
      'Performance optimization'
    ],
    color: 'from-purple-500 to-pink-400',
    popular: false
  },
  {
    icon: ShoppingCart,
    title: 'Shopify & WooCommerce Customization',
    description: 'Expert e-commerce development for Shopify and WooCommerce platforms. Custom features, integrations, and optimizations to maximize your online sales.',
    features: [
      'Custom storefronts',
      'Payment integration',
      'Inventory management',
      'Custom checkout flows',
      'Third-party integrations'
    ],
    color: 'from-orange-500 to-red-400',
    popular: false
  },
  {
    icon: Cpu,
    title: 'API Development & Integration',
    description: 'Build robust REST APIs and integrate third-party services into your applications. Seamless data flow between systems for enhanced functionality.',
    features: [
      'REST API development',
      'Third-party integrations',
      'Authentication systems',
      'API documentation',
      'Rate limiting & security'
    ],
    color: 'from-green-500 to-emerald-400',
    popular: false
  },
  {
    icon: Zap,
    title: 'Performance Optimization & Bug Fixing',
    description: 'Optimize your existing applications for speed, reliability, and user experience. Identify and resolve issues that impact performance.',
    features: [
      'Speed optimization',
      'Code refactoring',
      'Database optimization',
      'Security audits',
      'Bug resolution'
    ],
    color: 'from-yellow-500 to-orange-400',
    popular: false
  }
]

export default function Services() {
  const scrollToContact = () => {
    const element = document.querySelector('#contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="services" className="py-24 md:py-32 bg-[#0c1120] relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-blue-500/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4 block">
            What I Offer
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            My{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Services
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Comprehensive web development services tailored to help your business succeed online. 
            From custom applications to e-commerce solutions, I've got you covered.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className={`
                bg-[#0f1623] border-white/10 overflow-hidden h-full group
                hover:border-blue-500/30 transition-all duration-500 relative
                ${service.popular ? 'ring-2 ring-blue-500/20' : ''}
              `}>
                {service.popular && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                    Popular
                  </div>
                )}
                
                <CardContent className="p-6 flex flex-col h-full">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 flex-1 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    onClick={scrollToContact}
                    variant="outline"
                    className="w-full border-white/10 text-gray-300 hover:text-white hover:bg-white/10 group/btn"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Custom Solution CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Need Something Custom?
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto mb-6">
              Every business is unique. If you have specific requirements or a complex project in mind, 
              let's discuss how I can help bring your vision to life.
            </p>
            <Button
              size="lg"
              onClick={scrollToContact}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              Let's Talk About Your Project
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}