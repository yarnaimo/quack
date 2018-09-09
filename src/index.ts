import { perform } from './main'

setInterval(() => perform().catch(console.error), 1000)
