'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useI18n } from '@papadata/i18n';
import {
  Calendar,
  ClipboardList,
  MessageCircle,
  Target,
  Users,
} from 'lucide-react';

export function ConsultationSection() {
  const  t  = useI18n();

  const [needsAudit, setNeedsAudit] = useState<'yes' | 'no' | null>(null);
  const [hasSpecificCase, setHasSpecificCase] = useState<'yes' | 'no' | null>(
    null,
  );
  const [submitted, setSubmitted] = useState(false);

  const leadParagraphs = useMemo<string[]>(
    () =>
      t('landing.consultations.sectionLead')
        .split('\n')
        .map((p: string) => p.trim())
        .filter(Boolean),
    [t],
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="consultations"
      className="border-t border-slate-800 bg-slate-950 py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4">
        {/* Nagłówek sekcji */}
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              {t('landing.hero.tagline')}
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
              {t('landing.consultations.sectionTitle')}
            </h2>
            <div className="mt-4 space-y-2 text-sm md:text-base text-slate-300">
              {leadParagraphs.map((p: string, idx: number) => (
                <p key={idx} className="leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-6 grid gap-3 text-xs md:text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-slate-100">60 minut konsultacji</p>
                  <p className="text-slate-400">
                    Skupiamy się na konkretnych decyzjach biznesowych, nie na
                    ogólnikach marketingowych.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <ClipboardList className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-slate-100">
                    Analiza danych zamiast „czucia”
                  </p>
                  <p className="text-slate-400">
                    Omawiamy kampanie, sprzedaż, lejki i marżę w oparciu o twarde
                    liczby.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-slate-100">
                    Wersja demo formularza
                  </p>
                  <p className="text-slate-400">
                    {t('landing.consultations.submit.note')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formularz */}
          <div>
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 md:p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-slate-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Users className="h-4 w-4" />
                </div>
                <span>{t('landing.consultations.sectionTitle')}</span>
              </div>

              {/* Podstawowe informacje */}
              <div className="mt-5 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-200">
                    {t(
                      'landing.consultations.fields.companyDescription.label',
                    )}
                  </label>
                  <textarea
                    className="min-h-[72px] w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/50 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1"
                    placeholder={t(
                      'landing.consultations.fields.companyDescription.placeholder',
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-200">
                      {t('landing.consultations.fields.companySince.label')}
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/50 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1"
                      placeholder={t(
                        'landing.consultations.fields.companySince.placeholder',
                      )}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-200">
                      {t('landing.consultations.fields.monthlyRevenue.label')}
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/50 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1"
                      placeholder={t(
                        'landing.consultations.fields.monthlyRevenue.placeholder',
                      )}
                    />
                  </div>
                </div>

                {/* Premium / eksport */}
                <div className="grid gap-4 md:grid-cols-2">
                  <fieldset className="space-y-2">
                    <legend className="text-xs font-medium text-slate-200">
                      {t('landing.consultations.fields.isPremium.label')}
                    </legend>
                    <div className="space-y-1 text-xs text-slate-200">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="isPremium"
                          className="h-3 w-3 rounded-full border-slate-600 bg-slate-900 text-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          value="yes"
                        />
                        <span>
                          {t(
                            'landing.consultations.fields.isPremium.option.yes',
                          )}
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="isPremium"
                          className="h-3 w-3 rounded-full border-slate-600 bg-slate-900 text-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          value="no"
                        />
                        <span>
                          {t(
                            'landing.consultations.fields.isPremium.option.no',
                          )}
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="isPremium"
                          className="h-3 w-3 rounded-full border-slate-600 bg-slate-900 text-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          value="unknown"
                        />
                        <span>
                          {t(
                            'landing.consultations.fields.isPremium.option.unknown',
                          )}
                        </span>
                      </label>
                    </div>
                  </fieldset>

                  <fieldset className="space-y-2">
                    <legend className="text-xs font-medium text-slate-200">
                      {t('landing.consultations.fields.exportsAbroad.label')}
                    </legend>
                    <div className="space-y-1 text-xs text-slate-200">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="exportsAbroad"
                          className="h-3 w-3 rounded-full border-slate-600 bg-slate-900 text-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          value="yes"
                        />
                        <span>
                          {t(
                            'landing.consultations.fields.exportsAbroad.option.yes',
                          )}
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="exportsAbroad"
                          className="h-3 w-3 rounded-full border-slate-600 bg-slate-900 text-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          value="no"
                        />
                        <span>
                          {t(
                            'landing.consultations.fields.exportsAbroad.option.no',
                          )}
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="exportsAbroad"
                          className="h-3 w-3 rounded-full border-slate-600 bg-slate-900 text-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          value="planning"
                        />
                        <span>
                          {t(
                            'landing.consultations.fields.exportsAbroad.option.planning',
                          )}
                        </span>
                      </label>
                    </div>
                  </fieldset>
                </div>

                {/* Konkretna sprawa */}
                <fieldset className="space-y-2">
                  <legend className="text-xs font-medium text-slate-200">
                    {t('landing.consultations.fields.hasSpecificCase.label')}
                  </legend>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-200">
                    <label className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1">
                      <input
                        type="radio"
                        name="hasSpecificCase"
                        className="h-3 w-3 rounded-full border-slate-600 bg-slate-900 text-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        value="yes"
                        onChange={() => setHasSpecificCase('yes')}
                      />
                      <span>
                        {t(
                          'landing.consultations.fields.hasSpecificCase.option.yes',
                        )}
                      </span>
                    </label>
                    <label className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1">
                      <input
                        type="radio"
                        name="hasSpecificCase"
                        className="h-3 w-3 rounded-full border-slate-600 bg-slate-900 text-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        value="no"
                        onChange={() => setHasSpecificCase('no')}
                      />
                      <span>
                        {t(
                          'landing.consultations.fields.hasSpecificCase.option.no',
                        )}
                      </span>
                    </label>
                  </div>
                </fieldset>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-200">
                    {t(
                      'landing.consultations.fields.specificCaseDescription.label',
                    )}
                  </label>
                  <textarea
                    className="min-h-[80px] w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/50 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1"
                    placeholder={t(
                      'landing.consultations.fields.specificCaseDescription.placeholder',
                    )}
                  />
                  {hasSpecificCase === 'no' && (
                    <p className="mt-1 text-[11px] text-slate-500">
                      Możesz zostawić to pole puste, jeśli dopiero szukasz
                      obszaru do omówienia.
                    </p>
                  )}
                </div>

                {/* Audyt kampanii */}
                <fieldset className="mt-4 space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
                  <legend className="flex items-center gap-2 text-xs font-medium text-slate-100">
                    <Target className="h-4 w-4 text-emerald-400" />
                    {t('landing.consultations.audit.title')}
                  </legend>

                  <div className="space-y-2">
                    <p className="text-[11px] font-medium text-slate-300">
                      {t('landing.consultations.fields.needsAudit.label')}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-200">
                      <label className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1">
                        <input
                          type="radio"
                          name="needsAudit"
                          className="h-3 w-3 rounded-full border-slate-600 bg-slate-900 text-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          value="yes"
                          onChange={() => setNeedsAudit('yes')}
                        />
                        <span>
                          {t(
                            'landing.consultations.fields.needsAudit.option.yes',
                          )}
                        </span>
                      </label>
                      <label className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1">
                        <input
                          type="radio"
                          name="needsAudit"
                          className="h-3 w-3 rounded-full border-slate-600 bg-slate-900 text-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          value="no"
                          onChange={() => setNeedsAudit('no')}
                        />
                        <span>
                          {t(
                            'landing.consultations.fields.needsAudit.option.no',
                          )}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div
                    className={`mt-2 space-y-3 text-xs ${
                      needsAudit === 'no'
                        ? 'opacity-40 grayscale'
                        : 'opacity-100'
                    }`}
                  >
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-200">
                        {t('landing.consultations.audit.platforms.label')}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1.5">
                          <input
                            type="checkbox"
                            className="h-3 w-3 rounded border-slate-600 bg-slate-950 text-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          />
                          <span className="truncate">
                            {t(
                              'landing.consultations.audit.platforms.option.googleAds',
                            )}
                          </span>
                        </label>
                        <label className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1.5">
                          <input
                            type="checkbox"
                            className="h-3 w-3 rounded border-slate-600 bg-slate-950 text-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          />
                          <span className="truncate">
                            {t(
                              'landing.consultations.audit.platforms.option.metaAds',
                            )}
                          </span>
                        </label>
                        <label className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1.5">
                          <input
                            type="checkbox"
                            className="h-3 w-3 rounded border-slate-600 bg-slate-950 text-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          />
                          <span className="truncate">
                            {t(
                              'landing.consultations.audit.platforms.option.tiktokAds',
                            )}
                          </span>
                        </label>
                        <label className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1.5">
                          <input
                            type="checkbox"
                            className="h-3 w-3 rounded border-slate-600 bg-slate-950 text-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          />
                          <span className="truncate">
                            {t(
                              'landing.consultations.audit.platforms.option.allegroAds',
                            )}
                          </span>
                        </label>
                        <label className="col-span-2 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1.5">
                          <input
                            type="checkbox"
                            className="h-3 w-3 rounded border-slate-600 bg-slate-950 text-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          />
                          <span className="truncate">
                            {t(
                              'landing.consultations.audit.platforms.option.other',
                            )}
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-slate-200">
                          {t(
                            'landing.consultations.audit.campaignsCount.label',
                          )}
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/50 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-slate-200">
                          {t('landing.consultations.audit.budget.label')}
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/50 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-200">
                        {t('landing.consultations.audit.goal.label')}
                      </label>
                      <select
                        className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/50 focus:border-emerald-500 focus:ring-1"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          {t(
                            'landing.consultations.audit.goal.placeholder',
                          )}
                        </option>
                        <option value="sales">
                          {t(
                            'landing.consultations.audit.goal.option.sales',
                          )}
                        </option>
                        <option value="leads">
                          {t(
                            'landing.consultations.audit.goal.option.leads',
                          )}
                        </option>
                        <option value="traffic">
                          {t(
                            'landing.consultations.audit.goal.option.traffic',
                          )}
                        </option>
                        <option value="brand">
                          {t(
                            'landing.consultations.audit.goal.option.brand',
                          )}
                        </option>
                        <option value="other">
                          {t(
                            'landing.consultations.audit.goal.option.other',
                          )}
                        </option>
                      </select>
                    </div>
                  </div>
                </fieldset>
              </div>

              {/* CTA i notka */}
              <div className="mt-6 space-y-3">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-slate-950 shadow-sm transition hover:bg-emerald-400 hover:shadow-md"
                >
                  {t('landing.consultations.submit.label')}
                </button>
                <p className="text-[11px] text-slate-400">
                  {t('landing.consultations.submit.note')}
                </p>
                {submitted && (
                  <p className="text-[11px] text-emerald-400">
                    {t('landing.consultations.submit.demoMessage')}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ConsultationSection;
