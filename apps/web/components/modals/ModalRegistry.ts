import React from 'react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export type ModalMeta = {
  title?: string;
  description?: string;
  size?: ModalSize;
  disableEsc?: boolean;
  disableOverlayClose?: boolean;
};

export type ModalId =
  | 'auth'
  | 'about'
  | 'coming_soon'
  | 'contact'
  | 'pricing'
  | 'integrations'
  | 'integration_connect'
  | 'feature'
  | 'demo_notice'
  | 'trial_notice'
  | 'video'
  | 'promo';

export type ModalEntry = {
  id: ModalId;
  component: React.ComponentType<any>;
  meta?: ModalMeta;
};

const AuthModal = React.lazy(() =>
  import('../AuthSection').then((m: any) => ({ default: m.AuthSection ?? m.default })),
);

const AboutModal = React.lazy(() =>
  import('../AboutModal').then((m: any) => ({ default: m.AboutModal ?? m.default })),
);

const ComingSoonModal = React.lazy(() =>
  import('../ComingSoonModal').then((m: any) => ({ default: m.ComingSoonModal ?? m.default })),
);

const ContactModal = React.lazy(() =>
  import('../ContactModal').then((m: any) => ({ default: m.ContactModal ?? m.default })),
);

const PricingModal = React.lazy(() =>
  import('../PricingModal').then((m: any) => ({ default: m.PricingModal ?? m.default })),
);

const IntegrationsModal = React.lazy(() =>
  import('../IntegrationsModal').then((m: any) => ({ default: m.IntegrationsModal ?? m.default })),
);

const IntegrationConnectModal = React.lazy(() =>
  import('../IntegrationConnectModal').then((m: any) => ({ default: m.IntegrationConnectModal ?? m.default })),
);

const FeatureModal = React.lazy(() =>
  import('../FeatureModal').then((m: any) => ({ default: m.FeatureModal ?? m.default })),
);

const DemoNoticeModal = React.lazy(() =>
  import('../DemoNoticeModal').then((m: any) => ({ default: m.DemoNoticeModal ?? m.default })),
);

const TrialNoticeModal = React.lazy(() =>
  import('../TrialNoticeModal').then((m: any) => ({ default: m.TrialNoticeModal ?? m.default })),
);

const VideoModal = React.lazy(() =>
  import('../VideoModal').then((m: any) => ({ default: m.VideoModal ?? m.default })),
);

const PromoModal = React.lazy(() =>
  import('../PromoModal').then((m: any) => ({ default: m.PromoModal ?? m.default })),
);

export const ModalRegistry: Record<ModalId, ModalEntry> = {
  auth: {
    id: 'auth',
    component: AuthModal,
    meta: {
      size: 'lg',
      title: 'Authentication',
      description: 'Sign in / Create account',
    },
  },
  about: {
    id: 'about',
    component: AboutModal,
    meta: {
      size: 'lg',
      title: 'About',
      description: 'About PapaData',
    },
  },
  coming_soon: {
    id: 'coming_soon',
    component: ComingSoonModal,
    meta: {
      size: 'md',
      title: 'Coming soon',
      description: 'Feature is not available yet',
    },
  },
  contact: {
    id: 'contact',
    component: ContactModal,
    meta: {
      size: 'lg',
      title: 'Contact',
      description: 'Contact form',
    },
  },
  pricing: {
    id: 'pricing',
    component: PricingModal,
    meta: {
      size: 'xl',
      title: 'Pricing',
      description: 'Compare plans',
    },
  },
  integrations: {
    id: 'integrations',
    component: IntegrationsModal,
    meta: {
      size: 'xl',
      title: 'Integrations',
      description: 'Connectors and categories',
    },
  },
  integration_connect: {
    id: 'integration_connect',
    component: IntegrationConnectModal,
    meta: {
      size: 'lg',
      title: 'Connect integration',
      description: 'Authorize and configure integration',
    },
  },
  feature: {
    id: 'feature',
    component: FeatureModal,
    meta: {
      size: 'lg',
      title: 'Feature',
      description: 'Feature details',
    },
  },
  demo_notice: {
    id: 'demo_notice',
    component: DemoNoticeModal,
    meta: {
      size: 'md',
      title: 'Demo mode',
      description: 'Demo data notice',
    },
  },
  trial_notice: {
    id: 'trial_notice',
    component: TrialNoticeModal,
    meta: {
      size: 'md',
      title: 'Trial notice',
      description: 'Trial status notice',
    },
  },
  video: {
    id: 'video',
    component: VideoModal,
    meta: {
      size: 'xl',
      title: 'Video',
      description: 'Product video',
    },
  },
  promo: {
    id: 'promo',
    component: PromoModal,
    meta: {
      size: 'xl',
      title: 'Promo',
      description: 'Trial & plan selection',
      // jeśli chcesz, żeby nie dało się zamknąć kliknięciem w tło:
      // disableOverlayClose: true,
    },
  },
};
