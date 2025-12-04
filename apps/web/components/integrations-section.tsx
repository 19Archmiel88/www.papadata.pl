'use client';

import type { ReactNode } from 'react';
import { useI18n } from '@papadata/i18n';
import { Cloud, Database, Link2, ShoppingBag } from 'lucide-react';

type IntegrationCard<TKey> = {
  id: string;
  nameKey: TKey;
  categoryKey: TKey;
  icon: ReactNode;
};

export function IntegrationsSection() {
  const t = useI18n();
  type TKey = Parameters<typeof t>[0];

  const items: IntegrationCard<TKey>[] = [
    {
      id: 'woocommerce',
      nameKey: 'landing.integrations.items.woocommerce.name' as TKey,
      categoryKey:
        'landing.integrations.items.woocommerce.category' as TKey,
      icon: <ShoppingBag className="h-4 w-4" />,
    },
    {
      id: 'shopify',
      nameKey: 'landing.integrations.items.shopify.name' as TKey,
      categoryKey:
        'landing.integrations.items.shopify.category' as TKey,
      icon: <ShoppingBag className="h-4 w-4" />,
    },
    {
      id: 'allegro',
      nameKey: 'landing.integrations.items.allegro.name' as TKey,
      categoryKey:
        'landing.integrations.items.allegro.category' as TKey,
      icon: <ShoppingBag className="h-4 w-4" />,
    },
    {
      id: 'ga4',
      nameKey: 'landing.integrations.items.ga4.name' as TKey,
      categoryKey:
        'landing.integrations.items.ga4.category' as TKey,
      icon: <Database className="h-4 w-4" />,
    },
    {
      id: 'googleAds',
      nameKey: 'landing.integrations.items.googleAds.name' as TKey,
      categoryKey:
        'landing.integrations.items.googleAds.category' as TKey,
      icon: <Link2 className="h-4 w-4" />,
    },
    {
      id: 'metaAds',
      nameKey: 'landing.integrations.items.metaAds.name' as TKey,
      categoryKey:
        'landing.integrations.items.metaAds.category' as TKey,
      icon: <Link2 className="h-4 w-4" />,
    },
    {
      id: 'tiktokAds',
      nameKey: 'landing.integrations.items.tiktokAds.name' as TKey,
      categoryKey:
        'landing.integrations.items.tiktokAds.category' as TKey,
      icon: <Link2 className="h-4 w-4" />,
    },
    {
      id: 'idosell',
      nameKey: 'landing.integrations.items.idosell.name' as TKey,
      categoryKey:
        'landing.integrations.items.idosell.category' as TKey,
      icon: <ShoppingBag className="h-4 w-4" />,
    },
    {
      id: 'skyShop',
      nameKey: 'landing.integrations.items.skyShop.name' as TKey,
      categoryKey:
        'landing.integrations.items.skyShop.category' as TKey,
      icon: <ShoppingBag className="h-4 w-4" />,
    },
    {
      id: 'baseLinker',
      nameKey: 'landing.integrations.items.baseLinker.name' as TKey,
      categoryKey:
        'landing.integrations.items.baseLinker.category' as TKey,
      icon: <Cloud className="h-4 w-4" />,
    },
  ];

  return (
    <section
      id="integrations"
      className="border-t border-slate-800 bg-slate-950 py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 md:grid-cols-[1.3fr_minmax(0,1fr)] md:items-center">
          {/* Teksty sekcji */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Integracje
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
              {t('landing.integrations.sectionTitle')}
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-300">
              {t('landing.integrations.sectionIntro')}
            </p>
            <p className="mt-4 text-xs md:text-sm text-slate-400">
              {t('landing.integrations.sectionDescription')}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-sm transition-colors hover:bg-emerald-400 hover:shadow-md"
                // tutaj możesz później podpiąć otwieranie modala katalogu integracji
              >
                {t('landing.integrations.viewAllButton')}
              </button>
              <p className="text-[11px] text-slate-400">
                {t('landing.integrations.footer.note')}
              </p>
            </div>
          </div>

          {/* Kafelki integracji */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 md:p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl bg-slate-950/70 p-3 hover:border-emerald-500/60 hover:bg-slate-900 transition-colors border border-transparent"
                >
                  <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-50">
                      {t(item.nameKey)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {t(item.categoryKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
              <span>
                WooCommerce · Shopify · Allegro · GA4 · Google Ads · Meta Ads…
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IntegrationsSection;
