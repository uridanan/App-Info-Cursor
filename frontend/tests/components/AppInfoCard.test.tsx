import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppInfoCard } from '../../src/components/AppInfoCard/AppInfoCard';
import { AppInfo } from '../../src/types/AppInfo';

describe('AppInfoCard', () => {
  const mockAppInfo: AppInfo = {
    appName: 'Test App',
    iconUrl: 'https://example.com/icon.png',
    bundleId: 'com.test.app',
    description: 'A wonderful test application',
    developer: {
      name: 'Test Developer',
      email: 'dev@test.com',
      website: 'https://test.com',
    },
  };

  it('should render app name', () => {
    render(<AppInfoCard appInfo={mockAppInfo} />);
    expect(screen.getByText('Test App')).toBeInTheDocument();
  });

  it('should render app icon', () => {
    render(<AppInfoCard appInfo={mockAppInfo} />);
    const icon = screen.getByAltText('Test App');
    expect(icon).toHaveAttribute('src', 'https://example.com/icon.png');
  });

  it('should render bundle ID', () => {
    render(<AppInfoCard appInfo={mockAppInfo} />);
    expect(screen.getByText('com.test.app')).toBeInTheDocument();
  });

  it('should render description', () => {
    render(<AppInfoCard appInfo={mockAppInfo} />);
    expect(screen.getByText('A wonderful test application')).toBeInTheDocument();
  });

  it('should render developer name', () => {
    render(<AppInfoCard appInfo={mockAppInfo} />);
    expect(screen.getByText('Test Developer')).toBeInTheDocument();
  });

  it('should render developer email when present', () => {
    render(<AppInfoCard appInfo={mockAppInfo} />);
    expect(screen.getByText('dev@test.com')).toBeInTheDocument();
  });

  it('should render developer website as link', () => {
    render(<AppInfoCard appInfo={mockAppInfo} />);
    const link = screen.getByRole('link', { name: 'https://test.com' });
    expect(link).toHaveAttribute('href', 'https://test.com');
  });

  it('should not render email when null', () => {
    const appInfoNoEmail = {
      ...mockAppInfo,
      developer: { ...mockAppInfo.developer, email: null },
    };
    render(<AppInfoCard appInfo={appInfoNoEmail} />);
    expect(screen.queryByText('Email:')).not.toBeInTheDocument();
  });

  it('should not render website when null', () => {
    const appInfoNoWebsite = {
      ...mockAppInfo,
      developer: { ...mockAppInfo.developer, website: null },
    };
    render(<AppInfoCard appInfo={appInfoNoWebsite} />);
    expect(screen.queryByText('Website:')).not.toBeInTheDocument();
  });

  it('should render download button', () => {
    render(<AppInfoCard appInfo={mockAppInfo} />);
    expect(screen.getByRole('button', { name: /download icon/i })).toBeInTheDocument();
  });
});
