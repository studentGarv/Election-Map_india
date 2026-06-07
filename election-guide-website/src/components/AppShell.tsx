import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';

/**
 * AppShell — top-level layout component.
 *
 * Renders the NavBar at the top, the routed page content via <Outlet />,
 * and the Footer at the bottom. Uses a flex-column layout so the footer
 * stays at the bottom of the viewport even on short pages.
 */
const AppShell: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default AppShell;
