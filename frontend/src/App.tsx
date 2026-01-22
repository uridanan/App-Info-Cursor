import { UrlInputForm } from './components/UrlInputForm/UrlInputForm';
import { AppInfoCard } from './components/AppInfoCard/AppInfoCard';
import { useAppInfo } from './hooks/useAppInfo';
import { ApiService } from './services/ApiService';
import styles from './App.module.css';

const apiService = new ApiService();

/**
 * Main application component.
 */
export function App(): JSX.Element {
  const { appInfo, isLoading, error, fetchAppInfo } = useAppInfo(apiService);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>App Info Fetcher</h1>
        <p>Enter an Apple App Store or Google Play URL to get app details</p>
      </header>
      
      <main className={styles.main}>
        <UrlInputForm onSubmit={fetchAppInfo} isLoading={isLoading} />
        
        {error && <div className={styles.error}>{error}</div>}
        
        {appInfo && <AppInfoCard appInfo={appInfo} />}
      </main>
    </div>
  );
}
