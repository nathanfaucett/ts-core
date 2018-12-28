const CREATE_SECRET = {},
  NULL_SECRET = {};

type ISecret = {};

export class Option<T> {
  private _value: T;

  constructor(createSecret: ISecret, value: T) {
    if (createSecret !== CREATE_SECRET) {
      throw new TypeError(
        "Options can only be created with the some or none functions"
      );
    }
    this._value = value;
  }

  isNone(): boolean {
    return this._value === NULL_SECRET;
  }

  isSome(): boolean {
    return !this.isNone();
  }

  expect(msg: string): T {
    if (this.isSome()) {
      return this._value;
    } else {
      throw new Error(msg);
    }
  }

  unwrap(): T {
    return this.expect("Tried to unwrap value of none Option");
  }
  unwrapOr(def: T): T {
    if (this.isSome()) {
      return this._value;
    } else {
      return def;
    }
  }
  unwrapOrElse(defFn: () => T): T {
    if (this.isSome()) {
      return this._value;
    } else {
      return defFn();
    }
  }

  map<U>(fn: (value: T) => U): Option<U> {
    if (this.isSome()) {
      return some(fn(this._value));
    } else {
      return none();
    }
  }
  mapOr<U>(def: U, fn: (value: T) => U): Option<U> {
    if (this.isSome()) {
      return some(fn(this._value));
    } else {
      return some(def);
    }
  }
  mapOrElse<U>(defFn: () => U, fn: (value: T) => U): Option<U> {
    if (this.isSome()) {
      return some(fn(this._value));
    } else {
      return some(defFn());
    }
  }

  and<U>(value: Option<U>): Option<U> {
    if (this.isSome()) {
      return value;
    } else {
      return none();
    }
  }
  andThen<U>(fn: () => Option<U>): Option<U> {
    if (this.isSome()) {
      return fn();
    } else {
      return none();
    }
  }

  or(value: Option<T>): Option<T> {
    if (this.isNone()) {
      return value;
    } else {
      return this;
    }
  }
  orElse(fn: () => Option<T>): Option<T> {
    if (this.isNone()) {
      return fn();
    } else {
      return this;
    }
  }

  xor(value: Option<T>): Option<T> {
    const a = this.isSome(),
      b = value.isSome();

    if (a && !b) {
      return this;
    } else if (!a && b) {
      return value;
    } else {
      return none();
    }
  }

  filter(fn: (value: T) => boolean): Option<T> {
    if (this.isSome() && fn(this._value)) {
      return this;
    } else {
      return none();
    }
  }

  getOrInsert(value: T): Option<T> {
    if (this.isNone()) {
      this._value = value;
    }
    return this;
  }
  getOrInsertWith(fn: () => T): Option<T> {
    if (this.isNone()) {
      this._value = fn();
    }
    return this;
  }

  replace(value: T): Option<T> {
    this._value = value;
    return this;
  }

  okOr<E>(error: E): Result<T, E> {
    if (this.isSome()) {
      return ok(this._value);
    } else {
      return err(error);
    }
  }
  okOrElse<E>(errorFn: () => E): Result<T, E> {
    if (this.isSome()) {
      return ok(this._value);
    } else {
      return err(errorFn());
    }
  }
}

export const some = <T>(value: T): Option<T> =>
  new Option(CREATE_SECRET, value);
export const none = <T>(): Option<T> =>
  new Option(CREATE_SECRET, NULL_SECRET as any);

import { Result, ok, err } from "../result/Result";