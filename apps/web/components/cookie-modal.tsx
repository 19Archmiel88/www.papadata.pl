'use client'

import React from 'react'

type CookieModalProps = {
  onAccept: () => void
  onDecline: () => void
}

export const CookieModal: React.FC<CookieModalProps> = ({ onAccept, onDecline }) => {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] border-t border-brand-border bg-brand-dark/90 p-4 backdrop-blur-xl shadow-neon-cyan animate-in slide-in-from-bottom duration-500">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <p className="text-sm text-pd-muted">
          Używamy plików cookies i technologii śledzących, aby zapewnić najlepszą jakość korzystania z naszej
          platformy analitycznej. Akceptacja jest wymagana do pełnego działania dema.
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onDecline}
            className="text-sm font-medium text-pd-muted transition hover:text-brand-accent"
          >
            Odrzuć
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-dark shadow-neon-cyan transition hover:bg-brand-accent/90"
          >
            Akceptuję
          </button>
        </div>
      </div>
    </div>
  )
}

