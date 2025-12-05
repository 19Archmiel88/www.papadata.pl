'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { X, Gift } from 'lucide-react'

interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
  isReengagement?: boolean
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  isReengagement,
}) => {
  const router = useRouter()

  if (!isOpen) return null

  const handleCta = () => {
    router.push('/wizard')
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="card-glass relative z-10 w-full max-w-lg border border-brand-border/70 bg-brand-dark/80 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-border/70 bg-brand-dark/80 text-pd-muted transition hover:border-brand-accent hover:text-brand-accent"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-accent/12 ring-1 ring-brand-accent/50 shadow-[0_10px_30px_rgba(56,189,248,0.25)]">
            <Gift className="h-8 w-8 text-brand-accent" />
          </div>

          <div>
            <h3 className="mb-2 text-2xl font-bold text-pd-foreground">
              {isReengagement ? 'Jeszcze tu jesteś?' : 'Witaj w PapaData!'}
            </h3>
            <p className="text-sm text-pd-muted">
              {isReengagement
                ? 'Wygląda na to, że interesuje Cię analityka. Odbierz swój prezent.'
                : 'Rozpocznij 14-dniowy darmowy okres i sprawdź swoje dane e-commerce bez ryzyka.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCta}
            className="w-full rounded-full bg-gradient-to-r from-brand-accent to-cyan-400 px-5 py-3 text-sm font-semibold text-brand-dark shadow-[0_14px_55px_rgba(56,189,248,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_70px_rgba(56,189,248,0.55)] hover:text-brand-dark"
          >
            Załóż darmowe konto
          </button>

          <p className="text-xs text-pd-muted">Nie wymagamy karty kredytowej.</p>
        </div>
      </div>
    </div>
  )
}
