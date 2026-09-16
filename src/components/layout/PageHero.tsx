import styles from './PageHero.module.css';

type Props = {
  label?: string;
  title: string;
  subtitle?: string;
};

export function PageHero({ label, title, subtitle }: Props) {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        {label && <span className={styles.label}>{label}</span>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className={styles.line} />
    </section>
  );
}
