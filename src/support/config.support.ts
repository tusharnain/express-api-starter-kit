import { existsSync } from 'fs';
import { resolve } from 'path';
import { configDotenv } from 'dotenv';

export class ConfigSupport {
  static getEnvironmentFilePath(): string {
    const cwd = process.cwd();
    const env = process.env.NODE_ENV;
    const specificEnvFile = resolve(cwd, `.env.${env}`);

    if (env && existsSync(specificEnvFile)) {
      return specificEnvFile;
    }

    return resolve(cwd, '.env');
  }

  static loadEnvironmentVariables(): void {
    const envPath = this.getEnvironmentFilePath();
    if (existsSync(envPath)) {
      configDotenv({
        path: envPath,
        quiet: true,
      });
    }
  }
}
