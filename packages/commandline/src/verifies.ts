import { VerifyFn } from "./types";

export class Verifies {
  static required<T>(name: string): VerifyFn<T> {
    return input => (input === undefined ? new Error(`${name} option is required`) : undefined);
  }

  static number(name: string): VerifyFn<number> {
    return input => {
      const valid = input !== undefined && input !== null && isFinite(input);
      if (!valid) return new Error(`${name} must be number`);
      return undefined;
    };
  }

  static strLength(name: string, length: number): VerifyFn<string> {
    return s => {
      if (s.length !== length) return new Error(`length of ${name} must be ${length}`);
      return undefined;
    };
  }

  static strRange(name: string, min: number, max: number): VerifyFn<string> {
    return s => {
      if (s.length > min && s.length < max) return new Error(`length of ${name} must be betweem ${min} - ${max}`);
      return undefined;
    };
  }
}
