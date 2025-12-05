'use client'

import React from 'react'
import { Gift } from 'lucide-react'

interface StickyWidgetProps {
  isVisible: boolean
  onClick: () => void
}

export const StickyWidget: React.FC<StickyWidgetProps> = ({ isVisible, onClick }) => {
  if (!isVisible) return null

  return (
    <button
      type="button"
      onClick={onClick}
      className="group fixed left-0 top-1/2 z-40 -translate-y-1/2 cursor-pointer rounded-r-xl border-y border-r border-brand-accent/40 bg-brand-dark/85 p-3 shadow-neon-cyan transition-all duration-300 hover:pl-5 hover:bg-brand-accent/10"
      aria-label="14-day free trial"
    >
      <div className="flex flex-col items-center gap-2">
        <Gift className="h-5 w-5 text-brand-accent animate-pulse" />
        <span
          className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          14 dni free
        </span>
      </div>
    </button>
  )
}

