import Image from 'next/image';
import type { Founder } from '@/data/site';
import styles from './FounderProfile.module.css';

type Props = {
  founder: Founder;
  reverse?: boolean;
};

export function FounderProfile({ founder, reverse }: Props) {
  return (
    <div className={`${styles.profile} ${reverse ? styles.reverse : ''}`}>
      <div className={styles.imageWrap}>
        <Image
          src={founder.image}
          alt={`${founder.name} — ${founder.role}`}
          width={320}
          height={320}
          className={styles.image}
          sizes="(max-width: 768px) 280px, 480px"
        />
        {founder.placeholder && (
          <span className={styles.placeholderBadge}>
            Placeholder — replace with real photo
          </span>
        )}
      </div>
      <div className={styles.content}>
        <span className={styles.role}>{founder.role}</span>
        <h2 className={styles.name}>{founder.name}</h2>
        <hr className={styles.rule} />
        <p className={styles.bio}>{founder.bio}</p>
        {founder.linkedIn && (
          <a
            href={founder.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkedIn}
            aria-label={`${founder.name} on LinkedIn`}
          >
            LinkedIn →
          </a>
        )}
      </div>
    </div>
  );
}

/* Compact preview card for Home page */
export function FounderPreview({ founder }: { founder: Founder }) {
  return (
    <div className={styles.preview}>
      <Image
        src={founder.image}
        alt={`${founder.name} — ${founder.role}`}
        width={200}
        height={200}
        className={styles.previewImage}
        sizes="200px"
      />
      <h3 className={styles.previewName}>{founder.name}</h3>
      <span className={styles.previewRole}>{founder.role}</span>
    </div>
  );
}
