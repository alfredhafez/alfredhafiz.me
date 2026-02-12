import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, Eye, Code2, Folder } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge-shadcn'

const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'A full-featured e-commerce platform built with React and Node.js. Includes real-time inventory, payment processing, and admin dashboard.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    category: 'Web Application',
    tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    liveUrl: '#',
    githubUrl: '#',
    featured: true
  },
  {
    id: 2,
    title: 'WordPress Custom Plugin',
    description: 'Advanced membership and content protection plugin with subscription management, drip content, and analytics dashboard.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
    category: 'WordPress Plugin',
    tech: ['PHP', 'WordPress', 'MySQL', 'REST API'],
    liveUrl: '#',
    githubUrl: '#',
    featured: true
  },
  {
    id: 3,
    title: 'SaaS Dashboard',
    description: 'Modern SaaS analytics dashboard with real-time data visualization, user management, and role-based access control.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    category: 'Web Application',
    tech: ['React', 'TypeScript', 'D3.js', 'Firebase'],
    liveUrl: '#',
    githubUrl: '#',
    featured: true
  },
  {
    id: 4,
    title: 'API Integration Hub',
    description: 'Centralized API management platform connecting multiple third-party services with unified authentication and rate limiting.',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
    category: 'Backend',
    tech: ['Python', 'FastAPI', 'Redis', 'Docker'],
    liveUrl: '#',
    githubUrl: '#',
    featured: false
  },
  {
    id: 5,
    title: 'WooCommerce Extension',
    description: 'Custom WooCommerce extension for advanced product customization with 3D preview and dynamic pricing.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop',
    category: 'eCommerce',
    tech: ['PHP', 'WooCommerce', 'JavaScript', 'Three.js'],
    liveUrl: '#',
    githubUrl: '#',
    featured: false
  },
  {
    id: 6,
    title: 'Portfolio CMS',
    description: 'Headless CMS built for creative professionals with drag-drop page builder and automatic image optimization.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    category: 'Web Application',
    tech: ['Next.js', 'Prisma', 'PostgreSQL', 'AWS'],
    liveUrl: '#',
    githubUrl: '#',
    featured: false
  }
]

const categories = ['All', 'Web Application', 'WordPress Plugin', 'eCommerce', 'Backend']

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory)

  return (
    <section id="projects" className="py-24 md:py-32 bg-[#0a0e17] relative font-mono">
      {/* Code Background Decoration */}
      <div className="absolute top-20 left-4 sm:left-8 text-xs text-gray-800 hidden lg:block">
        <div>projects.map(project =&gt; {'{'}</div>
        <div className="ml-4">return &lt;Card /&gt;;</div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Folder className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">
              // My_Work
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            <span className="text-gray-500">&lt;</span>
            Featured_Projects
            <span className="text-gray-500">/&gt;</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            <span className="text-purple-400">const</span>{' '}
            <span className="text-cyan-400">projects</span> = {'['}
            <span className="text-green-400">"amazing_work"</span>, ...
            {']'}
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              onClick={() => setActiveCategory(category)}
              className={`
                ${activeCategory === category 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'border-white/20 text-gray-400 hover:text-white hover:bg-white/10'
                }
                rounded-full px-4 sm:px-6 text-xs sm:text-sm transition-all font-mono
              `}
            >
              {activeCategory === category && <span className="mr-1">&gt;</span>}
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="bg-[#0f1623] border-white/10 overflow-hidden group hover:border-blue-500/30 transition-all duration-500 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url(${project.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1623] via-[#0f1623]/50 to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-0">
                        {project.category}
                      </Badge>
                    </div>

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-blue-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      <motion.a
                        href={project.liveUrl}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 rounded-full bg-white text-blue-600 flex items-center justify-center"
                      >
                        <Eye className="w-5 h-5" />
                      </motion.a>
                      <motion.a
                        href={project.githubUrl}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 rounded-full bg-white text-blue-600 flex items-center justify-center"
                      >
                        <Github className="w-5 h-5" />
                      </motion.a>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors font-mono">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 flex-1 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <span 
                          key={tech}
                          className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-400 border border-white/10 font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex gap-2 sm:gap-3">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center rounded-md border border-white/10 bg-background px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-300 ring-offset-background transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-mono"
                      >
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Live_Demo</span>
                        <span className="sm:hidden">Live</span>
                      </a>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center rounded-md border border-white/10 bg-background px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-300 ring-offset-background transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-mono"
                      >
                        <Code2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Code
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View More CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            variant="outline"
            className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 font-mono"
          >
            <Github className="w-5 h-5 mr-2" />
            View_All_Projects()
          </Button>
        </motion.div>
      </div>
    </section>
  )
}