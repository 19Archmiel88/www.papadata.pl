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
  const isPl = t.locale === 'pl';

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

  const handleOpenCatalog = () => {
    if (typeof document !== 'undefined') {
      document.dispatchEvent(new Event('papadata:openIntegrationsCatalog'));
    }
  };

  return (
    <section
      id="integrations"
      className="border-t border-brand-border bg-brand-dark py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 md:grid-cols-[1.3fr_minmax(0,1fr)] md:items-center">
          {/* Teksty sekcji */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
              Integracje
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
              {isPl
                ? 'Integrujemy się z platformami, których już używasz'
                : 'We integrate with the platforms you already use'}
            </h2>
            <p className="mt-3 text-sm md:text-base text-pd-muted">
              {isPl
                ? 'PapaData łączy dane z Twojego sklepu, kampanii reklamowych, marketplace’ów i narzędzi analitycznych. Jednym kliknięciem podłączasz źródła, a my zajmujemy się resztą (ETL, hurtownia, raporty).'
                : 'PapaData connects data from your store, ad platforms, marketplaces and analytics tools. You plug in the sources, we handle the rest (ETL, warehouse, reporting).'}
            </p>
            <p className="mt-4 text-xs md:text-sm text-pd-muted">
              {isPl
                ? 'Widoczne poniżej przykładowe integracje – pełny katalog otworzysz przyciskiem.'
                : 'Sample integrations below – open the full catalog with the button.'}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleOpenCatalog}
                className="inline-flex items-center justify-center rounded-xl bg-brand-accent px-4 py-2 text-sm font-medium text-pd-bg shadow-sm transition-colors hover:bg-brand-accent/90 hover:shadow-md"
              >
                {isPl ? 'Zobacz wszystkie integracje (30+)' : 'View all integrations (30+)'}
              </button>
              <p className="text-[11px] text-pd-muted">
                {isPl ? 'Statusy: Dostępne • Wkrótce • Głosowanie.' : 'Statuses: Available • Coming soon • Voting.'}
              </p>
            </div>
          </div>

          {/* Kafelki integracji */}
          <div className="rounded-2xl border border-brand-border bg-brand-card/10 p-4 md:p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl border border-transparent bg-brand-dark/80 p-3 transition-colors hover:border-brand-accent/60 hover:bg-brand-dark/60"
                >
                  <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-brand-accent/10 text-brand-accent">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-pd-foreground">
                      {t(item.nameKey)}
                    </p>
                    <p className="text-xs text-pd-muted">
                      {t(item.categoryKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-pd-muted">
              <span>WooCommerce · Shopify · Allegro · GA4 · Google Ads · Meta Ads…</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IntegrationsSection;
