import { IEEWData } from './EEWData'

const LOG_EXPIRATION = 1000 * 60 * 15 // ms

export const EEWHistory = () => {
    const logs = new Map<string, string[]>()

    const clearAfterExpiration = (report_id: string) => {
        setTimeout(() => logs.delete(report_id), LOG_EXPIRATION)
    }

    const getRef = ({ report_id }: IEEWData) => {
        if (!logs.has(report_id)) {
            logs.set(report_id, [])
            clearAfterExpiration(report_id)
        }
        return logs.get(report_id)
    }

    const process = (data: IEEWData) => {
        const ref = getRef(data)
        const intensityChanged = ref[ref.length - 1] !== data.calcintensity

        if (intensityChanged) {
            ref.push(data.calcintensity)
        }
        return { intensityChanged }
    }

    return { process }
}

export class EEWHistory {
    static logs = {} as {
        [id: string]: string[]
    }

    private static getRef({ report_id }: IEEWData) {
        if (!this.logs[report_id]) {
            this.logs[report_id] = []
            this.clearWithDelay(report_id)
        }
        return this.logs[report_id]
    }

    private static clearWithDelay(report_id: string) {
        setTimeout(() => delete this.logs[report_id], 1000 * 60 * 15)
    }

    static process(data: IEEWData) {
        const ref = this.getRef(data)
        const intensityChanged = ref[ref.length - 1] !== data.calcintensity

        if (intensityChanged) ref.push(data.calcintensity)
        return intensityChanged
    }
}
