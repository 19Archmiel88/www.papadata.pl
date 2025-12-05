'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  BarChart2,
  LayoutGrid,
  BookOpen,
  MessageSquare,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';

type SidebarProps = {
  currentView: string;
  onChangeView: (view: string) => void;
  isOpen: boolean;
};

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Pulpit Zarządczy' },
  { id: 'reports', icon: BarChart2, label: 'Raporty' },
  { id: 'integrations', icon: LayoutGrid, label: 'Integracje' },
  { id: 'academy', icon: BookOpen, label: 'Baza Wiedzy' },
  { id: 'support', icon: MessageSquare, label: 'Wsparcie' },
  { id: 'clients', icon: Users, label: 'Klienci' },
  { id: 'settings', icon: Settings, label: 'Ustawienia' },
];

export function DemoSidebar({ currentView, onChangeView, isOpen }: SidebarProps) {
  return (
    <motion.aside
      animate={{ width: isOpen ? 256 : 80 }}
      className="fixed left-0 top-0 z-40 flex h-screen flex-col overflow-hidden border-r border-brand-border/60 bg-pd-bg/95 backdrop-blur"
    >
      <div className={`flex items-center gap-3 p-6 ${!isOpen && 'justify-center p-4'}`}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent text-xs font-bold text-pd-bg shadow-neon-cyan">
          PD
        </div>
        {isOpen && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-bold">
            PapaData
          </motion.span>
        )}
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              currentView === item.id
                ? 'bg-brand-accent/10 text-brand-accent'
                : 'text-pd-muted hover:bg-brand-border/20 hover:text-pd-foreground'
            } ${!isOpen && 'justify-center px-0'}`}
            title={!isOpen ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {isOpen && <span className="whitespace-nowrap">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="border-t border-brand-border/60 p-4">
        <button
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-pd-muted transition-colors hover:text-pd-foreground ${
            !isOpen && 'justify-center'
          }`}
          title={!isOpen ? 'Wyloguj (Demo)' : undefined}
          onClick={() => (window.location.href = '/')}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {isOpen && <span className="whitespace-nowrap">Wyloguj (Demo)</span>}
        </button>
      </div>
    </motion.aside>
  );
}

export default DemoSidebar;
