import type { InsightPost } from '@/data/site';
import styles from './InsightCard.module.css';

export function InsightCard({
  post,
  featured = false,
}: {
  post: InsightPost;
  featured?: boolean;
}) {
  return (
    <article className={`${styles.card} ${featured ? styles.featured : ''}`}>
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
