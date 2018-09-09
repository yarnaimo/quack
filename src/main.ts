import { getEEWData, parseData } from './EEWData'
import { EEWHistory } from './EEWHistory'
import { Push7 } from './Push7'
import { Slack } from './Slack'

export const perform = async () => {
    const data = await getEEWData()
    console.log(data.request_time)

    if (!data.report_id || data.request_hypo_type !== 'eew') return

    const intensityChanged = EEWHistory.process(data)
    if (!intensityChanged) return

    const parsed = parseData(data)

    const res = await Promise.all([
        Push7.send(parsed).catch(console.error),
        Slack.send(parsed).catch(console.error),
    ])
    return res
}
