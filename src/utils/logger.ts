type LogMessage = unknown;
type LogArgs = unknown[];

const timestamp = () => {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
};

const logger = {
  info: (msg: LogMessage, ...args: LogArgs): void => console.log(`ℹ️  [INFO] [${timestamp()}]`, msg, ...args),

  error: (msg: LogMessage, ...args: LogArgs): void => console.error(`❌ [ERROR] [${timestamp()}]`, msg, ...args),

  warn: (msg: LogMessage, ...args: LogArgs): void => console.warn(`⚠️ [WARNING] [${timestamp()}]`, msg, ...args),

  success: (msg: LogMessage, ...args: LogArgs): void => console.log(`✅ [SUCCESS] [${timestamp()}]`, msg, ...args),

  debug: (msg: LogMessage, ...args: LogArgs): void => console.log(`🐞 [DEBUG] [${timestamp()}]`, msg, ...args),

  request: (...args: LogArgs): void => console.log(`[HTTP] [${timestamp()}]`, ...args),
};

export default logger;
