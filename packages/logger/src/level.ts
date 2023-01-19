type Level = string;
type Levels = Level[];

const LEVEL_DEBUG = "debug";
const LEVEL_INFO = "info";
const LEVEL_WARN = "warn";
const LEVEL_ERROR = "error";

const LEVELS = [LEVEL_DEBUG, LEVEL_INFO, LEVEL_WARN, LEVEL_ERROR];

const getLevel = (lvl: string) => {
  const level = lvl.toLowerCase();
  switch (level) {
    case LEVEL_ERROR:
      return [LEVEL_ERROR];
    case LEVEL_WARN:
      return [LEVEL_ERROR, LEVEL_WARN];
    case LEVEL_INFO:
      return [LEVEL_ERROR, LEVEL_WARN, LEVEL_INFO];
    case LEVEL_DEBUG:
      return [LEVEL_ERROR, LEVEL_WARN, LEVEL_INFO, LEVEL_DEBUG];
    default:
      return level.split(",");
  }
};

const checkLevel = (levels: Levels, level: Level) => {
  return levels.includes(level.toLowerCase());
};

export { getLevel, checkLevel, LEVELS, LEVEL_DEBUG, LEVEL_INFO, LEVEL_WARN, LEVEL_ERROR };
export type { Level, Levels };
