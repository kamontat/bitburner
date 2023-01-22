import { ActionFn, ArgumentType, ConvertFn, DefaultFn, VerifyFn } from "./types";

export interface HelpValue {
  description?: string;
  default?: DefaultFn<string>;
}

export interface Data<N extends string, T> {
  /** data key */
  key: N;
  /** data possible values */
  values: string[];
  /** help of this data */
  help?: HelpValue;
  /** verify data after parse input */
  verify?: VerifyFn<T>;
  /** perform no side-effect action on data */
  action?: ActionFn<T>;
}

export interface OptionData<N extends string, T> extends Data<N, T> {
  /** convert input string to specify data type */
  convert?: ConvertFn<T>;
  /** default value if no input found */
  default?: DefaultFn<T>;
}

export interface CommandData<N extends string> extends Data<N, string[]> {}

/** mapper of raw input data */
export interface RawMapper {
  /** parsed commands */
  commands: string[];
  /** parsed options map */
  options: Record<string, string>;
  /** raw data from input */
  raw: ArgumentType[];
}

/** mapper of parsed input data with configuration */
export interface ResultMapper<CK extends string, OM> {
  commands: Record<CK, string[]>;
  options: OM;
  raw: ArgumentType[];
}
