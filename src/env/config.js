import {cleanEnv, str, num, email} from 'envalid';
import 'dotenv/config';

export const env = cleanEnv(process.env, {
  PORT: num(),
  DATABASE_URL: str(),
  SECRET_KEY: str(),
  CONFIRM_ACCOUNT_PATH: str(),
  RESET_PASSWORD_PATH: str(),
  EMAIL: email(),
  PASSWORD: str(),
});
