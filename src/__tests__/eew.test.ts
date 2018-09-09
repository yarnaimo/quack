import nock from 'nock'
import { getEEWData, IEEWData, parseData } from '../EEWData'
import { EEWHistory } from '../EEWHistory'

describe('EEWData', () => {
    nock('http://www.kmoni.bosai.go.jp/new/webservice/hypo/eew')
        .get(/\/\d{14}\.json/)
        .reply(200, {
            request_time: '20180906030810',
        })

    test('get data', async () => {
        const data = await getEEWData()
        expect(data.request_time.length).toBe(14)
    })
})

describe('EEWHistory', () => {
    const history = new EEWHistory()
    const report_id = '20180906030805'

    test('first intensity', () => {
        const intensityChanged = history.process({
            report_id,
            calcintensity: '4',
        } as any)
        expect(intensityChanged).toBeTruthy()
    })

    test('changed intensity', () => {
        const intensityChanged = history.process({
            report_id,
            calcintensity: '6-',
        } as any)
        expect(intensityChanged).toBeTruthy()
    })

    test('unchanged intensity', () => {
        const intensityChanged = history.process({
            report_id,
            calcintensity: '6-',
        } as any)
        expect(intensityChanged).toBeFalsy()
    })

    test('final report', () => {
        const intensityChanged = history.process({
            report_id,
            calcintensity: '7',
            is_final: true,
        } as any)
        expect(intensityChanged).toBeTruthy()
        expect(history.logs[report_id]).toBeUndefined()
    })
})

describe('EEW - Parse data', () => {
    test('警報', () => {
        const data = {
            region_name: '胆振地方中東部',
            is_cancel: false,
            depth: '40km',
            calcintensity: '6強',
            is_final: true,
            is_training: false,
            origin_time: '20180906030759',
            magunitude: '7.0',
            report_num: '18',
            alertflg: '警報',
        } as IEEWData

        expect(parseData(data)).toEqual({
            icon:
                'https://raw.githubusercontent.com/yarnaimo/quack/master/icons/6+.png',
            metadata: ['最終報'],
            region: ['胆振地方中東部'],
            detail: ['マグニチュード 7.0', '発生時刻 3:07:59', '深さ 40km'],
        })
    })

    test('予報', () => {
        const data = {
            region_name: '胆振地方中東部',
            is_cancel: false,
            depth: '30km',
            calcintensity: '4',
            is_final: false,
            is_training: false,
            origin_time: '20180906030759',
            magunitude: '4.9',
            report_num: '2',
            alertflg: '予報',
        } as IEEWData

        expect(parseData(data)).toEqual({
            icon:
                'https://raw.githubusercontent.com/yarnaimo/quack/master/icons/4.png',
            metadata: ['(予報)', '第2報'],
            region: ['胆振地方中東部'],
            detail: ['マグニチュード 4.9', '発生時刻 3:07:59', '深さ 30km'],
        })
    })

    test('キャンセル報', () => {
        const data = {
            region_name: '胆振地方中東部',
            is_cancel: true,
            depth: '40km',
            calcintensity: '6強',
            is_final: false,
            is_training: false,
            origin_time: '20180906030759',
            magunitude: '7.0',
            report_num: '18',
            alertflg: '警報',
        } as IEEWData

        expect(parseData(data)).toEqual({
            metadata: [],
            region: ['« キャンセル »', '胆振地方中東部'],
            detail: ['発生時刻 3:07:59'],
        })
    })

    test('訓練報', () => {
        const data = {
            region_name: '胆振地方中東部',
            is_cancel: false,
            depth: '40km',
            calcintensity: '6強',
            is_final: false,
            is_training: true,
            origin_time: '20180906030759',
            magunitude: '7.0',
            report_num: '18',
            alertflg: '警報',
        } as IEEWData

        expect(parseData(data)).toEqual({
            metadata: ['第18報'],
            region: ['« 訓練 »', '胆振地方中東部'],
            detail: ['マグニチュード 7.0', '発生時刻 3:07:59', '深さ 40km'],
        })
    })
})
