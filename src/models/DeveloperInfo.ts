/**
 * Data Transfer Object representing developer information.
 */
export class DeveloperInfo {
  private readonly _name: string;
  private readonly _email: string | null;
  private readonly _website: string | null;

  constructor(name: string, email: string | null, website: string | null) {
    this._name = name;
    this._email = email;
    this._website = website;
  }

  get name(): string {
    return this._name;
  }

  get email(): string | null {
    return this._email;
  }

  get website(): string | null {
    return this._website;
  }

  toJSON(): object {
    return {
      name: this._name,
      email: this._email,
      website: this._website,
    };
  }
}
