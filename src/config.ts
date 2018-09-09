import { load } from 'dotenv'

const { parsed } = load()

interface Config {
    PUSH7_APIKEY: string
    PUSH7_BASE_URL: string
    SLACK_WEBHOOK_URL: string
}

export const config = (parsed as any) as Config
