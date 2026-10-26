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
  overlayVariant?: 'standard' | 'natural';
  primaryCta?: CtaProps;
  secondaryCta?: CtaProps;
  /** Intrinsic ratio of the tablet video. Defaults to 16/9 when unknown. */
  tabletAspect?: string;
  /** Intrinsic ratio of the mobile video. Home mobile cut is a 9:16 portrait. */
  mobileAspect?: string;
};

export function CinematicHero({
  label,
  title,
  subtitle,
  posterSrc,
  videoSrc,
  mobileVideoSrc,
  tabletVideoSrc,
  overlayVariant = 'standard',
  primaryCta,
  secondaryCta,
  tabletAspect = '16 / 9',
  mobileAspect = '16 / 9',
}: Props) {
  const titleText = typeof title === 'string' ? title : 'Yacht Broker Services';
  return (
    <section className={styles.hero}>
      {/* Narrow screens: light intro panel first … */}
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

      {/* … then the media in its own correctly-proportioned container. */}
      <div
        className={styles.heroVisual}
        data-hero-visual
        style={{ ['--tablet-aspect' as string]: tabletAspect, ['--mobile-aspect' as string]: mobileAspect }}
      >
        <div className={styles.heroMedia}>
          <Image
            src={posterSrc}
            alt={titleText}
            fill
            priority
            sizes="100vw"
            className={`${styles.heroMediaImg} ${videoSrc ? styles.hasVideo : ''}`}
          />
          {videoSrc && (
            <HeroVideo
              src={videoSrc}
              posterSrc={posterSrc}
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
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
