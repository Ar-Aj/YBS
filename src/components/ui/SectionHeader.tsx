import styles from './SectionHeader.module.css';

type Props = {
  label?: string;
  title: string;
  subtitle?: string;
  light?: boolean;
};

export function SectionHeader({ label, title, subtitle, light }: Props) {
  return (
    <div className={styles.header}>
      {label && (
        <span className={styles.label}>{label}</span>
      )}
      <h2 className={light ? styles.titleLight : undefined}>{title}</h2>
      <hr className={styles.rule} />
      {subtitle && (
        <p className={light ? styles.subtitleLight : undefined}>{subtitle}</p>
      )}
    </div>
  );
}

export function GoldRule({ center, className = '' }: { center?: boolean; className?: string }) {
  return (
    <hr
      className={`${styles.goldRule} ${center ? styles.goldRuleCenter : ''} ${className}`}
    />
  );
}

export function EyebrowLabel({ children, className = '' }: { children: string; className?: string }) {
  return <span className={`${styles.label} ${className}`}>{children}</span>;
}
