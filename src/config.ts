import { load } from 'dotenv'

load()

interface Config {
    PUSH7_APIKEY: string
    PUSH7_BASE_URL: string
    SLACK_WEBHOOK_URL: string
}

export const config = (process.env as any) as Config
