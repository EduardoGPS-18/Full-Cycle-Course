import { Address } from "./address";

export class Customer {
  private _id: string;
  private _name: string;
  private _address!: Address;
  private _active: boolean;
  private _rewardPoints: number = 0;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this._active = false;

    this.validate();
  }

  addRewardPoints(points: number): void {
    this._rewardPoints += points;
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  activate() {
    if (!this._address) {
      throw new Error("Address is mandatory to activate a costumer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  isActive(): boolean {
    return this._active;
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
  }

  updateAddress(address: Address) {
    this._address = address;
  }

  get zip(): string {
    return this._address.zip;
  }

  get active(): boolean {
    return this._active;
  }

  get address(): Address {
    return this._address;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  get name(): string {
    return this._name;
  }

  get id(): string {
    return this._id;
  }
}
