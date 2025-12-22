import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import CookieBanner from '../components/compliance/CookieBanner';
import SuspenseLoader from '../components/common/SuspenseLoader';

const RootLayout = () => {
  return (
    <div className="app-root">
      <Suspense fallback={<SuspenseLoader />}>
        <Outlet />
      </Suspense>
      <CookieBanner />
    </div>
  );
};

export default RootLayout;
