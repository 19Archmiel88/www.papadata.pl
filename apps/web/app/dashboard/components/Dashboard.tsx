'use client';

import React, { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Loader2, Zap, LayoutDashboard, BarChart2, MessageSquare, Settings, Bell, Search, User, Check, CheckCircle2, HelpCircle, ChevronDown } from 'lucide-react';
import { Card, Button } from './ui';

interface DashboardProps {
  companyName: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ companyName }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'live'>('home');
  const [blueprintSent, setBlueprintSent] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedReports, setSelectedReports] = useState<string[]>([
    'Sprzedaz dzienna',
    'Performance kampanii',
    'Produkty i marza',
    'Lejek zakupowy (GA4)',
  ]);
  const [expertHelp, setExpertHelp] = useState(false);

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]));
  };

  const toggleReport = (rep: string) => {
    setSelectedReports((prev) => (prev.includes(rep) ? prev.filter((r) => r !== rep) : [...prev, rep]));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-200">
      <nav className="h-16 border-b border-white/5 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-indigo-700 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">
            PD
          </div>
          <span className="font-semibold text-white hidden md:inline tracking-tight">PapaData</span>
          <div className="h-4 w-px bg-slate-700 mx-2 hidden md:block"></div>
          <span className="text-sm text-slate-400 hidden md:block">{companyName}</span>
        </div>

        <div className="flex-1 max-w-md mx-6 hidden lg:block">
          <div className="relative group">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 group-focus-within:text-cyan-400 transition-colors" />
            <input
              className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-300 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all placeholder-slate-600"
              placeholder="Szukaj analiz..."
            />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <span className="hidden md:inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-full">
            Trial Enterprise: 14 dni
          </span>
          <Bell className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition-colors" />
          <div className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded-lg transition-colors">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <ChevronDown className="w-3 h-3 text-slate-500 hidden md:block" />
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden lg:flex w-64 border-r border-white/5 bg-slate-900/20 flex-col pt-6 pb-4 gap-1">
          <div className="px-4 mb-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-2">Obszar roboczy</div>
          </div>
          <SidebarItem icon={LayoutDashboard} label="Pulpit" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <SidebarItem icon={Zap} label="Raporty Live" active={activeTab === 'live'} onClick={() => setActiveTab('live')} />
          <SidebarItem icon={BarChart2} label="Eksplorator danych" />

          <div className="mt-8 px-4 mb-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-2">Wsparcie</div>
          </div>
          <SidebarItem icon={MessageSquare} label="Analityk AI" />
          <SidebarItem icon={Settings} label="Ustawienia" />
        </aside>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 relative">
          <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] pointer-events-none rounded-full"></div>

          {activeTab === 'home' && (
            <div className="space-y-8 animate-in fade-in duration-500 relative z-10 max-w-6xl mx-auto">
              <header className="flex justify-between items-end border-b border-white/5 pb-6">
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">Witaj ponownie, {companyName.split(' ')[0]}</h1>
                  <p className="text-slate-400 mt-2">
                    Status platformy: <span className="text-green-400">Operacyjna</span>
                  </p>
                </div>
                <Button variant="outline" className="hidden md:flex">
                  Odswiez dane
                </Button>
              </header>

              <Card className="border-l-4 border-l-cyan-600 bg-slate-900/40 backdrop-blur-sm border-t border-r border-b border-white/5">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-cyan-900/20 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                    </div>
                    Synchronizacja danych
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <ETLItem name="WooCommerce" status="Pobieranie historii (365 dni)..." progress={35} />
                    <ETLItem name="Google Ads" status="Mapowanie kampanii..." progress={15} />
                    <ETLItem name="Meta Ads" status="W kolejce" progress={0} />
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 relative overflow-hidden group border-white/5 bg-slate-900/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-blue-900/10 z-0"></div>
                  <div className="p-6 relative z-10 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 w-min">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">
                        PRZETWARZANIE_DANYCH
                      </span>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-xl font-bold text-white mb-2">Analityk Biznesowy AI</h3>
                      <p className="text-slate-400 mb-6 max-w-md">
                        Nasze AI analizuje dane historyczne, aby wygenerowac wstepne wnioski. Sprawdz ponownie za ok. 30 minut.
                      </p>
                      <Button variant="secondary" disabled className="w-fit">
                        Rozpocznij analize
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="border-white/5 bg-gradient-to-b from-slate-900/40 to-slate-950/40">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-white">Akademia PapaData</h3>
                    </div>
                    <p className="text-sm text-slate-400 mb-6">Dokumentacja i najlepsze praktyki.</p>
                    <div className="space-y-3">
                      {['Analiza ROAS', 'Konfiguracja E-commerce GA4'].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-3 text-sm text-slate-300 hover:text-white cursor-pointer p-3 rounded-lg border border-transparent hover:border-white/5 hover:bg-white/5 transition-all"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'live' && (
            <div className="max-w-5xl mx-auto animate-in slide-in-from-right-8 duration-500 pt-4 relative z-10">
              {!blueprintSent ? (
                <>
                  <div className="mb-8 border-b border-white/5 pb-6">
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Skonfiguruj Raporty Live</h2>
                    <p className="text-slate-400 text-lg">Dostosuj dashboardy do celow biznesowych.</p>
                  </div>

                  <Card className="p-0 border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-2xl overflow-hidden">
                    <div className="p-8 md:p-12 space-y-12">
                      <div>
                        <label className="text-sm font-semibold text-slate-300 mb-6 uppercase tracking-wider flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></span>
                          Glowne cele
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {['Maksymalizacja ROAS', 'Analiza marzy netto', 'Pozyskiwanie klientow', 'Lojalnosc i LTV'].map((goal) => {
                            const isSelected = selectedGoals.includes(goal);
                            return (
                              <div
                                key={goal}
                                onClick={() => toggleGoal(goal)}
                                className={`group relative flex items-center gap-4 p-5 rounded-xl border cursor-pointer transition-all duration-300 select-none ${
                                  isSelected
                                    ? 'bg-cyan-900/20 border-cyan-500/50'
                                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-600 hover:bg-slate-800/80'
                                }`}
                              >
                                <div
                                  className={`w-6 h-6 rounded flex items-center justify-center transition-all duration-300 border ${
                                    isSelected
                                      ? 'bg-cyan-600 border-cyan-600 scale-105'
                                      : 'bg-transparent border-slate-600 group-hover:border-slate-400'
                                  }`}
                                >
                                  {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                                </div>
                                <span
                                  className={`font-medium text-lg transition-colors ${
                                    isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                                  }`}
                                >
                                  {goal}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-slate-300 mb-6 uppercase tracking-wider flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
                          Zestaw raportow startowych
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {['Sprzedaz dzienna', 'Performance kampanii', 'Marze produktowe', 'Lejek zakupowy (GA4)', 'Stany magazynowe', 'Zwroty'].map((rep) => {
                            const isSelected = selectedReports.includes(rep);
                            return (
                              <div
                                key={rep}
                                onClick={() => toggleReport(rep)}
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg border cursor-pointer transition-all duration-200 ${
                                  isSelected
                                    ? 'bg-slate-800 border-slate-600 text-white'
                                    : 'bg-transparent border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                    isSelected ? 'border-cyan-500 bg-cyan-500' : 'border-slate-600'
                                  }`}
                                >
                                  {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                                </div>
                                <span className="text-sm font-medium">{rep}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="h-px bg-white/5 w-full"></div>

                      <div className="flex items-center justify-between bg-gradient-to-r from-slate-900/50 to-slate-900/20 p-6 rounded-xl border border-white/5">
                        <div className="flex gap-4">
                          <div className="p-3 bg-indigo-500/10 rounded-lg h-min text-indigo-400">
                            <HelpCircle className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="block text-base font-medium text-slate-200 mb-1">Poprosic o weryfikacje eksperta?</span>
                            <span className="text-sm text-slate-500">Analitycy sprawdza poprawnosci danych (w cenie trial).</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className={`text-sm font-medium transition-colors ${expertHelp ? 'text-white' : 'text-slate-500'}`}>
                            {expertHelp ? 'Tak, sprawdz dane' : 'Nie, dziekuje'}
                          </span>
                          <button
                            onClick={() => setExpertHelp(!expertHelp)}
                            className={`relative w-14 h-8 rounded-full transition-all duration-300 focus:outline-none shadow-inner ${
                              expertHelp ? 'bg-cyan-600' : 'bg-slate-800'
                            }`}
                          >
                            <div
                              className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transition-transform duration-300 ${
                                expertHelp ? 'translate-x-6' : 'translate-x-0'
                              }`}
                            ></div>
                          </button>
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <Button variant="premium" className="h-12 px-8 text-base shadow-2xl" onClick={() => setBlueprintSent(true)}>
                          Zapisz konfiguracje
                        </Button>
                      </div>
                    </div>
                  </Card>
                </>
              ) : (
                <div className="text-center py-24 animate-in zoom-in duration-500">
                  <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full"></div>
                    <div className="w-24 h-24 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center relative z-10 shadow-2xl ring-1 ring-green-500/30">
                      <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </div>
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Konfiguracja zapisana</h2>
                  <p className="text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed text-lg">
                    Dashboardy sa przygotowywane. Powiadomimy gdy srodowisko zostanie wypelnione danymi.
                  </p>
                  <Button variant="outline" onClick={() => setActiveTab('home')} className="px-10 h-12">
                    Wroc do Pulpitu
                  </Button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
  <div
    onClick={onClick}
    className={`mx-3 mb-1 flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
      active
        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-900/10'
        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
    }`}
  >
    <Icon className="w-4 h-4" />
    <span className="font-medium text-sm">{label}</span>
  </div>
);

const ETLItem = ({ name, status, progress }: { name: string; status: string; progress: number }) => (
  <div>
    <div className="flex justify-between text-xs mb-2">
      <span className="text-slate-300 font-semibold">{name}</span>
      <span className="text-slate-500 font-mono">{progress}%</span>
    </div>
    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
      <div
        className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-1.5 rounded-full transition-all duration-1000 relative overflow-hidden shadow-[0_0_10px_rgba(6,182,212,0.5)]"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute inset-0 bg-white/30 w-full animate-[shimmer_1.5s_infinite] translate-x-[-100%]"></div>
      </div>
    </div>
    <p className="text-[10px] text-slate-500 mt-2 font-mono">{status}</p>
  </div>
);
