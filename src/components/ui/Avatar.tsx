'use client'

import { useState } from 'react'
import { User } from 'lucide-react'
import { clsx } from 'clsx'

interface AvatarProps {
  src?: string | null
  alt: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Avatar({ src, alt, size = 'md', className }: AvatarProps) {
  const [imageError, setImageError] = useState(false)

  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  }

  const classes = clsx(
    'rounded-full bg-gray-200 flex items-center justify-center overflow-hidden',
    sizes[size],
    className
  )

  if (!src || imageError) {
    return (
      <div className={classes}>
        <User className={clsx('text-gray-500', iconSizes[size])} />
      </div>
    )
  }

  return (
    <div className={classes}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  )
}