'use client';

import { useI18n } from '@papadata/i18n';
import {
  BarChart3,
  LineChart,
  PieChart,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';

function FeaturesSection() {
  const  t  = useI18n();

  return (
    <section
      id="features"
      className="border-t border-slate-800 bg-slate-950 py-16 md:py-20"
    >
      <div className="mx-auto max-w-6xl px-4">
        {/* Nagłówek sekcji */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            {t('landing.hero.tagline')}
          </p>
          <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
            {t('landing.features.sectionTitle')}
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-300">
            {t('landing.features.sectionSubtitle')}
          </p>
        </div>

        {/* 3 bloki funkcji */}
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {/* Sprzedaż */}
          <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-500/60 hover:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Sales & margin
                </p>
                <h3 className="text-sm md:text-base font-semibold text-slate-50">
                  {t('landing.features.salesAnalysis.title')}
                </h3>
              </div>
            </div>

            <p className="mt-3 text-xs md:text-sm text-slate-300">
              {t('landing.features.salesAnalysis.description')}
            </p>

            <div className="mt-4 space-y-3 text-xs md:text-sm text-slate-200">
              <FeatureTile
                icon={<TrendingUp className="h-3.5 w-3.5" />}
                title={t(
                  'landing.features.salesAnalysis.tile.growthDrops.title',
                )}
                description={t(
                  'landing.features.salesAnalysis.tile.growthDrops.description',
                )}
              />
              <FeatureTile
                icon={<PieChart className="h-3.5 w-3.5" />}
                title={t(
                  'landing.features.salesAnalysis.tile.productCohorts.title',
                )}
                description={t(
                  'landing.features.salesAnalysis.tile.productCohorts.description',
                )}
              />
              <FeatureTile
                icon={<BarChart3 className="h-3.5 w-3.5" />}
                title={t(
                  'landing.features.salesAnalysis.tile.marginByChannel.title',
                )}
                description={t(
                  'landing.features.salesAnalysis.tile.marginByChannel.description',
                )}
              />
              <FeatureTile
                icon={<LineChart className="h-3.5 w-3.5" />}
                title={t(
                  'landing.features.salesAnalysis.tile.forecast.title',
                )}
                description={t(
                  'landing.features.salesAnalysis.tile.forecast.description',
                )}
              />
            </div>
          </div>

          {/* Marketing */}
          <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-500/60 hover:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Marketing
                </p>
                <h3 className="text-sm md:text-base font-semibold text-slate-50">
                  {t('landing.features.marketing.title')}
                </h3>
              </div>
            </div>

            <p className="mt-3 text-xs md:text-sm text-slate-300">
              {t('landing.features.marketing.description')}
            </p>

            <div className="mt-4 space-y-3 text-xs md:text-sm text-slate-200">
              <FeatureTile
                icon={<BarChart3 className="h-3.5 w-3.5" />}
                title={t(
                  'landing.features.marketing.tile.campaignPerformance.title',
                )}
                description={t(
                  'landing.features.marketing.tile.campaignPerformance.description',
                )}
              />
              <FeatureTile
                icon={<PieChart className="h-3.5 w-3.5" />}
                title={t(
                  'landing.features.marketing.tile.roasByChannel.title',
                )}
                description={t(
                  'landing.features.marketing.tile.roasByChannel.description',
                )}
              />
              <FeatureTile
                icon={<LineChart className="h-3.5 w-3.5" />}
                title={t(
                  'landing.features.marketing.tile.funnelAnalysis.title',
                )}
                description={t(
                  'landing.features.marketing.tile.funnelAnalysis.description',
                )}
              />
            </div>
          </div>

          {/* Klienci */}
          <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-500/60 hover:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Customers
                </p>
                <h3 className="text-sm md:text-base font-semibold text-slate-50">
                  {t('landing.features.customers.title')}
                </h3>
              </div>
            </div>

            <p className="mt-3 text-xs md:text-sm text-slate-300">
              {t('landing.features.customers.description')}
            </p>

            <div className="mt-4 space-y-3 text-xs md:text-sm text-slate-200">
              <FeatureTile
                icon={<Users className="h-3.5 w-3.5" />}
                title={t(
                  'landing.features.customers.tile.customersOverview.title',
                )}
                description={t(
                  'landing.features.customers.tile.customersOverview.description',
                )}
              />
              <FeatureTile
                icon={<TrendingUp className="h-3.5 w-3.5" />}
                title={t('landing.features.customers.tile.loyalty.title')}
                description={t(
                  'landing.features.customers.tile.loyalty.description',
                )}
              />
              <FeatureTile
                icon={<Target className="h-3.5 w-3.5" />}
                title={t('landing.features.customers.tile.churn.title')}
                description={t(
                  'landing.features.customers.tile.churn.description',
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type FeatureTileProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function FeatureTile({ icon, title, description }: FeatureTileProps) {
  return (
    <div className="flex gap-2.5 rounded-xl bg-slate-950/70 p-2.5">
      <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-900 text-emerald-300">
        {icon}
      </div>
      <div>
        <p className="text-[13px] font-medium text-slate-50">{title}</p>
        <p className="mt-0.5 text-[11px] md:text-[12px] text-slate-300">
          {description}
        </p>
      </div>
    </div>
  );
}

export default FeaturesSection;
