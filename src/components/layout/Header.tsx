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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => {
      document.body.style.overflow = prev ? '' : 'hidden';
      return !prev;
    });
  }, []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

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
