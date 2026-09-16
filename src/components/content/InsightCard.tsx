import type { InsightPost } from '@/data/site';
import styles from './InsightCard.module.css';

export function InsightCard({ post }: { post: InsightPost }) {
  return (
    <article className={styles.card}>
      <div className={styles.image}>
        <span className={styles.tag}>{post.tag}</span>
      </div>
      <div className={styles.content}>
        <span className={styles.date}>{post.date}</span>
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.excerpt}>{post.excerpt}</p>
        {!post.placeholder && (
          <span className={styles.link}>Read More →</span>
        )}
      </div>
    </article>
  );
}
