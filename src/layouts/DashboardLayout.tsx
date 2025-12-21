import { useState, type ReactNode } from 'react';
import AiDrawer from '../components/ai/AiDrawer';
import Sidebar from '../components/nav/Sidebar';
import Topbar from '../components/nav/Topbar';
import Footer from '../components/nav/Footer';

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isAiOpen, setIsAiOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Topbar onOpenAiDrawer={() => setIsAiOpen(true)} />
        <main className="dashboard-content">{children}</main>
        <Footer />
      </div>
      <AiDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
};

export default DashboardLayout;
