import app from '../config/app'
import request from 'supertest'
import env from '../config/env'
import { Collection } from 'mongodb'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { sign } from 'jsonwebtoken'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question 1',
          answers: [{
            answer: 'Answer 1',
            image: 'http://image.com'
          }, {
            answer: 'Answer 2'
          }, {
            answer: 'Answer 3',
            image: 'http://image.com'
          }]
        })
        .expect(403)
    })

    test('Should return 204 on add survey with valid accessToken', async () => {
      const res = await accountCollection.insertOne({
        name: 'Flavio',
        email: 'flduarte13@gmail.com',
        password: '123',
        role: 'admin'
      })
      const id = res.ops[0]._id
      const accessToken = sign({ id }, env.jwtSecret)
      await accountCollection.updateOne({ _id: id }, {
        $set: {
          accessToken
        }
      })
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question 1',
          answers: [{
            answer: 'Answer 1',
            image: 'http://image.com'
          }, {
            answer: 'Answer 2'
          }, {
            answer: 'Answer 3',
            image: 'http://image.com'
          }]
        })
        .expect(204)
    })
  })
})
