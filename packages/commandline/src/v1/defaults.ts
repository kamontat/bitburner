import { EmptyCallback } from "./interfaces";

export class Defaults {
  static constant<T>(t: T): EmptyCallback<T> {
    return () => t;
  }
}
