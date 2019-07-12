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

const iconUrl = (intensity: string) => {
    return `https://raw.githubusercontent.com/yarnaimo/quack/master/icons/${intensity}.png`
}

const icons = new Set([
    ['0', '0'],
    ['1', '1'],
    ['2', '2'],
    ['3', '3'],
    ['4', '4'],
    ['5弱', '5-'],
    ['5強', '5+'],
    ['6弱', '6-'],
    ['6強', '6+'],
    ['7', '7'],
].map(([k, v]) => [k, iconUrl(v)]))

export const parseData = (data: IEEWData) => {
    const {
        origin_time,
        is_cancel: isCancel,
        is_training: isTraining,
        alertflg,
        report_num,
        is_final: isFinal,
        region_name: regionName,
        magunitude,
        depth,
        calcintensity: intensity,
    } = data
 
    return {
        icon: isCancel || isTraining ? undefined : icons.get(intensity),
        dateString: formatDateString(origin_time),
        isCancel,
        isTraining,
        isWarning: alertflg === '警報',
        reportNumber: isFinal ? '最終報' : `第${report_num}報`,
        regionName,
        magunitude,
        depth,
        intensity,
    }
}
