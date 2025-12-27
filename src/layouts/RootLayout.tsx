import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import CookieBanner from '../components/compliance/CookieBanner';
import SuspenseFallback from '../components/common/SuspenseFallback';

const RootLayout = () => {
  return (
    <div className="app-root">
      <Suspense fallback={<SuspenseFallback />}>
        <Outlet />
      </Suspense>
      <CookieBanner />
    </div>
  );
};

export default RootLayout;
