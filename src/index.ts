import express from 'express'
import { JsonRouterFabric } from './routers/json-router'

const app = express()
const port = Number(process.env.EXPRESS_PORT) || 3000

const nsmuBaseUrl = 'https://ruz.nsmu.ru/?week={week}&group={group}&spec={spec}'

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/json', JsonRouterFabric(nsmuBaseUrl))

app.listen(port, () => {
  console.log(`Example app listening on port ${port.toString()}`)
})
