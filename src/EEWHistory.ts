import { IEEWData } from './EEWData'

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
