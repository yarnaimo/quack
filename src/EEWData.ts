import dayjs from 'dayjs'
import got from 'got'

export interface IEEWData {
    result: {
        status: string
        message: string
        is_auth: boolean
    }
    report_time: string
    region_code: string
    request_time: string
    region_name: string
    longitude: string
    is_cancel: boolean
    depth: string
    calcintensity: string
    is_final: boolean
    is_training: boolean
    latitude: string
    origin_time: string
    security: {
        realm: string
        hash: string
    }
    magunitude: string
    report_num: string
    request_hypo_type: string
    report_id: string
    alertflg: string
}

export interface IParsedEEWData {
    icon?: string
    metadata: string[]
    region: string[]
    detail: string[]
}

const getKmoniUrl = () => {
    const date = dayjs().format('YYYYMMDDHHmmss')
    return `http://www.kmoni.bosai.go.jp/new/webservice/hypo/eew/${date}.json`
}

export const getEEWData = async () => {
    const url = getKmoniUrl()
    const { body: data }: { body: IEEWData } = await got(url, { json: true })
    return data
}

const formatDateString = (date: string) => {
    return [
        String(Number(date.slice(8, 10))),
        date.slice(10, 12),
        date.slice(12, 14),
    ].join(':')
}

const u = (intensity: string) => {
    return `https://raw.githubusercontent.com/yarnaimo/quack/master/icons/${intensity}.png`
}

const icons = {
    '0': u('0'),
    '1': u('1'),
    '2': u('2'),
    '3': u('3'),
    '4': u('4'),
    '5弱': u('5-'),
    '5強': u('5+'),
    '6弱': u('6-'),
    '6強': u('6+'),
    '7': u('7'),
} as { [key: string]: string }

const isString = (v: any): v is string => typeof v === 'string'

export const parseData = (data: IEEWData) => {
    const cancel = data.is_cancel

    const metadata = [
        cancel || (data.alertflg === '予報' && '(予報)'),
        cancel || (data.is_final ? '最終報' : `第${data.report_num}報`),
    ].filter(isString)

    const region = [
        cancel && '« キャンセル »',
        data.is_training && '« 訓練 »',
        data.region_name,
    ].filter(isString)

    const detail = [
        cancel || `マグニチュード ${data.magunitude}`,
        `発生時刻 ${formatDateString(data.origin_time)}`,
        cancel || `深さ ${data.depth}`,
    ].filter(isString)

    const icon =
        data.is_cancel || data.is_training
            ? undefined
            : icons[data.calcintensity]

    return { icon, metadata, region, detail } as IParsedEEWData
}
