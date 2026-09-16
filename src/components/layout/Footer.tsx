import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/data/site';
import { footerNav } from '@/data/navigation';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Image src="/Logo.png" alt="Yacht Broker Services logo" width={160} height={44} />
            <p>
              Empowering elite yacht brokers with the infrastructure, support,
              and autonomy to build their own independent brokerage brand.
            </p>
          </div>

          <div>
            <h4 className={styles.heading}>Navigate</h4>
            {footerNav.navigate.map((link) => (
              <Link key={link.href} href={link.href} className={styles.link}>
                {link.label}
              </Link>
            ))}
          </div>

          <div>
            <h4 className={styles.heading}>Learn More</h4>
            {footerNav.learnMore.map((link) => (
              <Link key={link.href} href={link.href} className={styles.link}>
                {link.label}
              </Link>
            ))}
          </div>

          <div>
            <h4 className={styles.heading}>Connect</h4>
            <a href={`mailto:${siteConfig.email}`} className={styles.link}>
              {siteConfig.email}
            </a>
            <Link href="/contact" className={styles.link}>
              Book a Strategy Session
            </Link>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>&copy; {new Date().getFullYear()} Yacht Broker Services. All rights reserved.</span>
          <span>Designed with precision for the world&apos;s finest brokers.</span>
        </div>
      </div>
    </footer>
  );
}
