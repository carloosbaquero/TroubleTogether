/* eslint-disable no-undef */
import mongoose from 'mongoose'
import request from 'supertest'
import app from '../src/server.js'
import User from '../src/models/User.js'

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
      password: 'PassW123456'
    }))
    expect(res.statusCode).toBe(400)
  })
})

describe('POST /api/users/register', () => {
  it('should not create an user with no email', async () => {
    const res = (await request(app).post('/api/users/register').send({
      username: 'testUser',
      password: 'PassW123456'
    }))
    expect(res.statusCode).toBe(400)
  })
})

describe('POST /api/users/register', () => {
  it('should not create an user with incorrect password', async () => {
    const res = (await request(app).post('/api/users/register').send({
      username: 'testUser',
      email: 'testemailgmail.com',
      password: 'pass123456'
    }))
    expect(res.statusCode).toBe(400)
  })
})

describe('POST /api/users/register', () => {
  it('should not create an user with no password', async () => {
    const res = (await request(app).post('/api/users/register').send({
      username: 'testUser',
      email: 'testemailgmail.com'
    }))
    expect(res.statusCode).toBe(400)
  })
})

describe('POST /api/users/register', () => {
  it('should not create an user with no username', async () => {
    const res = (await request(app).post('/api/users/register').send({
      email: 'testemailgmail.com',
      password: 'pass123456'
    }))
    expect(res.statusCode).toBe(400)
  })
})

describe('POST /api/users/register', () => {
  it('should create an user', async () => {
    const res = (await request(app).post('/api/users/register').send({
      username: 'testUser',
      email: 'testemail@gmail.com',
      password: 'PassW123456'
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
      password: 'PassW123456'
    }))
    expect(res.statusCode).toBe(401)
  })
})

describe('POST /api/users/register', () => {
  it('should not create an user with the same email', async () => {
    const res = (await request(app).post('/api/users/register').send({
      username: 'testUser2',
      email: 'testemail@gmail.com',
      password: 'PassW123456'
    }))
    expect(res.statusCode).toBe(401)
  })
})
