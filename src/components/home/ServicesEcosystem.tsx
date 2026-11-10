import { SectionHeader } from '@/components/ui/SectionHeader';
import { Section, Container } from '@/components/layout/Section';
import { Stagger } from '@/components/motion/Stagger';
import { PillarIcon } from '@/components/motion/PillarIcon';
import { servicePillars } from '@/data/services';
import styles from './ServicesEcosystem.module.css';

/** The single, complete service list; also the destination for legacy /services links. */
export function ServicesEcosystem() {
  return (
    <Section variant="white" id="services" ariaLabel="Membership services">
      <Container>
        <SectionHeader title="One Membership, Four Areas of Support" />
        <Stagger className={styles.pillars}>
          {servicePillars.map((pillar) => (
            <article key={pillar.title} className={styles.card}>
              <span className={styles.icon}>
                <PillarIcon icon={pillar.icon} />
              </span>
              <h3 className={styles.cardTitle}>{pillar.title}</h3>
              <p className={styles.cardDesc}>{pillar.description}</p>
              <ul className={styles.features}>
                {pillar.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </article>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
