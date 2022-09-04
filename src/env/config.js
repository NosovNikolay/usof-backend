import { cleanEnv, str, num } from 'envalid'
import 'dotenv/config'

export const env = cleanEnv(process.env, {
    PORT:            num(),
    DATABASE_URL:        str(),
})
