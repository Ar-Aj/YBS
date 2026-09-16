import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <section className={styles.wrap}>
      <div className={styles.content}>
        <span className={styles.code}>404</span>
        <h1>Page Not Found</h1>
        <p>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let us help you find what you need.
        </p>
        <div className={styles.actions}>
          <Button href="/" size="lg">Back to Home</Button>
          <Button href="/contact" variant="secondary" size="lg">Contact Us</Button>
        </div>
        <nav className={styles.links}>
          <Link href="/services">Services</Link>
          <Link href="/the-ybs-difference">The Difference</Link>
          <Link href="/how-it-works">How It Works</Link>
          <Link href="/faq">FAQ</Link>
        </nav>
      </div>
    </section>
  );
}
