import Link from 'next/link';
import { type ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'default' | 'lg';
  href?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  id?: string;
  fullWidth?: boolean;
  onClick?: () => void;
};

export function Button({
  children,
  variant = 'primary',
  size = 'default',
  href,
  type = 'button',
  disabled,
  className = '',
  id,
  fullWidth,
  onClick,
}: ButtonProps) {
  const cls = [
    styles.btn,
    styles[variant],
    size === 'lg' ? styles.lg : '',
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (href) {
    return (
      <Link href={href} className={cls} id={id}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={cls}
      disabled={disabled}
      id={id}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
