/* eslint-disable no-undef */
import mongoose from 'mongoose'
import request from 'supertest'
import app from '../src/server.js'
import PlannedTravel from '../src/models/plannedTravel.js'
import Request from '../src/models/request.js'

let travelId
let travelId2
let userId
let userId2
let accessToken
let accessToken2
let accessToken3
let requestId

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_HOST)
  await mongoose.connection.dropDatabase()

  const birthDate = '2002-11-02T12:00:00.000Z'
  const city = 'Hornachos'
  const country = 'Spain'

  const register = await request(app).post('/api/users/register').send({
    username: 'testUser',
    email: 'testemail@gmail.com',
    password: 'PassW123456',
    birthDate,
    city,
    country
  })
  userId = register.body.data._id
  const login = await request(app).post('/api/users/login').send({
    email: 'testemail@gmail.com',
    password: 'PassW123456'
  })
  accessToken = login.body.data.accessToken

  const register2 = await request(app).post('/api/users/register').send({
    username: 'testUser2',
    email: 'testemail2@gmail.com',
    password: 'PassW123456',
    birthDate,
    city,
    country
  })
  userId2 = register2.body.data._id
  const login2 = (await request(app).post('/api/users/login').send({
    email: 'testemail2@gmail.com',
    password: 'PassW123456'
  }))
  accessToken2 = login2.body.data.accessToken

  await request(app).post('/api/users/register').send({
    username: 'testUser3',
    email: 'testemail3@gmail.com',
    password: 'PassW123456',
    birthDate,
    city,
    country
  })
  const login3 = (await request(app).post('/api/users/login').send({
    email: 'testemail3@gmail.com',
    password: 'PassW123456'
  }))
  accessToken3 = login3.body.data.accessToken

  const travel = (await request(app).post('/api/travels/travel')
    .set('Authorization', `Bearer ${accessToken3}`)
    .send({
      name: 'Viaje',
      description: 'description',
      startDate: '2026-01-01T12:00:00.000Z',
      endDate: '2027-03-01T12:00:00.000Z',
      maxAtendees: 2,
      minAtendees: 2
    }))
  travelId = travel.body.data._id

  const travel2 = (await request(app).post('/api/travels/travel')
    .set('Authorization', `Bearer ${accessToken3}`)
    .send({
      name: 'Viaje',
      description: 'description',
      startDate: '2026-01-01T12:00:00.000Z',
      endDate: '2027-03-01T12:00:00.000Z',
      maxAtendees: 2,
      minAtendees: 2
    }))
  travelId2 = travel2.body.data._id
}, 20000)

beforeEach(async () => {
  await mongoose.connect(process.env.MONGO_HOST)
})

/* Closing database connection after each test. */
afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
})

describe('POST /api/requests/travel/:id/request', () => {
  it('should not create a request for a non existent travel', async () => {
    const res = (await request(app).post('/api/requests/travel/602f787718e96515e8857303/request')
      .set('Authorization', `Bearer ${accessToken2}`)
      .send())

    expect(res.statusCode).toBe(404)
  })
})

describe('POST /api/requests/travel/:id/request', () => {
  it('should create a request', async () => {
    const res = (await request(app).post(`/api/requests/travel/${travelId}/request`)
      .set('Authorization', `Bearer ${accessToken2}`)
      .send())

    expect(res.statusCode).toBe(201)
    const joinRequest = await Request.findOne({ user: userId2 })
    expect(joinRequest).toBeTruthy()

    requestId = joinRequest._id
    const travel = await PlannedTravel.findById(travelId)
    expect(travel.requests[0]).toStrictEqual(requestId)
  })
})

describe('POST /api/requests/travel/:id/request', () => {
  it('should not create a request that already exists', async () => {
    const res = (await request(app).post(`/api/requests/travel/${travelId}/request`)
      .set('Authorization', `Bearer ${accessToken2}`)
      .send())

    expect(res.statusCode).toBe(403)
  })
})

describe('POST /api/requests/travel/:id/request', () => {
  it('a participant should not create a request', async () => {
    const res = (await request(app).post(`/api/requests/travel/${travelId}/request`)
      .set('Authorization', `Bearer ${accessToken3}`)
      .send())

    expect(res.statusCode).toBe(403)
  })
})

describe('GET /api/requests/travel/:id/request', () => {
  it('should get one request', async () => {
    const res = (await request(app).get(`/api/requests/travel/${travelId}/request`)
      .set('Authorization', `Bearer ${accessToken3}`)
      .send())

    expect(res.statusCode).toBe(200)
    expect(res.body.data.length).toBe(1)
  })
})

describe('GET /api/requests/travel/:id/request', () => {
  it('should get no request without being organizer', async () => {
    const res = (await request(app).get(`/api/requests/travel/${travelId}/request`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send())

    expect(res.statusCode).toBe(403)
  })
})

describe('POST /api/requests/travel/:id/approve/:requestId', () => {
  it('should not approve a non existent request', async () => {
    const res = (await request(app).post(`/api/requests/travel/${travelId}/approve/602f787718e96515e8857303`)
      .set('Authorization', `Bearer ${accessToken3}`)
      .send())

    expect(res.statusCode).toBe(404)
  })
})

describe('POST /api/requests/travel/:id/approve/:requestId', () => {
  it('should not approve a request without being organizer', async () => {
    const res = (await request(app).post(`/api/requests/travel/${travelId}/approve/${requestId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send())

    expect(res.statusCode).toBe(403)
  })
})

describe('POST /api/requests/travel/:id/approve/:requestId', () => {
  it('should approve a request', async () => {
    const res = (await request(app).post(`/api/requests/travel/${travelId}/approve/${requestId}`)
      .set('Authorization', `Bearer ${accessToken3}`)
      .send())

    expect(res.statusCode).toBe(200)
    const joinRequest = await Request.findOne({ user: userId2 })
    expect(joinRequest).toBeFalsy()
    const travel = await PlannedTravel.findById(travelId)
    expect(travel.requests[0]).not.toStrictEqual(requestId)
    expect(travel.atendees[0].toString()).toStrictEqual(userId2)
  })
})

describe('POST /api/requests/travel/:id/approve/:requestId', () => {
  it('should not approve a request that has been already approved', async () => {
    const res = (await request(app).post(`/api/requests/travel/${travelId}/approve/${requestId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send())

    expect(res.statusCode).toBe(403)
  })
})

describe('GET /api/requests/travel/:id/request', () => {
  it('should not get any request', async () => {
    const res = (await request(app).get(`/api/requests/travel/${travelId}/request`)
      .set('Authorization', `Bearer ${accessToken3}`)
      .send())

    expect(res.statusCode).toBe(200)
    expect(res.body.data.length).toBe(0)
  })
})

describe('POST /api/requests/travel/:id/reject/:requestId', () => {
  it('should reject a request', async () => {
    await request(app).post(`/api/requests/travel/${travelId2}/request`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    await request(app).post(`/api/requests/travel/${travelId2}/request`)
      .set('Authorization', `Bearer ${accessToken2}`)
      .send()

    const joinRequest = await Request.findOne({ user: userId2, travel: travelId2 })
    const requestId2 = joinRequest._id
    const res = (await request(app).post(`/api/requests/travel/${travelId2}/reject/${requestId2}`)
      .set('Authorization', `Bearer ${accessToken3}`)
      .send())

    expect(res.statusCode).toBe(200)
    const joinRequest2 = await Request.findOne({ user: userId2, travel: travelId2 })
    const joinRequest3 = await Request.findOne({ user: userId, travel: travelId2 })
    expect(joinRequest2).toBeFalsy()
    expect(joinRequest3).toBeTruthy()
    const travel = await PlannedTravel.findById(travelId2)
    expect(travel.atendees.length).toBe(0)
  })
})
