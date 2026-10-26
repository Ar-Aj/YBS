'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { primaryNav, mobileNav } from '@/data/navigation';

import styles from './Header.module.css';

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  // The menu is opened "for" a route. Deriving `menuOpen` from the current
  // pathname means a navigation closes it automatically — no reset effect.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          setScrolled(y > 24);
          const max = document.documentElement.scrollHeight - window.innerHeight;
          setProgress(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll lock is an external-system side effect of the menu state.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => {
    setMenuPath(null);
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuPath((prev) => (prev === pathname ? null : pathname));
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) closeMenu();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen, closeMenu]);

  return (
    <nav
      className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Scroll progress hairline — quiet, futuristic, non-disturbing */}
      <span
        className={styles.progress}
        aria-hidden="true"
        style={{ transform: `scaleX(${progress})` }}
      />
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="Yacht Broker Services — Home">
          <Image
            src="/Logo.png"
            alt="Yacht Broker Services logo"
            width={180}
            height={48}
            priority
          />
        </Link>

        <div className={styles.links}>
          {primaryNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.link} ${pathname === link.href ? styles.linkActive : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>



        <button
          className={`${styles.toggle} ${menuOpen ? styles.toggleActive : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile overlay */}
      <div
        className={`${styles.overlay} ${menuOpen ? styles.overlayActive : ''}`}
        role="dialog"
        aria-modal={menuOpen}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        {mobileNav.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.link} ${pathname === link.href ? styles.linkActive : ''}`}
            onClick={closeMenu}
          >
            {link.label}
          </Link>
        ))}

      </div>
    </nav>
  );
}
