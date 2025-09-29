'use client'

import { Code, Users, MessageCircle, Search, Star, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: Code,
    title: 'Project Management',
    description: 'Create and manage projects with detailed descriptions, tech stacks, and requirements.',
    color: 'bg-blue-500',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Connect with developers worldwide and build amazing projects together.',
    color: 'bg-purple-500',
  },
  {
    icon: MessageCircle,
    title: 'Real-time Chat',
    description: 'Communicate with your team members through dedicated project chat rooms.',
    color: 'bg-green-500',
  },
  {
    icon: Search,
    title: 'Smart Discovery',
    description: 'Find projects that match your skills and interests with advanced filtering.',
    color: 'bg-orange-500',
  },
  {
    icon: Star,
    title: 'Rating System',
    description: 'Build your reputation through project contributions and peer reviews.',
    color: 'bg-pink-500',
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description: 'Your data and communications are protected with enterprise-grade security.',
    color: 'bg-indigo-500',
  },
]

export function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Everything you need to collaborate
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Powerful features designed to help developers connect, collaborate, and create amazing projects together.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-gray-50 rounded-2xl p-8 h-full hover:shadow-lg transition-all duration-300 group-hover:bg-white">
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}