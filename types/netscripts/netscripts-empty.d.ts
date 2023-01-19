/**
 * 1. Copied https://raw.githubusercontent.com/danielyxie/bitburner/be42689697164bf99071c0bcf34baeef3d9b3ee8/src/ScriptEditor/NetscriptDefinitions.d.ts
 * 2. Remove declare from file except first one
 */

export {};

declare global {
  type MainFunction = (ns: NS) => Promise<void>;

  // COPY NetscriptDefinitions.d.ts here
}
