import Navbar from './Navbar';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';

const Layout = ({ children, noFooter = false }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <main style={{ flex: 1, paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {children}
      </main>
      {!noFooter && <Footer />}
      <MobileBottomNav />
    </div>
  );
};

export default Layout;
