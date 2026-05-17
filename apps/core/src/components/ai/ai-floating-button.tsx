'use client'

import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAIStore } from '@/store/ai'

export function AIFloatingButton() {
  const { isOpen, togglePanel } = useAIStore()

  return (
    <motion.button
      onClick={togglePanel}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.8, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.93 }}
      aria-label="Sentinel AI"
      title="Sentinel AI (Ctrl+K)"
      className={cn(
        'fixed bottom-6 right-6 z-[60]',
        'w-14 h-14 rounded-2xl',
        'flex items-center justify-center',
        'transition-colors duration-300',
        isOpen
          ? 'bg-primary border-2 border-primary shadow-[0_0_32px_rgba(99,102,241,0.55)]'
          : 'bg-[#0d1220] border border-primary/35 hover:border-primary/60 hover:bg-primary/15',
        'shadow-[0_8px_32px_rgba(0,0,0,0.45)]',
      )}
    >
      {/* Animated glow ring */}
      {!isOpen && (
        <span className="absolute inset-0 rounded-2xl bg-primary/15 animate-ai-pulse pointer-events-none" />
      )}

      <Brain className={cn(
        'w-5 h-5 relative z-10 transition-colors duration-200',
        isOpen ? 'text-white' : 'text-primary',
      )} />
    </motion.button>
  )
}
