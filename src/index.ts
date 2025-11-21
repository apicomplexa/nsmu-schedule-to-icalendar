import express from 'express'
import { JsonModule } from './modules/json-module'
import { IcalModule } from './modules/ical-module'

const app = express()
const port = Number(process.env.EXPRESS_PORT) || 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const jsonModule = JsonModule()
const { router: jsonRouter } = jsonModule
app.use('/json', jsonRouter)

const icalModule = IcalModule()
const { router: icalRouter } = icalModule
app.use('/icalendar', icalRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port.toString()}`)
})
