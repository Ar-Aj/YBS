import { Stagger } from '@/components/motion/Stagger';
import { DrawRule } from '@/components/motion/DrawRule';
import styles from './SectionHeader.module.css';

type Props = {
  label?: string;
  title: string;
  subtitle?: string;
  light?: boolean;
};

/**
 * Section heading. Label, title, rule and subtitle arrive in order, with the
 * gold rule drawing across after the title. Server HTML is fully visible.
 */
export function SectionHeader({ label, title, subtitle, light }: Props) {
  return (
    <Stagger className={styles.header}>
      {label && <span className={styles.label}>{label}</span>}
      <h2 className={light ? styles.titleLight : undefined}>{title}</h2>
      <div className={styles.ruleWrap}>
        <DrawRule center delay={450} />
      </div>
      {subtitle && <p className={light ? styles.subtitleLight : undefined}>{subtitle}</p>}
    </Stagger>
  );
}

export function GoldRule({
  center,
  className = '',
  delay = 0,
}: {
  center?: boolean;
  className?: string;
  delay?: number;
}) {
  return (
    <DrawRule
      center={center}
      delay={delay}
      className={className}
      style={{ marginBlock: 'var(--space-md)' }}
    />
  );
}

export function EyebrowLabel({ children, className = '' }: { children: string; className?: string }) {
  return <span className={`${styles.label} ${className}`}>{children}</span>;
}
