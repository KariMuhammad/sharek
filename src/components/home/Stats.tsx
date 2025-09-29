'use client'

import { Users, FolderOpen, MessageSquare, Star } from 'lucide-react'
import { motion } from 'framer-motion'

const stats = [
  {
    icon: Users,
    value: '10,000+',
    label: 'Active Developers',
    color: 'text-blue-600',
  },
  {
    icon: FolderOpen,
    value: '2,500+',
    label: 'Projects Created',
    color: 'text-purple-600',
  },
  {
    icon: MessageSquare,
    value: '50,000+',
    label: 'Messages Exchanged',
    color: 'text-green-600',
  },
  {
    icon: Star,
    value: '4.9/5',
    label: 'Average Rating',
    color: 'text-orange-600',
  },
]

export function Stats() {
  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-50 ${stat.color} mb-4`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}