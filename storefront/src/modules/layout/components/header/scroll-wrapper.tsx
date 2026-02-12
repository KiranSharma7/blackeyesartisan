'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@lib/util/cn'

interface ScrollWrapperProps {
  children: React.ReactNode
}

export default function ScrollWrapper({ children }: ScrollWrapperProps) {
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollYRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < lastScrollYRef.current || currentScrollY < 50) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
        setIsVisible(false)
      }

      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={cn(
        'sticky top-0 z-50 transition-transform duration-300 ease-in-out',
        !isVisible && '-translate-y-full'
      )}
    >
      {children}
    </div>
  )
}
