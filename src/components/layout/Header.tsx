'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { primaryNav, mobileNav } from '@/data/navigation';

import styles from './Header.module.css';

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const navRef = useRef<HTMLElement>(null);
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

  // Wordmark scroll behaviour. Entirely ref-driven: one passive, rAF-throttled
  // listener flips `data-collapsed` only when the target state actually changes.
  //  - scrolling down (>12px of sustained travel, past the top zone) -> collapse
  //  - scrolling up   (>8px of sustained travel) or back at the top   -> reveal
  //  - scrolling stops for 250ms                                      -> reveal
  // Reduced-motion users keep the wordmark permanently visible and static.
  useEffect(() => {
    const el = wordmarkRef.current;
    if (!el) return;

    const nav = navRef.current;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lastY = window.scrollY;
    let travel = 0;
    let collapsed = false;
    let compact = false;
    let ticking = false;
    let idleTimer: number | undefined;

    const setCollapsed = (next: boolean) => {
      if (next === collapsed) return;
      collapsed = next;
      el.dataset.collapsed = String(next);
    };

    // Navbar size: shrinks while scrolling down, returns to full size ONLY on
    // an upward scroll (or at the top). Stopping the scroll does not restore it.
    const setCompact = (next: boolean) => {
      if (!nav || next === compact) return;
      compact = next;
      nav.dataset.compact = String(next);
    };

    const onIdle = () => {
      travel = 0;
      setCollapsed(false);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (mq.matches) return;

        const y = Math.max(0, window.scrollY);
        const delta = y - lastY;
        lastY = y;

        if (y <= 24) {
          travel = 0;
          setCollapsed(false);
          setCompact(false);
        } else if (delta !== 0) {
          // Sum travel only while direction is constant; a reversal restarts it.
          travel = Math.sign(delta) === Math.sign(travel) ? travel + delta : delta;
          if (travel > 12) {
            setCollapsed(true);
            setCompact(true);
          } else if (travel < -8) {
            setCollapsed(false);
            setCompact(false);
          }
        }

        window.clearTimeout(idleTimer);
        idleTimer = window.setTimeout(onIdle, 250);
      });
    };

    const onMotionPref = () => {
      if (mq.matches) {
        window.clearTimeout(idleTimer);
        onIdle();
        setCompact(false);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    mq.addEventListener('change', onMotionPref);
    return () => {
      window.removeEventListener('scroll', onScroll);
      mq.removeEventListener('change', onMotionPref);
      window.clearTimeout(idleTimer);
    };
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
      ref={navRef}
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
            width={137}
            height={77}
            sizes="137px"
            priority
          />
          {/* Wordmark: collapses on scroll-down (driven by data-collapsed via ref,
              so toggling never re-renders React). The link's aria-label already
              names the brand, so the visual collapse costs AT users nothing. */}
          <span className={styles.wordmark} ref={wordmarkRef} aria-hidden="true">
            <span className={styles.wordmarkClip}>
              <span className={styles.logoText}>
                <span className={styles.logoTextDark}>Yacht Broker</span>{' '}
                <span className={styles.logoTextGold}>Services</span>
              </span>
            </span>
          </span>
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
