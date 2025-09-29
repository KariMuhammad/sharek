'use client'

import { UserPlus, Search, MessageCircle, Code } from 'lucide-react'
import { motion } from 'framer-motion'

const steps = [
  {
    icon: UserPlus,
    title: 'Create Your Profile',
    description: 'Sign up and showcase your skills, experience, and interests to connect with like-minded developers.',
    color: 'bg-blue-500',
  },
  {
    icon: Search,
    title: 'Discover Projects',
    description: 'Browse through thousands of projects or create your own. Filter by technology, difficulty, and category.',
    color: 'bg-purple-500',
  },
  {
    icon: MessageCircle,
    title: 'Join & Collaborate',
    description: 'Request to join interesting projects and start collaborating with the team through real-time chat.',
    color: 'bg-green-500',
  },
  {
    icon: Code,
    title: 'Build Together',
    description: 'Work together to bring ideas to life, share knowledge, and create amazing projects that matter.',
    color: 'bg-orange-500',
  },
]

export function HowItWorks() {
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
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Get started in minutes and begin collaborating with developers worldwide
          </motion.p>
        </div>

        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 via-green-200 to-orange-200 transform -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 lg:bg-gray-50">
                  {index + 1}
                </div>

                <div className="bg-gray-50 rounded-2xl p-8 pt-12 h-full hover:shadow-lg transition-all duration-300 group">
                  <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}