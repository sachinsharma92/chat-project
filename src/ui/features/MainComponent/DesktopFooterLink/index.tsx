
import Link from 'next/link';
import './DesktopFooterLink.css';

const DesktopFooterLink = () => {
  return (
    <div className="desktop-footer-links">
      <p className='text-xs text-black'>© 2024</p>
      <nav className='nav-desktop'>
        <Link href="/">discord</Link>
        <Link href="/">X</Link>
        <Link href="/">instagram</Link>
        <Link href="/">reddit</Link>
        <Link href="/">terms</Link>
        <Link href="/">privacy</Link>
        <Link href="/">email</Link>

      </nav>
    </div>
  );
};

export default DesktopFooterLink;
