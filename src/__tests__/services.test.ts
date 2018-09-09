import nock from 'nock'
import { config } from '../config'
import { jsonHeaders as reqheaders } from '../http'
import { Push7 } from '../Push7'
import { Slack } from '../Slack'

const parsed = {
    icon: 'https://raw.githubusercontent.com/yarnaimo/quack/master/icons/4.png',
    metadata: ['(予報)', '第2報'],
    region: ['« 訓練 »', '胆振地方中東部'],
    detail: ['マグニチュード 4.9', '発生時刻 3:07:59', '深さ 30km'],
}

describe('Slack', () => {
    const formatted = Slack.format(parsed)

    nock(config.SLACK_WEBHOOK_URL, { reqheaders })
        .post('', JSON.stringify(formatted))
        .reply(200, 'ok')

    test('format', () => {
        expect(formatted).toEqual({
            icon_url:
                'https://raw.githubusercontent.com/yarnaimo/quack/master/icons/4.png',
            username: '緊急地震速報 (予報) 第2報',
            text:
                '« 訓練 »\n胆振地方中東部\nマグニチュード 4.9\n発生時刻 3:07:59\n深さ 30km',
        })
    })

    test('send', async () => {
        const res = await Slack.send(parsed)
        expect(res).toBe('ok')
    })
})

describe('Push7', () => {
    const formatted = Push7.format(parsed)

    nock(config.PUSH7_BASE_URL, { reqheaders })
        .post('/send', {
            url: 'https://quackapp.slack.com',
            apikey: config.PUSH7_APIKEY,
            ...formatted,
        })
        .reply(200, { pushid: '{pushid}', success: true })

    test('format', () => {
        expect(formatted).toEqual({
            icon:
                'https://raw.githubusercontent.com/yarnaimo/quack/master/icons/4.png',
            title: '緊急地震速報 « 訓練 » 胆振地方中東部 (予報) 第2報',
            body: 'マグニチュード 4.9\n発生時刻 3:07:59\n深さ 30km',
        })
    })

    test('send', async () => {
        const res = await Push7.send(parsed)
        expect(res.success).toBe(true)
    })
})
