import express from 'express'
import { NsmuWebLoader } from './scraper/web-schedule-loader.js'

const app = express()
const port = Number(process.env.EXPRESS_PORT) || 3000

const nsmuBaseUrl = 'https://ruz.nsmu.ru/?week={week}&group={group}&spec={spec}'
const webLoader = new NsmuWebLoader(nsmuBaseUrl)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/test', async (req, res) => {
  const schedule = await webLoader.loadSchedule({
    group: 'ЛД4/00000000257',
    spec: 'Лечебное%20дело#metka',
  })

  res.send(schedule[1])
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port.toString()}`)
})
