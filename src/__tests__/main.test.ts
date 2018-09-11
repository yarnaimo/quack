import * as EEWData from '../EEWData'
import { EEWHistory } from '../EEWHistory'
import { perform } from '../main'
import { Push7 } from '../Push7'
import { Slack } from '../Slack'

describe('Main', () => {
    jest.spyOn(EEWData, 'getEEWData').mockResolvedValue({
        report_id: '20180906030805',
        request_hypo_type: 'eew',
        calcintensity: '4',
    })
    jest.spyOn(EEWData, 'parseData').mockReturnValue({})
    jest.spyOn(EEWHistory, 'process').mockReturnValue(true)

    jest.spyOn(Push7, 'send').mockResolvedValue({
        pushid: '{pushid}',
        success: true,
    })
    jest.spyOn(Slack, 'send').mockResolvedValue('ok')

    test('perform', async () => {
        const res = await perform()
        expect(res).toEqual([{ pushid: '{pushid}', success: true }, 'ok'])
    })
})
