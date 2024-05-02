/* eslint-disable no-undef */
import mongoose from 'mongoose'
import request from 'supertest'
import app from '../src/server.js'
import User from '../src/models/User.js'
import Session from '../src/models/session.js'

let refreshToken
let accessToken

const birthDate = '2002-11-02T12:00:00.000Z'
const city = 'Hornachos'
const country = 'Spain'

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_HOST)
  await mongoose.connection.dropDatabase()
})

beforeEach(async () => {
  await mongoose.connect(process.env.MONGO_HOST)
})

/* Closing database connection after each test. */
afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
})

describe('POST /api/users/register', () => {
  it('should not create an user with incorrect email', async () => {
    const res = (await request(app).post('/api/users/register').send({
      username: 'testUser',
      email: 'testemailgmail.com',
      password: 'PassW123456',
      birthDate,
      city,
      country
    }))
    expect(res.statusCode).toBe(400)
  })
}, 20000)

describe('POST /api/users/register', () => {
  it('should not create an user with no email', async () => {
    const res = (await request(app).post('/api/users/register').send({
      username: 'testUser',
      password: 'PassW123456',
      birthDate,
      city,
      country
    }))
    expect(res.statusCode).toBe(400)
  })
})

describe('POST /api/users/register', () => {
  it('should not create an user with incorrect password', async () => {
    const res = (await request(app).post('/api/users/register').send({
      username: 'testUser',
      email: 'testemailgmail.com',
      password: 'pass123456',
      birthDate,
      city,
      country
    }))
    expect(res.statusCode).toBe(400)
  })
})

describe('POST /api/users/register', () => {
  it('should not create an user with no password', async () => {
    const res = (await request(app).post('/api/users/register').send({
      username: 'testUser',
      email: 'testemailgmail.com',
      birthDate,
      city,
      country
    }))
    expect(res.statusCode).toBe(400)
  })
})

describe('POST /api/users/register', () => {
  it('should not create an user with no username', async () => {
    const res = (await request(app).post('/api/users/register').send({
      email: 'testemailgmail.com',
      password: 'pass123456',
      birthDate,
      city,
      country
    }))
    expect(res.statusCode).toBe(400)
  })
})

describe('POST /api/users/register', () => {
  it('should create an user', async () => {
    const res = (await request(app).post('/api/users/register').send({
      username: 'testUser',
      email: 'testemail@gmail.com',
      password: 'PassW123456',
      birthDate,
      city,
      country
    }))
    expect(res.statusCode).toBe(201)
    const user = await User.findOne({ username: 'testUser' })
    expect(user).toBeTruthy()
    expect(res.body.data.username).toBe('testUser')
    expect(res.body.data.email).toBe('testemail@gmail.com')
  })
})

describe('POST /api/users/register', () => {
  it('should not create an user with the same username', async () => {
    const res = (await request(app).post('/api/users/register').send({
      username: 'testUser',
      email: 'testemail2@gmail.com',
      password: 'PassW123456',
      birthDate,
      city,
      country
    }))
    expect(res.statusCode).toBe(401)
  })
})

describe('POST /api/users/register', () => {
  it('should not create an user with the same email', async () => {
    const res = (await request(app).post('/api/users/register').send({
      username: 'testUser2',
      email: 'testemail@gmail.com',
      password: 'PassW123456',
      birthDate,
      city,
      country
    }))
    expect(res.statusCode).toBe(401)
  })
})

describe('POST /api/users/login', () => {
  it('should not login with other password', async () => {
    const res = (await request(app).post('/api/users/login').send({
      email: 'testemail@gmail.com',
      password: 'PassW1'
    }))
    expect(res.statusCode).toBe(400)
  })
})

describe('POST /api/users/login', () => {
  it('an unexistent user should not login', async () => {
    const res = (await request(app).post('/api/users/login').send({
      email: 'testail@gmail.com',
      password: 'PassW123456'
    }))
    expect(res.statusCode).toBe(401)
  })
})

describe('POST /api/users/login', () => {
  it('should login', async () => {
    const res = (await request(app).post('/api/users/login').send({
      email: 'testemail@gmail.com',
      password: 'PassW123456'
    }))
    expect(res.statusCode).toBe(200)
    expect(res.body.data.accessToken).toBeTruthy()
    expect(res.body.data.refreshToken).toBeTruthy()
    refreshToken = res.body.data.refreshToken
    accessToken = res.body.data.accessToken
    const session = await Session.findOne({ token: refreshToken })
    expect(session).toBeTruthy()
  })
})

describe('POST /api/users/refresh', () => {
  it('should not refresh token with invalid refreshtoken', async () => {
    const res = (await request(app).post('/api/users/refresh')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        refreshToken: 'yuvyuvbuhcaubvbyvyuve'
      }))
    expect(res.statusCode).toBe(400)
  })
})

describe('POST /api/users/refresh', () => {
  it('should refresh token', async () => {
    const res = (await request(app).post('/api/users/refresh')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        refreshToken
      }))
    expect(res.statusCode).toBe(200)
    expect(res.body.data.accessToken).toBeTruthy()
  })
})

describe('DELETE /api/users/logout', () => {
  it('should logout', async () => {
    const res = (await request(app).delete('/api/users/logout').send({
      refreshToken
    }))
    expect(res.statusCode).toBe(200)
    const session = await Session.findOne({ token: refreshToken })
    expect(session).toBeFalsy()
  })
})
