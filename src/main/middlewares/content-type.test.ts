import request from 'supertest'
import app from '../config/app'

describe('Content Type Middleware', () => {
  test('Should return default content type as json', async () => {
    app.get('/json', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/json')
      .expect('content-type', /json/)
  })

  test('Should return xml content type when forced', async () => {
    app.get('/xml', (req, res) => {
      res.type('xml')
      res.send()
    })
    await request(app)
      .get('/xml')
      .expect('content-type', /xml/)
  })
})
