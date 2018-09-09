import { createServer } from 'http'
import { perform } from './main'

process.env.TZ = 'Asia/Tokyo'

setInterval(() => perform().catch(console.error), 1000)

createServer().listen(3000)
