'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import styles from './ContactForm.module.css';

type FormData = {
  name: string;
  email: string;
  phone: string;
  brokerage: string;
  countryCode: string;
  honeypot: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

export function ContactForm() {
  const [data, setData] = useState<FormData>({
    name: '', email: '', phone: '', brokerage: '', countryCode: '', honeypot: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  function validate(): boolean {
    const errs: Errors = {};
    if (!data.name.trim()) errs.name = 'Full name is required.';
    if (data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!/^\+[1-9]\d{0,2}$/.test(data.countryCode.trim())) errs.countryCode = 'Enter a country calling code, for example +1.';
    const digits = data.phone.replace(/\D/g, '');
    if (!digits) errs.phone = 'Phone number is required.';
    else if (data.countryCode.trim() === '+1' && digits.length !== 10) errs.phone = 'Enter a 10-digit phone number for +1.';
    else if (digits.length < 4 || digits.length + data.countryCode.replace(/\D/g, '').length > 15) errs.phone = 'Please enter a valid phone number.';
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
    setData({ name: '', email: '', phone: '', brokerage: '', countryCode: '', honeypot: '' });

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
          required
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
          Confidential Email Address <span className={styles.optional}>(optional)</span>
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

      <div className={styles.phoneRow}>
        <div className={styles.group}>
          <label htmlFor="contact-country" className={styles.label}>Country Code <span className={styles.required}>*</span></label>
          <input id="contact-country" type="tel" autoComplete="tel-country-code" required
            className={`${styles.input} ${errors.countryCode ? styles.inputError : ''}`}
            placeholder="+1" value={data.countryCode}
            onChange={e => update('countryCode', e.target.value.replace(/[^+0-9]/g, ''))}
            onBlur={() => { const digits = data.countryCode.replace(/\D/g, ''); if (digits) update('countryCode', `+${digits}`); }}
            aria-invalid={!!errors.countryCode} aria-describedby={errors.countryCode ? 'country-error' : undefined} />
          {errors.countryCode && <p id="country-error" role="alert" className={styles.error}>{errors.countryCode}</p>}
        </div>
        <div className={styles.group}>
          <label htmlFor="contact-phone" className={styles.label}>Phone Number <span className={styles.required}>*</span></label>
          <input id="contact-phone" type="tel" autoComplete="tel-national" required
            className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
            placeholder={data.countryCode === '+1' ? '954-478-7000' : 'Phone number'} value={data.phone}
            onChange={e => update('phone', e.target.value.replace(/[^0-9 ()-]/g, ''))}
            onBlur={() => { if (data.countryCode.trim() === '+1') { const digits = data.phone.replace(/\D/g, ''); if (digits.length === 10) update('phone', `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`); } }}
            aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'phone-error' : undefined} />
          {errors.phone && <p id="phone-error" role="alert" className={styles.error}>{errors.phone}</p>}
        </div>
      </div>

      <div className={styles.group}>
        <label htmlFor="contact-brokerage" className={styles.label}>
          Current Market Focus <span className={styles.optional}>(optional)</span>
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


      {/* Add a Privacy Policy link here once the client supplies the policy page. */}
      <p className={styles.privacy}>
        All inquiries are treated with the utmost confidentiality.
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
