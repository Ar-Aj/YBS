import Image from 'next/image';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { HeroVideo } from './HeroVideo';
import styles from './CinematicHero.module.css';

type CtaProps = {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost';
};

type Props = {
  label?: string;
  title: ReactNode;
  subtitle?: string;
  posterSrc: string;
  videoSrc?: string;
  mobileVideoSrc?: string;
  tabletVideoSrc?: string;
  objectPositionDesktop?: string;
  objectPositionMobile?: string;
  overlayVariant?: 'standard' | 'natural';
  primaryCta?: CtaProps;
  secondaryCta?: CtaProps;
};

export function CinematicHero({
  label,
  title,
  subtitle,
  posterSrc,
  videoSrc,
  mobileVideoSrc,
  tabletVideoSrc,
  objectPositionDesktop = 'center center',
  objectPositionMobile = 'center center',
  overlayVariant = 'standard',
  primaryCta,
  secondaryCta,
}: Props) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBg}>
        {/* Always render poster image as fallback/mobile/pre-load */}
        <Image
          src={posterSrc}
          alt={typeof title === 'string' ? title : 'Yacht Broker Services'}
          fill
          priority
          sizes="100vw"
          style={{ objectPosition: objectPositionMobile }}
          className={`${styles.heroBgImg} ${videoSrc ? styles.hasVideo : ''}`}
        />
        
        {/* Render video only on desktop if provided, respecting prefers-reduced-motion in CSS */}
        {videoSrc && (
          <HeroVideo
            src={videoSrc}
            posterSrc={posterSrc}
            objectPositionDesktop={objectPositionDesktop}
            mobileSrc={mobileVideoSrc}
            tabletSrc={tabletVideoSrc}
          />
        )}
      </div>
      <div
        className={
          overlayVariant === 'natural'
            ? styles.heroOverlayNatural
            : styles.heroOverlay
        }
      />
      <div className={styles.heroContent}>
        <RevealOnScroll>
          {label && <span className={styles.label}>{label}</span>}
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
          
          {(primaryCta || secondaryCta) && (
            <div className={styles.heroActions}>
              {primaryCta && (
                <Button href={primaryCta.href} size="lg" variant={primaryCta.variant || 'primary'}>
                  {primaryCta.label}
                </Button>
              )}
              {secondaryCta && (
                <Button href={secondaryCta.href} size="lg" variant={secondaryCta.variant || 'ghost'}>
                  {secondaryCta.label}
                </Button>
              )}
            </div>
          )}
        </RevealOnScroll>
      </div>
    </section>
  );
}
