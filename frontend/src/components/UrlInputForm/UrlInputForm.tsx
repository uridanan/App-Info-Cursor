import { FormEvent, useState } from 'react';
import styles from './UrlInputForm.module.css';

/**
 * Props for UrlInputForm component.
 */
export interface UrlInputFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

/**
 * Form component for entering app store URLs.
 */
export function UrlInputForm({ onSubmit, isLoading }: UrlInputFormProps): JSX.Element {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    const trimmedUrl = url.trim();
    if (trimmedUrl) {
      onSubmit(trimmedUrl);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter App Store or Google Play URL"
        className={styles.input}
        disabled={isLoading}
      />
      <button type="submit" className={styles.button} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Fetch Info'}
      </button>
    </form>
  );
}
