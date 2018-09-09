import { IncomingWebhookSendArguments } from '@slack/client'
import { post } from 'got'
import { config } from './config'
import { IParsedEEWData } from './EEWData'
import { jsonHeaders } from './http'

export class Slack {
    static async send(data: IParsedEEWData) {
        const formatted = this.format(data)

        const { body } = await post(config.SLACK_WEBHOOK_URL, {
            headers: jsonHeaders,
            body: JSON.stringify(formatted),
        })
        return body
    }

    static format(data: IParsedEEWData) {
        return {
            icon_url: data.icon,
            username: ['緊急地震速報', ...data.metadata].join(' '),
            text: [...data.region, ...data.detail].join('\n'),
        } as IncomingWebhookSendArguments
    }
}
