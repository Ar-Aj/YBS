import { type ReactNode } from 'react';
import styles from './Section.module.css';

type Props = {
  children: ReactNode;
  variant?: 'ivory' | 'white' | 'navy' | 'dark';
  className?: string;
  id?: string;
  ariaLabel?: string;
};

export function Section({
  children,
  variant = 'ivory',
  className = '',
  id,
  ariaLabel,
}: Props) {
  return (
    <section
      id={id}
      className={`${styles.section} ${styles[variant]} ${className}`}
      aria-label={ariaLabel}
    >
      {children}
    </section>
  );
}

export function Container({
  children,
  narrow,
  wide,
  className = '',
}: {
  children: ReactNode;
  narrow?: boolean;
  wide?: boolean;
  className?: string;
}) {
  const sizeClass = narrow
    ? styles.containerNarrow
    : wide
      ? styles.containerWide
      : '';

  return (
    <div className={`${styles.container} ${sizeClass} ${className}`}>
      {children}
    </div>
  );
}
