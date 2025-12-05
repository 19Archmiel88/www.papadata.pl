'use client';

import React, { useState, useEffect } from 'react';
import { CompanyDetails, WizardState } from '../types';
import { Input, Button, Checkbox } from './ui';
import { INDUSTRIES, INTEGRATIONS } from '../constants';
import { CheckCircle2, AlertCircle, ShieldCheck, Lock, Building2, Store, Megaphone, BarChart3, Link2, Server } from 'lucide-react';

interface Step1Props {
  data: CompanyDetails;
  updateData: (data: Partial<CompanyDetails>) => void;
}

export const Step1Company: React.FC<Step1Props> = ({ data, updateData }) => {
  const [isValidatingNip, setIsValidatingNip] = useState(false);
  const [nipSuccess, setNipSuccess] = useState(false);
  const [nipError, setNipError] = useState<string | null>(null);

  useEffect(() => {
    if (data.nip.length === 10) {
      setIsValidatingNip(true);
      setNipSuccess(false);
      setNipError(null);

      const timer = setTimeout(() => {
        setIsValidatingNip(false);
        if (data.nip === '0000000000') {
          setNipError('Nie udalo sie pobrac danych firmy. Sprawdz NIP lub uzupelnij recznie.');
        } else {
          setNipSuccess(true);
          if (!data.name) {
            updateData({
              name: 'Awesome Corp Sp. z o.o.',
              address: 'ul. Prosta 51, 00-838 Warszawa',
              industry: 'E-commerce (B2C)',
            });
          }
        }
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setNipSuccess(false);
      setNipError(null);
      setIsValidatingNip(false);
    }
  }, [data.nip, data.name, updateData]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Dane firmy</h2>
          <p className="text-slate-400 text-sm mt-1">Konfiguracja srodowiska w Google Cloud.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-cyan-950/30 border border-cyan-900/50 rounded-full text-cyan-400 text-xs font-mono">
          <Server className="w-3 h-3" /> Region: europe-central2
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <Input
                label="NIP"
                placeholder="1234567890"
                value={data.nip}
                onChange={(e) => updateData({ nip: e.target.value.replace(/\D/g, '') })}
                maxLength={10}
                className="font-mono tracking-wider"
                helperText={!nipError && !isValidatingNip ? 'Wpisz NIP bez spacji.' : undefined}
                error={nipError || undefined}
              />
              {isValidatingNip && (
                <p className="text-xs text-cyan-400 mt-2 flex items-center gap-2 animate-pulse">
                  <LoaderIcon /> Weryfikacja w GUS...
                </p>
              )}
              {nipSuccess && (
                <p className="text-xs text-green-400 mt-2 flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3" /> Dane pobrane.
                </p>
              )}
            </div>

            <Input
              label="Nazwa firmy"
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
              placeholder="Pelna nazwa prawna"
            />

            <div className="md:col-span-2">
              <Input
                label="Adres rejestrowy"
                value={data.address}
                onChange={(e) => updateData({ address: e.target.value })}
                placeholder="Ulica, numer, kod pocztowy, miasto"
              />
            </div>

            <div className="w-full">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Branza</label>
              <div className="relative group">
                <select
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 appearance-none transition-colors"
                  value={data.industry}
                  onChange={(e) => updateData({ industry: e.target.value })}
                >
                  <option value="" disabled>
                    Wybierz z listy
                  </option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-cyan-500 transition-colors">
                  v
                </div>
              </div>
            </div>

            <div className="w-full">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Waluta</label>
              <div className="relative group">
                <select
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 appearance-none transition-colors"
                  value={data.currency}
                  onChange={(e) => updateData({ currency: e.target.value })}
                >
                  <option value="PLN">PLN (Zloty)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="USD">USD (Dollar)</option>
                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-cyan-500 transition-colors">
                  v
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="E-mail administratora"
                type="email"
                placeholder="admin@firma.pl"
                value={data.email}
                onChange={(e) => updateData({ email: e.target.value })}
              />
              <div className="flex items-end pb-3">
                <Checkbox
                  label="Powiadomienia systemowe"
                  checked={data.notifications}
                  onChange={(c) => updateData({ notifications: c })}
                />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Na ten adres wysylamy klucze do BigQuery oraz alerty ETL.</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldCheck className="w-24 h-24 text-cyan-500" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-500" /> Bezpieczenstwo
            </h3>
            <ul className="space-y-3 text-xs text-slate-400 leading-relaxed">
              <li className="flex gap-2">
                <div className="w-1 h-1 bg-cyan-500 rounded-full mt-1.5 shrink-0"></div>
                Dane w regionie UE (europe-central2)
              </li>
              <li className="flex gap-2">
                <div className="w-1 h-1 bg-cyan-500 rounded-full mt-1.5 shrink-0"></div>
                Klucze szyfrowane w Secret Manager
              </li>
              <li className="flex gap-2">
                <div className="w-1 h-1 bg-cyan-500 rounded-full mt-1.5 shrink-0"></div>
                Pelna izolacja projektu GCP
              </li>
            </ul>
          </div>

          <div className="px-1">
            <Checkbox
              label="Akceptuje Regulamin i Polityke Prywatnosci."
              checked={data.termsAccepted}
              onChange={(c) => updateData({ termsAccepted: c })}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface Step2Props {
  selectedIds: string[];
  toggleIntegration: (id: string) => void;
}

export const Step2Integrations: React.FC<Step2Props> = ({ selectedIds, toggleIntegration }) => {
  const categories = [
    { id: 'store', label: 'E-commerce', icon: Store },
    { id: 'ads', label: 'Reklama (Ads)', icon: Megaphone },
    { id: 'analytics', label: 'Analityka', icon: BarChart3 },
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-white/5 pb-6 text-center">
        <h2 className="text-2xl font-semibold text-white tracking-tight">Zrodla danych</h2>
        <p className="text-slate-400 text-sm mt-1">Wybierz konektory do konfiguracji w pipeline ETL.</p>
      </div>

      <div className="space-y-12">
        {categories.map((cat) => {
          const items = INTEGRATIONS.filter((i) => i.category === cat.id);
          if (items.length === 0) return null;

          return (
            <div key={cat.id}>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-white/10 flex-1"></div>
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <cat.icon className="w-4 h-4" /> {cat.label}
                </div>
                <div className="h-px bg-white/10 flex-1"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleIntegration(item.id)}
                      className={`relative p-5 rounded-xl border cursor-pointer group select-none flex flex-col h-full transition-all duration-200 ${
                        isSelected
                          ? 'bg-slate-800/80 border-cyan-500/50 shadow-lg shadow-black/40'
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-600 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-colors duration-200 ${
                            isSelected
                              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/50'
                              : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700 group-hover:text-slate-300'
                          }`}
                        >
                          {item.icon}
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 ${
                            isSelected ? 'bg-cyan-500 border-cyan-500' : 'border-slate-600 bg-transparent'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>

                      <h4 className={`text-base font-semibold mb-2 transition-colors ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors">
                        {item.descriptionPL}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface Step3Props {
  selectedIntegrations: string[];
  statusMap: Record<string, 'pending' | 'connected' | 'error'>;
  setStatus: (id: string, status: 'pending' | 'connected' | 'error') => void;
}

export const Step3Keys: React.FC<Step3Props> = ({ selectedIntegrations, statusMap, setStatus }) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleConnect = (id: string) => {
    setLoadingId(id);
    setTimeout(() => {
      setLoadingId(null);
      setStatus(id, Math.random() > 0.2 ? 'connected' : 'error');
    }, 1200);
  };

  const selectedItems = INTEGRATIONS.filter((i) => selectedIntegrations.includes(i.id));
  const oauthItems = selectedItems.filter((i) => i.type === 'oauth');
  const apiItems = selectedItems.filter((i) => i.type === 'apikey');

  return (
    <div className="space-y-8">
      <div className="border-b border-white/5 pb-6 text-center">
        <h2 className="text-2xl font-semibold text-white tracking-tight">Autoryzacja dostepu</h2>
        <p className="text-slate-400 text-sm mt-1">Nawiaz bezpieczne polaczenia z wybranymi systemami.</p>
      </div>

      {oauthItems.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 pl-1">Polaczenia OAuth</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {oauthItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 rounded-lg border bg-slate-900/30 transition-all ${
                  statusMap[item.id] === 'connected' ? 'border-green-500/30 bg-green-500/5' : 'border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-200 text-sm">{item.name}</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">Bezpieczny token</p>
                  </div>
                </div>
                {statusMap[item.id] === 'connected' ? (
                  <span className="text-green-400 text-xs font-medium flex items-center gap-1.5 bg-green-900/20 px-2 py-1 rounded border border-green-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Polaczono
                  </span>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleConnect(item.id)}
                    isLoading={loadingId === item.id}
                    className="h-8 text-xs px-3"
                  >
                    Autoryzuj
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {apiItems.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 pl-1">Konfiguracja API</h3>
          {apiItems.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                statusMap[item.id] === 'connected' ? 'border-green-900/50 bg-green-900/5' : 'border-slate-800 bg-slate-900/20'
              }`}
            >
              <div className="flex justify-between items-center p-4 border-b border-white/5 bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                    {item.icon}
                  </div>
                  <h4 className="font-semibold text-slate-200 text-sm">{item.name}</h4>
                </div>
                {statusMap[item.id] === 'connected' && (
                  <span className="text-green-400 text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Aktywne
                  </span>
                )}
                {statusMap[item.id] === 'error' && (
                  <span className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Blad
                  </span>
                )}
              </div>

              <div className="p-5 space-y-4">
                {item.fields?.map((field) => (
                  <div key={field} className="grid grid-cols-1 md:grid-cols-3 gap-2 md:items-center">
                    <label className="text-xs text-slate-400 font-mono">{field}</label>
                    <div className="md:col-span-2">
                      <Input
                        placeholder={field.includes('URL') ? 'https://...' : '••••••••••••••••'}
                        type={field.toLowerCase().includes('url') ? 'text' : 'password'}
                        className="font-mono text-xs h-9 bg-black/40 border-slate-800"
                        disabled={statusMap[item.id] === 'connected'}
                      />
                    </div>
                  </div>
                ))}

                <div className="flex justify-end pt-2">
                  <Button
                    variant={statusMap[item.id] === 'connected' ? 'ghost' : 'outline'}
                    className="text-xs h-8"
                    onClick={() => handleConnect(item.id)}
                    isLoading={loadingId === item.id}
                    disabled={statusMap[item.id] === 'connected'}
                  >
                    {statusMap[item.id] === 'connected' ? 'Polaczenie zweryfikowane' : 'Testuj polaczenie'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 text-xs text-slate-500 bg-slate-900/50 p-3 rounded border border-white/5">
        <Lock className="w-4 h-4 text-slate-400" />
        <p>
          Klucze szyfrowane (AES-256) i wysylane bezposrednio do Secret Manager. Brak logowania w czystym tekscie.
        </p>
      </div>
    </div>
  );
};

interface Step4Props {
  data: WizardState;
}

export const Step4Summary: React.FC<Step4Props> = ({ data }) => {
  const [agreements, setAgreements] = useState({ access: false, project: false });

  return (
    <div className="space-y-8">
      <div className="border-b border-white/5 pb-6 text-center">
        <h2 className="text-2xl font-semibold text-white tracking-tight">Podsumowanie</h2>
        <p className="text-slate-400 text-sm mt-1">Zatwierdz konfiguracje, aby rozpoczac provisioning.</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          <div className="p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <Building2 className="w-3 h-3" /> Podmiot
            </h3>
            <div className="space-y-4">
              <div>
                <span className="block text-[10px] text-slate-500 uppercase">Pelna nazwa</span>
                <span className="text-sm text-slate-200 font-medium">{data.company.name}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase">NIP</span>
                <span className="text-sm font-mono text-cyan-400">{data.company.nip}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase">Waluta</span>
                <span className="text-sm text-slate-300">{data.company.currency}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <Link2 className="w-3 h-3" /> Zrodla danych
            </h3>
            <div className="space-y-2">
              {data.selectedIntegrations.length === 0 && (
                <span className="text-slate-500 text-sm italic">Nie wybrano zrodel</span>
              )}
              {data.selectedIntegrations.map((id) => {
                const item = INTEGRATIONS.find((i) => i.id === id);
                const status = data.integrationStatus[id] || 'pending';
                return (
                  <div key={id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{item?.name}</span>
                    {status === 'connected' ? (
                      <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                    ) : (
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-6 bg-slate-900/60">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <Server className="w-3 h-3" /> Zasoby
            </h3>
            <ul className="space-y-2 text-xs text-slate-400 font-mono">
              <li className="flex justify-between">
                <span>BigQuery:</span> <span className="text-slate-300">dataset_eu</span>
              </li>
              <li className="flex justify-between">
                <span>Cloud Storage:</span> <span className="text-slate-300">Standard</span>
              </li>
              <li className="flex justify-between">
                <span>Secret Mgr:</span> <span className="text-green-400">Wlaczone</span>
              </li>
              <li className="flex justify-between border-t border-slate-800 pt-2 mt-2">
                <span>Szac. czas:</span> <span className="text-white">~45s</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/20 p-5 rounded-lg border border-slate-800/50 space-y-3">
        <Checkbox
          label="Potwierdzam, ze mam uprawnienia administratora do wskazanych kont."
          checked={agreements.access}
          onChange={(c) => setAgreements((prev) => ({ ...prev, access: c }))}
        />
        <Checkbox
          label="Upowazniam PapaData do utworzenia projektu Google Cloud w moim imieniu."
          checked={agreements.project}
          onChange={(c) => setAgreements((prev) => ({ ...prev, project: c }))}
        />
      </div>
    </div>
  );
};

const LoaderIcon = () => (
  <svg className="animate-spin h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);



