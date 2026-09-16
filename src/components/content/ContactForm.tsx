'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import styles from './ContactForm.module.css';

type FormData = {
  name: string;
  email: string;
  phone: string;
  brokerage: string;
  message: string;
  honeypot: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

export function ContactForm() {
  const [data, setData] = useState<FormData>({
    name: '', email: '', phone: '', brokerage: '', message: '', honeypot: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  function validate(): boolean {
    const errs: Errors = {};
    if (!data.name.trim()) errs.name = 'Full name is required.';
    if (!data.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!data.message.trim()) errs.message = 'Please include a message.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    // Honeypot check
    if (data.honeypot) return;

    setStatus('sending');

    // REPLACE: Connect to your form endpoint (Formspree, API route, etc.)
    await new Promise((r) => setTimeout(r, 1200));

    setStatus('success');
    setData({ name: '', email: '', phone: '', brokerage: '', message: '', honeypot: '' });

    setTimeout(() => setStatus('idle'), 5000);
  }

  function update(field: keyof FormData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  if (status === 'success') {
    return (
      <div className={styles.success} role="alert">
        <div className={styles.successIcon}>✓</div>
        <h3>Message Sent</h3>
        <p>Thank you for reaching out. We will be in touch within one business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      {/* Honeypot */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={data.honeypot}
          onChange={(e) => update('honeypot', e.target.value)}
        />
      </div>

      <div className={styles.group}>
        <label htmlFor="contact-name" className={styles.label}>
          Full Name <span className={styles.required}>*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          placeholder="Your full name"
          value={data.name}
          onChange={(e) => update('name', e.target.value)}
          autoComplete="name"
          aria-describedby={errors.name ? 'name-error' : undefined}
          aria-invalid={!!errors.name}
        />
        {errors.name && <p id="name-error" role="alert" className={styles.error}>{errors.name}</p>}
      </div>

      <div className={styles.group}>
        <label htmlFor="contact-email" className={styles.label}>
          Confidential Email Address <span className={styles.required}>*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          placeholder="your@email.com"
          value={data.email}
          onChange={(e) => update('email', e.target.value)}
          autoComplete="email"
          aria-describedby={errors.email ? 'email-error' : undefined}
          aria-invalid={!!errors.email}
        />
        {errors.email && <p id="email-error" role="alert" className={styles.error}>{errors.email}</p>}
      </div>

      <div className={styles.group}>
        <label htmlFor="contact-phone" className={styles.label}>
          Phone Number <span className={styles.optional}>(optional)</span>
        </label>
        <input
          id="contact-phone"
          type="tel"
          className={styles.input}
          placeholder="+1 (555) 000-0000"
          value={data.phone}
          onChange={(e) => update('phone', e.target.value)}
          autoComplete="tel"
        />
      </div>

      <div className={styles.group}>
        <label htmlFor="contact-brokerage" className={styles.label}>
          Current Brokerage / Market Focus <span className={styles.optional}>(optional)</span>
        </label>
        <input
          id="contact-brokerage"
          type="text"
          className={styles.input}
          placeholder="e.g. Southeast Florida, Mediterranean charters"
          value={data.brokerage}
          onChange={(e) => update('brokerage', e.target.value)}
        />
      </div>

      <div className={styles.group}>
        <label htmlFor="contact-message" className={styles.label}>
          Message / Preferred Time to Connect <span className={styles.required}>*</span>
        </label>
        <textarea
          id="contact-message"
          className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
          placeholder="Tell us about your brokerage experience and what you're looking for..."
          value={data.message}
          onChange={(e) => update('message', e.target.value)}
          aria-describedby={errors.message ? 'message-error' : undefined}
          aria-invalid={!!errors.message}
        />
        {errors.message && <p id="message-error" role="alert" className={styles.error}>{errors.message}</p>}
      </div>

      {/* REPLACE: Update with real privacy policy link */}
      <p className={styles.privacy}>
        By submitting this form, you agree to our{' '}
        <a href="/privacy-policy">Privacy Policy</a>. All inquiries are treated
        with the utmost confidentiality.
      </p>

      <Button
        type="submit"
        size="lg"
        fullWidth
        disabled={status === 'sending'}
      >
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}
