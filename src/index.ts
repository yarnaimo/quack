import { createServer } from 'http'
import { perform } from './main'

setInterval(() => perform().catch(console.error), 1000)

createServer().listen(3000)
