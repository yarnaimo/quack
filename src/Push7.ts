import { post } from 'got'
import { config } from './config'
import { IParsedEEWData } from './EEWData'

export class Push7 {
    static async send(data: IParsedEEWData) {
        const formatted = this.format(data)

        const { body } = await post(`${config.PUSH7_BASE_URL}/send`, {
            json: true,
            body: {
                url: 'https://quackapp.slack.com',
                apikey: config.PUSH7_APIKEY,
                ...formatted,
            },
        })
        return body
    }

    static format(data: IParsedEEWData) {
        return {
            icon: data.icon,
            title: ['緊急地震速報', ...data.region, ...data.metadata].join(' '),
            body: data.detail.join('\n'),
        }
    }
}
