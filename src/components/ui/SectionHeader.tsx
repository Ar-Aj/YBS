import { Stagger } from '@/components/motion/Stagger';
import styles from './SectionHeader.module.css';

type Props = {
  label?: string;
  title: string;
  subtitle?: string;
  light?: boolean;
};

/**
 * Section heading with optional supporting copy. Server HTML is fully visible.
 */
export function SectionHeader({ label, title, subtitle, light }: Props) {
  return (
    <Stagger className={styles.header}>
      {label && <span className={styles.label}>{label}</span>}
      <h2 className={light ? styles.titleLight : undefined}>{title}</h2>
      {subtitle && <p className={light ? styles.subtitleLight : undefined}>{subtitle}</p>}
    </Stagger>
  );
}

export function EyebrowLabel({
  children,
  className = '',
}: {
  children: string;
  className?: string;
}) {
  return <span className={`${styles.label} ${className}`}>{children}</span>;
}
