export class Address {
  private _zip: string;
  private _city: string;
  private _street: string;
  private _number: number;

  constructor(street: string, number: number, zip: string, city: string) {
    this._street = street;
    this._number = number;
    this._zip = zip;
    this._city = city;

    this.validate();
  }

  validate() {
    if (this._street.length === 0) {
      throw new Error("Street is required");
    }
    if (this._number === 0) {
      throw new Error("Number is required");
    }
    if (this._zip.length === 0) {
      throw new Error("Zip is required");
    }
    if (this._city.length === 0) {
      throw new Error("City is required");
    }
  }

  copyWith({ zip, city, street, number }: { zip?: string; city?: string; street?: string; number?: number }): Address {
    return new Address(street ?? this._street, number ?? this._number, zip ?? this._zip, city ?? this._city);
  }

  toString(): string {
    return `${this._street} ${this._number} ${this._zip} ${this._city}`;
  }

  get street(): string {
    return this._street;
  }
  get zip(): string {
    return this._zip;
  }
  get city(): string {
    return this._city;
  }
  get number(): number {
    return this._number;
  }
}
