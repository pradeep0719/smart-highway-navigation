import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

/** Main layout wrapper with header, content, and footer */
export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
