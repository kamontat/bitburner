import { DefaultFn } from "./types";

export class Defaults {
  static constant<T>(t: T): DefaultFn<T> {
    return () => t;
  }
}
