export class Converter {
  static string(input: string): string {
    return input;
  }
  static int(input: string): number {
    return parseInt(input);
  }
  static float(input: string): number {
    return parseFloat(input);
  }
  static bool(input: string): boolean {
    const lower = input.toLowerCase();

    switch (lower) {
      case "true":
      case "t":
      case "on":
      case "1":
        return true;
      case "false":
      case "f":
      case "off":
      case "0":
        return false;
      default:
        throw new Error(`Cannot convert ${input} to boolean`);
    }
  }
}
