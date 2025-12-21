import { Outlet } from 'react-router-dom';
import CookieBanner from '../components/compliance/CookieBanner';

const RootLayout = () => {
  return (
    <div className="app-root">
      <Outlet />
      <CookieBanner />
    </div>
  );
};

export default RootLayout;
