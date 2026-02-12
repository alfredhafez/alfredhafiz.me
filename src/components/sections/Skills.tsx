import { motion } from 'framer-motion'
import { 
  Server, 
  ShoppingCart, 
  Wrench,
  FileCode,
  Globe,
  Layers,
  Cpu,
  Cloud,
  GitBranch,
  Terminal
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const skillCategories = [
  {
    title: 'Frontend Development',
    icon: Globe,
    color: 'from-blue-500 to-cyan-400',
    skills: [
      { name: 'React', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'JavaScript', level: 95 },
      { name: 'Vite', level: 85 },
      { name: 'Tailwind CSS', level: 90 },
      { name: 'HTML5/CSS3', level: 95 },
    ]
  },
  {
    title: 'Backend Development',
    icon: Server,
    color: 'from-purple-500 to-pink-400',
    skills: [
      { name: 'PHP', level: 95 },
      { name: 'Python', level: 85 },
      { name: 'CodeIgniter', level: 90 },
      { name: 'REST APIs', level: 90 },
      { name: 'MySQL', level: 85 },
      { name: 'API Integration', level: 90 },
    ]
  },
  {
    title: 'CMS & eCommerce',
    icon: ShoppingCart,
    color: 'from-orange-500 to-red-400',
    skills: [
      { name: 'WordPress', level: 95 },
      { name: 'WooCommerce', level: 90 },
      { name: 'Shopify', level: 85 },
      { name: 'Custom Plugins', level: 95 },
      { name: 'Theme Development', level: 90 },
      { name: 'CMS Architecture', level: 85 },
    ]
  },
  {
    title: 'Tools & Technologies',
    icon: Wrench,
    color: 'from-green-500 to-emerald-400',
    skills: [
      { name: 'Git & GitHub', level: 90 },
      { name: 'Server Management', level: 85 },
      { name: 'cPanel/WHM', level: 90 },
      { name: 'Performance Optimization', level: 90 },
      { name: 'Database Management', level: 85 },
      { name: 'Deployment & CI/CD', level: 80 },
    ]
  }
]

const additionalSkills = [
  { name: 'Custom Plugin Development', icon: FileCode },
  { name: 'Theme Development', icon: Layers },
  { name: 'API Development', icon: Cpu },
  { name: 'Cloud Deployment', icon: Cloud },
  { name: 'Version Control', icon: GitBranch },
  { name: 'Server Administration', icon: Terminal },
]

export default function Skills() {
  return (
    <section id="skills" className="py-24 md:py-32 bg-[#0c1120] relative">
      {/* Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z' fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}
      />

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
            My Expertise
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Skills &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Technologies
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A comprehensive toolkit of modern technologies and frameworks that I use to build 
            scalable, high-performance web applications.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: categoryIndex * 0.1, duration: 0.5 }}
            >
              <Card className="bg-[#0f1623] border-white/10 overflow-hidden h-full hover:border-white/20 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{category.title}</h3>
                  </div>

                  <div className="space-y-4">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skill.name}>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-300 text-sm">{skill.name}</span>
                          <span className="text-gray-500 text-sm">{skill.level}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: skillIndex * 0.1 + 0.3, duration: 0.8, ease: 'easeOut' }}
                            className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Advanced Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h3 className="text-2xl font-bold text-white mb-2">Advanced Specializations</h3>
          <p className="text-gray-400">Core competencies that set me apart</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {additionalSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="bg-[#0f1623] border border-white/10 rounded-xl p-4 flex flex-col items-center gap-3 hover:border-blue-500/30 hover:bg-[#131b2d] transition-all cursor-default"
            >
              <skill.icon className="w-8 h-8 text-blue-400" />
              <span className="text-gray-300 text-sm font-medium text-center">{skill.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}