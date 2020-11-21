import request from 'supertest'
import app from '../config/app'

describe('CORS Middleware', () => {
  test('Should enable CORS', async () => {
    app.get('/', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
