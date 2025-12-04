import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@papadata/i18n';
import SiteShell from '../components/site-shell';
import { ThemeProvider } from '../components/theme-provider';

export const metadata: Metadata = {
  title: 'PapaData - AI dla e-commerce',
  description: 'AI, które analizuje Twoje dane e-commerce.',
};

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html lang="pl" suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-50">
        <ThemeProvider>
          <I18nProvider initialLocale="pl">
            <SiteShell>{children}</SiteShell>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
