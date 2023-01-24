import { ArgumentType, ActionFn, ConvertFn, DefaultFn, VerifyFn, EmptyCallback, DefaultStringFn } from "./types";

export interface HelpValue<T> {
  description?: string;
  defaultFn?: DefaultStringFn<T>;
}

export interface FullHelpValue<T> extends HelpValue<T> {
  /** values from Data */
  values: string[],
  /** default value from Data */
  default?: DefaultFn<T>,
}

export interface Event<O> {
  /** perform no -side-effect action before loading data */
  preload?: EmptyCallback<void>;
  /** perform no side-effect action after loading all data */
  loaded?: ActionFn<O>;
  /** verify data after loading input */
  verify?: VerifyFn<O>;
}

export interface DataEvent<O> extends Event<O> {
  /** perform no side-effect action after loading this data */
  load?: ActionFn<O>;
}

/** This add addition event for commandline */
export interface CommandlineEvent<O, CK extends string, OM> extends Event<O> {
  /** verify data after loading commands */
  verifyCommand?: VerifyFn<Record<CK, string[]>>;
  /** verify data after loading options */
  verifyOption?: VerifyFn<OM>;
}

export interface Data<N extends string, T> {
  /** data key */
  key: N;
  /** data possible values */
  values: string[];
  /** help of this data */
  help?: HelpValue<T>;
  /** event callback */
  event?: DataEvent<T>;
}

export interface OptionData<N extends string, T> extends Data<N, T> {
  /** convert input string to specify data type */
  convert?: ConvertFn<T>;
  /** default value if no input found */
  default?: DefaultFn<T>;
}

export interface CommandData<N extends string> extends Data<N, string[]> {}

/** mapper of raw input data */
// export interface RawMapper {
//   /** parsed commands */
//   commands: string[];
//   /** parsed options map */
//   options: Record<string, string>;
//   /** raw data from input */
//   raw: ArgumentType[];
// }

/** mapper of parsed input data with configuration */
export interface ResultMapper<CK extends string, OM> {
  commands: Record<CK, string[]>;
  options: OM;
  unknown: ArgumentType[];
  raw: ArgumentType[];
}
