import { IEEWData } from './EEWData'

export class EEWHistory {
    logs = {} as {
        [id: string]: string[]
    }

    private getRef({ report_id }: IEEWData) {
        if (!this.logs[report_id]) this.logs[report_id] = []
        return this.logs[report_id]
    }

    private clear({ report_id }: IEEWData) {
        delete this.logs[report_id]
    }

    process(data: IEEWData) {
        const ref = this.getRef(data)
        ref.push(data.calcintensity)
        const intensityChanged = ref[ref.length - 1] !== ref[ref.length - 2]
        if (data.is_final) this.clear(data)
        return intensityChanged
    }
}
