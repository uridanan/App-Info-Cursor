import { DeveloperInfo } from './DeveloperInfo';

/**
 * Data Transfer Object representing mobile app information.
 */
export class AppInfo {
  private readonly _appName: string;
  private readonly _iconUrl: string;
  private readonly _bundleId: string;
  private readonly _description: string;
  private readonly _developer: DeveloperInfo;

  constructor(
    appName: string,
    iconUrl: string,
    bundleId: string,
    description: string,
    developer: DeveloperInfo
  ) {
    this._appName = appName;
    this._iconUrl = iconUrl;
    this._bundleId = bundleId;
    this._description = description;
    this._developer = developer;
  }

  get appName(): string {
    return this._appName;
  }

  get iconUrl(): string {
    return this._iconUrl;
  }

  get bundleId(): string {
    return this._bundleId;
  }

  get description(): string {
    return this._description;
  }

  get developer(): DeveloperInfo {
    return this._developer;
  }

  toJSON(): object {
    return {
      appName: this._appName,
      iconUrl: this._iconUrl,
      bundleId: this._bundleId,
      description: this._description,
      developer: this._developer.toJSON(),
    };
  }
}
