import { VerifierFn } from "./interfaces";

export class Verifier {
  static number(name: string): VerifierFn<number> {
    return input => {
      const valid = input !== undefined && input !== null && isFinite(input);
      if (!valid) return new Error(`${name} must be number`);
      return undefined;
    };
  }

  static strLength(name: string, length: number): VerifierFn<string> {
    return s => {
      if (s.length !== length) return new Error(`length of ${name} must be ${length}`);
      return undefined;
    };
  }

  static strRange(name: string, min: number, max: number): VerifierFn<string> {
    return s => {
      if (s.length > min && s.length < max) return new Error(`length of ${name} must be betweem ${min} - ${max}`);
      return undefined;
    };
  }
}
