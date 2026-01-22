import { useState } from 'react';
import styles from './IconDownloadButton.module.css';

/**
 * Props for IconDownloadButton component.
 */
export interface IconDownloadButtonProps {
  iconUrl: string;
  appName: string;
}

/**
 * Button component for downloading app icon.
 */
export function IconDownloadButton({ iconUrl, appName }: IconDownloadButtonProps): JSX.Element {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (): Promise<void> => {
    setIsDownloading(true);
    try {
      const response = await fetch(iconUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Determine file extension from content type or default to png
      const contentType = response.headers.get('content-type');
      const extension = contentType?.includes('jpeg') || contentType?.includes('jpg') ? 'jpg' : 'png';
      
      const sanitizedName = appName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.download = `${sanitizedName}_icon.${extension}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download icon:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button 
      className={styles.button} 
      onClick={handleDownload}
      disabled={isDownloading}
    >
      {isDownloading ? 'Downloading...' : 'Download Icon'}
    </button>
  );
}
