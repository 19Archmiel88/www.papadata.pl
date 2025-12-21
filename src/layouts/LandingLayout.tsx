import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/nav/Header';
import Footer from '../components/nav/Footer';
import FixedHud from '../components/hud/FixedHud';
import SwarmBackground from '../components/bg/SwarmBackground';
import InitLoader from '../components/common/InitLoader';
import '../styles/landing.css';
import '../styles/hivemind.css';

type LandingLayoutProps = {
  children?: ReactNode;
};

const LandingLayout = ({ children }: LandingLayoutProps) => {
  return (
    <div className="app-shell hivemind-shell">
      <InitLoader />
      <SwarmBackground />
      <FixedHud />
      <div className="hivemind-content">
        <Header />
        {children ?? <Outlet />}
        <Footer />
      </div>
    </div>
  );
};

export default LandingLayout;
