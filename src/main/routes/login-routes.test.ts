import app from '../config/app'
import bcrypt from 'bcrypt'
import request from 'supertest'
import { Collection } from 'mongodb'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Flavio',
          email: 'flduarte13@gmail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await bcrypt.hash('123', 12)
      await accountCollection.insertOne({
        name: 'Flavio',
        email: 'flduarte13@gmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'flduarte13@gmail.com',
          password: '123'
        })
        .expect(200)
    })

    test('Should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'flduarte13@gmail.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
