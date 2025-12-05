'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useI18n } from '@papadata/i18n';
import { Calendar, ClipboardList, MessageCircle, Target, Users } from 'lucide-react';

export function ConsultationSection() {
  const t = useI18n();
  const [needsAudit, setNeedsAudit] = useState<'yes' | 'no' | null>(null);
  const [hasSpecificCase, setHasSpecificCase] = useState<'yes' | 'no' | null>(null);
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
    <section id="consultations" className="border-t border-brand-border bg-brand-dark py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
              {t('landing.hero.tagline')}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              {t('landing.consultations.sectionTitle')}
            </h2>
            <div className="mt-4 space-y-2 text-sm text-pd-muted md:text-base">
              {leadParagraphs.map((p: string, idx: number) => (
                <p key={idx} className="leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-6 grid gap-3 text-xs text-pd-muted md:text-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-brand-accent/10 text-brand-accent">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-pd-foreground">60 minut konsultacji</p>
                  <p className="text-pd-muted">
                    Skupiamy się na konkretnych decyzjach biznesowych, a nie na ogólnikach marketingowych.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-brand-accent/10 text-brand-accent">
                  <ClipboardList className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-pd-foreground">Analiza danych zamiast „czucia”</p>
                  <p className="text-pd-muted">
                    Omawiamy kampanie, sprzedaż, lejki i marżę w oparciu o twarde liczby.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-brand-accent/10 text-brand-accent">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-pd-foreground">Wersja demo formularza</p>
                  <p className="text-pd-muted">{t('landing.consultations.submit.note')}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <form
              onSubmit={handleSubmit}
              className="card-glass border border-brand-border/70 bg-brand-dark/70 p-5 shadow-lg md:p-6"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-pd-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-accent/10 text-brand-accent">
                  <Users className="h-4 w-4" />
                </div>
                <span>{t('landing.consultations.sectionTitle')}</span>
              </div>

              <div className="mt-5 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-pd-foreground">
                      {t('landing.consultations.fields.companyDescription.label')}
                    </label>
                    <textarea
                      className="min-h-[72px] w-full rounded-xl border border-brand-border/80 bg-brand-dark/70 px-3 py-2 text-xs text-pd-foreground outline-none ring-brand-accent/40 placeholder:text-pd-muted focus:border-brand-accent focus:ring-1"
                      placeholder={t('landing.consultations.fields.companyDescription.placeholder')}
                    />
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-pd-foreground">
                        {t('landing.consultations.fields.companySince.label')}
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-brand-border/80 bg-brand-dark/70 px-3 py-2 text-xs text-pd-foreground outline-none ring-brand-accent/40 placeholder:text-pd-muted focus:border-brand-accent focus:ring-1"
                        placeholder={t('landing.consultations.fields.companySince.placeholder')}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-pd-foreground">
                        {t('landing.consultations.fields.monthlyRevenue.label')}
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-brand-border/80 bg-brand-dark/70 px-3 py-2 text-xs text-pd-foreground outline-none ring-brand-accent/40 placeholder:text-pd-muted focus:border-brand-accent focus:ring-1"
                        placeholder={t('landing.consultations.fields.monthlyRevenue.placeholder')}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <fieldset className="space-y-2 rounded-xl border border-brand-border/60 bg-brand-dark/60 p-3">
                      <legend className="text-xs font-medium text-pd-foreground">
                        {t('landing.consultations.fields.isPremium.label')}
                      </legend>
                      <div className="space-y-1 text-xs text-pd-foreground">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="isPremium"
                            className="h-3 w-3 rounded-full border-brand-border bg-brand-card/10 text-brand-accent focus:ring-1 focus:ring-brand-accent"
                            value="yes"
                          />
                          <span>{t('landing.consultations.fields.isPremium.option.yes')}</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="isPremium"
                            className="h-3 w-3 rounded-full border-brand-border bg-brand-card/10 text-brand-accent focus:ring-1 focus:ring-brand-accent"
                            value="no"
                          />
                          <span>{t('landing.consultations.fields.isPremium.option.no')}</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="isPremium"
                            className="h-3 w-3 rounded-full border-brand-border bg-brand-card/10 text-brand-accent focus:ring-1 focus:ring-brand-accent"
                            value="unknown"
                          />
                          <span>{t('landing.consultations.fields.isPremium.option.unknown')}</span>
                        </label>
                      </div>
                    </fieldset>

                    <fieldset className="space-y-2 rounded-xl border border-brand-border/60 bg-brand-dark/60 p-3">
                      <legend className="text-xs font-medium text-pd-foreground">
                        {t('landing.consultations.fields.exportsAbroad.label')}
                      </legend>
                      <div className="space-y-1 text-xs text-pd-foreground">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="exportsAbroad"
                            className="h-3 w-3 rounded-full border-brand-border bg-brand-card/10 text-brand-accent focus:ring-1 focus:ring-brand-accent"
                            value="yes"
                          />
                          <span>{t('landing.consultations.fields.exportsAbroad.option.yes')}</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="exportsAbroad"
                            className="h-3 w-3 rounded-full border-brand-border bg-brand-card/10 text-brand-accent focus:ring-1 focus:ring-brand-accent"
                            value="no"
                          />
                          <span>{t('landing.consultations.fields.exportsAbroad.option.no')}</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="exportsAbroad"
                            className="h-3 w-3 rounded-full border-brand-border bg-brand-card/10 text-brand-accent focus:ring-1 focus:ring-brand-accent"
                            value="planning"
                          />
                          <span>{t('landing.consultations.fields.exportsAbroad.option.planning')}</span>
                        </label>
                      </div>
                    </fieldset>
                  </div>

                  <fieldset className="space-y-2 rounded-xl border border-brand-border/60 bg-brand-dark/60 p-3">
                    <legend className="text-xs font-medium text-pd-foreground">
                      {t('landing.consultations.fields.hasSpecificCase.label')}
                    </legend>
                    <div className="flex flex-wrap gap-3 text-xs text-pd-foreground">
                      <label className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-dark/80 px-3 py-1">
                        <input
                          type="radio"
                          name="hasSpecificCase"
                          className="h-3 w-3 rounded-full border-brand-border bg-brand-card/10 text-brand-accent focus:ring-1 focus:ring-brand-accent"
                          value="yes"
                          onChange={() => setHasSpecificCase('yes')}
                        />
                        <span>{t('landing.consultations.fields.hasSpecificCase.option.yes')}</span>
                      </label>
                      <label className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-dark/80 px-3 py-1">
                        <input
                          type="radio"
                          name="hasSpecificCase"
                          className="h-3 w-3 rounded-full border-brand-border bg-brand-card/10 text-brand-accent focus:ring-1 focus:ring-brand-accent"
                          value="no"
                          onChange={() => setHasSpecificCase('no')}
                        />
                        <span>{t('landing.consultations.fields.hasSpecificCase.option.no')}</span>
                      </label>
                    </div>
                  </fieldset>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-pd-foreground">
                      {t('landing.consultations.fields.specificCaseDescription.label')}
                    </label>
                    <textarea
                      className="min-h-[80px] w-full rounded-xl border border-brand-border/80 bg-brand-dark/70 px-3 py-2 text-xs text-pd-foreground outline-none ring-brand-accent/40 placeholder:text-pd-muted focus:border-brand-accent focus:ring-1"
                      placeholder={t('landing.consultations.fields.specificCaseDescription.placeholder')}
                    />
                    {hasSpecificCase === 'no' && (
                      <p className="mt-1 text-[11px] text-pd-muted">
                        Możesz zostawić to pole puste, jeżeli dopiero szukasz obszaru do omówienia.
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-brand-border/70 bg-brand-dark/60 p-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-pd-foreground">
                    <Target className="h-4 w-4 text-brand-accent" />
                    {t('landing.consultations.audit.title')}
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-medium text-pd-muted">
                      {t('landing.consultations.fields.needsAudit.label')}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-pd-foreground">
                      <label className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-dark/80 px-3 py-1">
                        <input
                          type="radio"
                          name="needsAudit"
                          className="h-3 w-3 rounded-full border-brand-border bg-brand-card/10 text-brand-accent focus:ring-1 focus:ring-brand-accent"
                          value="yes"
                          onChange={() => setNeedsAudit('yes')}
                        />
                        <span>{t('landing.consultations.fields.needsAudit.option.yes')}</span>
                      </label>
                      <label className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-dark/80 px-3 py-1">
                        <input
                          type="radio"
                          name="needsAudit"
                          className="h-3 w-3 rounded-full border-brand-border bg-brand-card/10 text-brand-accent focus:ring-1 focus:ring-brand-accent"
                          value="no"
                          onChange={() => setNeedsAudit('no')}
                        />
                        <span>{t('landing.consultations.fields.needsAudit.option.no')}</span>
                      </label>
                    </div>
                  </div>

                  <div
                    className={`space-y-3 text-xs transition-opacity ${
                      needsAudit === 'no' ? 'opacity-50 grayscale' : 'opacity-100'
                    }`}
                  >
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-pd-foreground">
                        {t('landing.consultations.audit.platforms.label')}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-2 rounded-lg border border-brand-border bg-brand-dark/80 px-2.5 py-1.5">
                          <input
                            type="checkbox"
                            className="h-3 w-3 rounded border-brand-border bg-brand-dark text-brand-accent focus:ring-1 focus:ring-brand-accent"
                          />
                          <span className="truncate">
                            {t('landing.consultations.audit.platforms.option.googleAds')}
                          </span>
                        </label>
                        <label className="flex items-center gap-2 rounded-lg border border-brand-border bg-brand-dark/80 px-2.5 py-1.5">
                          <input
                            type="checkbox"
                            className="h-3 w-3 rounded border-brand-border bg-brand-dark text-brand-accent focus:ring-1 focus:ring-brand-accent"
                          />
                          <span className="truncate">
                            {t('landing.consultations.audit.platforms.option.metaAds')}
                          </span>
                        </label>
                        <label className="flex items-center gap-2 rounded-lg border border-brand-border bg-brand-dark/80 px-2.5 py-1.5">
                          <input
                            type="checkbox"
                            className="h-3 w-3 rounded border-brand-border bg-brand-dark text-brand-accent focus:ring-1 focus:ring-brand-accent"
                          />
                          <span className="truncate">
                            {t('landing.consultations.audit.platforms.option.tiktokAds')}
                          </span>
                        </label>
                        <label className="flex items-center gap-2 rounded-lg border border-brand-border bg-brand-dark/80 px-2.5 py-1.5">
                          <input
                            type="checkbox"
                            className="h-3 w-3 rounded border-brand-border bg-brand-dark text-brand-accent focus:ring-1 focus:ring-brand-accent"
                          />
                          <span className="truncate">
                            {t('landing.consultations.audit.platforms.option.allegroAds')}
                          </span>
                        </label>
                        <label className="col-span-2 flex items-center gap-2 rounded-lg border border-brand-border bg-brand-dark/80 px-2.5 py-1.5">
                          <input
                            type="checkbox"
                            className="h-3 w-3 rounded border-brand-border bg-brand-dark text-brand-accent focus:ring-1 focus:ring-brand-accent"
                          />
                          <span className="truncate">
                            {t('landing.consultations.audit.platforms.option.other')}
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-pd-foreground">
                          {t('landing.consultations.audit.campaignsCount.label')}
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-xl border border-brand-border/80 bg-brand-dark/70 px-3 py-2 text-xs text-pd-foreground outline-none ring-brand-accent/40 placeholder:text-pd-muted focus:border-brand-accent focus:ring-1"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-pd-foreground">
                          {t('landing.consultations.audit.budget.label')}
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-xl border border-brand-border/80 bg-brand-dark/70 px-3 py-2 text-xs text-pd-foreground outline-none ring-brand-accent/40 placeholder:text-pd-muted focus:border-brand-accent focus:ring-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-pd-foreground">
                        {t('landing.consultations.audit.goal.label')}
                      </label>
                      <select
                        className="w-full rounded-xl border border-brand-border/80 bg-brand-dark/70 px-3 py-2 text-xs text-pd-foreground outline-none ring-brand-accent/40 focus:border-brand-accent focus:ring-1"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          {t('landing.consultations.audit.goal.placeholder')}
                        </option>
                        <option value="sales">{t('landing.consultations.audit.goal.option.sales')}</option>
                        <option value="leads">{t('landing.consultations.audit.goal.option.leads')}</option>
                        <option value="traffic">{t('landing.consultations.audit.goal.option.traffic')}</option>
                        <option value="brand">{t('landing.consultations.audit.goal.option.brand')}</option>
                        <option value="other">{t('landing.consultations.audit.goal.option.other')}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 rounded-xl bg-brand-dark/55 p-3 sm:p-4 lg:col-span-2">
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                    <p className="text-sm font-medium text-pd-foreground">{t('landing.consultations.sectionTitle')}</p>
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center rounded-full bg-brand-accent px-5 py-2.5 text-sm font-semibold text-brand-dark shadow-[0_12px_40px_rgba(56,189,248,0.35)] transition hover:-translate-y-0.5 hover:bg-brand-accent/90 hover:shadow-[0_16px_55px_rgba(56,189,248,0.45)] sm:w-auto"
                    >
                      {t('landing.consultations.submit.label')}
                    </button>
                  </div>
                  <p className="text-[11px] text-pd-muted">{t('landing.consultations.submit.note')}</p>
                  {submitted && <p className="text-[11px] text-brand-accent">{t('landing.consultations.submit.demoMessage')}</p>}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ConsultationSection;
