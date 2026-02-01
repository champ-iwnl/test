 import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface TabItem {
  id: string
  label: string
}

interface TabsProps {
  items: TabItem[]
  activeId: string
  onChange: (id: string) => void
  className?: string
}

export function Tabs({ items, activeId, onChange, className }: TabsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const activeTabRef = useRef<HTMLButtonElement>(null)

  // Auto scroll to active tab
  useEffect(() => {
    if (activeTabRef.current && containerRef.current) {
      const container = containerRef.current
      const tab = activeTabRef.current
      const { offsetLeft, offsetWidth } = tab
      const { offsetWidth: containerWidth, scrollLeft } = container

      // Center the active tab
      const targetScroll = offsetLeft - (containerWidth / 2) + (offsetWidth / 2)
      
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      })
    }
  }, [activeId])

  return (
    <div className={cn('w-full', className)}>
      <div 
        ref={containerRef}
        className="flex w-full space-x-1 overflow-x-auto p-1 scrollbar-hide no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => {
          const isActive = item.id === activeId
          
          return (
            <button
              key={item.id}
              ref={isActive ? activeTabRef : null}
              onClick={() => onChange(item.id)}
              className={cn(
                'relative flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-colors focus:outline-none border bg-transparent',
                isActive
                  ? 'text-[#FF383C] border-[#FF383C]'
                  : 'text-[#979797] border-[#979797]'
              )}
            >
              <span className="relative z-10">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
