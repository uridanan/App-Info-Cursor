import { AppInfo } from '../../types/AppInfo';
import { IconDownloadButton } from '../IconDownloadButton/IconDownloadButton';
import styles from './AppInfoCard.module.css';

/**
 * Props for AppInfoCard component.
 */
export interface AppInfoCardProps {
  appInfo: AppInfo;
}

/**
 * Card component displaying app information.
 */
export function AppInfoCard({ appInfo }: AppInfoCardProps): JSX.Element {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <img src={appInfo.iconUrl} alt={appInfo.appName} className={styles.icon} />
        <div className={styles.titleSection}>
          <h2 className={styles.appName}>{appInfo.appName}</h2>
          <p className={styles.bundleId}>{appInfo.bundleId}</p>
          <IconDownloadButton iconUrl={appInfo.iconUrl} appName={appInfo.appName} />
        </div>
      </div>
      <div className={styles.description}>
        <h3>Description</h3>
        <p>{appInfo.description}</p>
      </div>
      <div className={styles.developer}>
        <h3>Developer</h3>
        <p><strong>Name:</strong> {appInfo.developer.name}</p>
        {appInfo.developer.email && (
          <p><strong>Email:</strong> {appInfo.developer.email}</p>
        )}
        {appInfo.developer.website && (
          <p>
            <strong>Website:</strong>{' '}
            <a href={appInfo.developer.website} target="_blank" rel="noopener noreferrer">
              {appInfo.developer.website}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
