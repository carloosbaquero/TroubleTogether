/* eslint-disable no-undef */
import mongoose from 'mongoose'
import request from 'supertest'
import app from '../src/server.js'
import PlannedTravel from '../src/models/plannedTravel.js'
import Destination from '../src/models/destination.js'

let accessToken
let accessToken2
let travelId
let destId
let destId2
let travelId2
let travelId3
let travelId4

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_HOST)
  await mongoose.connection.dropDatabase()

  const birthDate = '2002-11-02T12:00:00.000Z'
  const city = 'Hornachos'
  const country = 'Spain'

  const register = await request(app).post('/api/users/register').send({
    username: 'testuser',
    email: 'testemail@gmail.com',
    password: 'PassW123456',
    birthDate,
    city,
    country
  })
  const organizerId = register.body.data._id
  const res = await request(app).post('/api/users/login').send({
    email: 'testemail@gmail.com',
    password: 'PassW123456'
  })
  accessToken = res.body.data.accessToken

  await request(app).post('/api/users/register').send({
    username: 'testuser2',
    email: 'testemail2@gmail.com',
    password: 'PassW123456',
    birthDate,
    city,
    country
  })
  const login = (await request(app).post('/api/users/login').send({
    email: 'testemail2@gmail.com',
    password: 'PassW123456'
  }))
  accessToken2 = login.body.data.accessToken

  const dest1 = new Destination({
    city: 'Rabat',
    country: 'Spain',
    endDate: '2025-07-02T12:00:00.000Z',
    startDate: '2025-07-01T12:00:00.000Z'
  })
  const savedDest1 = await dest1.save()

  const dest2 = new Destination({
    city: 'Mdina',
    country: 'Spain',
    endDate: '2025-07-04T12:00:00.000Z',
    startDate: '2025-05-01T12:00:00.000Z'
  })
  const savedDest2 = await dest2.save()

  const dest3 = new Destination({
    city: 'Zagreb',
    country: 'Spain',
    endDate: '2030-02-01T12:00:00.000Z',
    startDate: '2030-01-01T12:00:00.000Z'
  })
  const savedDest3 = await dest3.save()

  const dest4 = new Destination({
    city: 'Dubrovnik',
    country: 'Spain',
    endDate: '2030-02-02T12:00:00.000Z',
    startDate: '2025-03-01T12:00:00.000Z'
  })
  const savedDest4 = await dest4.save()

  const dest5 = new Destination({
    city: 'Huelva',
    country: 'Spain',
    endDate: '2026-02-01T12:00:00.000Z',
    startDate: '2026-01-01T12:00:00.000Z'
  })
  const savedDest5 = await dest5.save()

  const dest6 = new Destination({
    city: 'Sevilla',
    country: 'Spain',
    endDate: '2026-03-01T12:00:00.000Z',
    startDate: '2025-02-02T12:00:00.000Z'
  })
  const savedDest6 = await dest6.save()

  const travel2 = new PlannedTravel({
    organizerId,
    name: 'Viaje a Malta',
    description: 'Viaje a Rabat y Mdina',
    startDate: '2025-07-01T12:00:00.000Z',
    endDate: '2025-09-01T12:00:00.000Z',
    state: 'Planning',
    destination: [savedDest1.id, savedDest2.id],
    maxAtendees: 9,
    minAtendees: 2
  })
  const savedTravel2 = await travel2.save()
  travelId2 = savedTravel2.id

  const travel3 = new PlannedTravel({
    organizerId,
    name: 'Viaje a Croacia',
    description: 'Viaje a Zagreb y Dubrovnik',
    startDate: '2030-01-01T12:00:00.000Z',
    endDate: '2030-03-01T12:00:00.000Z',
    state: 'Planning',
    destination: [savedDest3.id, savedDest4.id],
    maxAtendees: 9,
    minAtendees: 2
  })
  const savedTravel3 = await travel3.save()
  travelId3 = savedTravel3.id

  const travel4 = new PlannedTravel({
    organizerId,
    name: 'Viaje a Sevilla',
    description: 'Viaje',
    startDate: '2026-01-01T12:00:00.000Z',
    endDate: '2026-03-01T12:00:00.000Z',
    state: 'Planning',
    destination: [savedDest5.id, savedDest6.id],
    maxAtendees: 9,
    minAtendees: 2
  })
  const savedTravel4 = await travel4.save()
  travelId4 = savedTravel4.id
}, 20000)

beforeEach(async () => {
  await mongoose.connect(process.env.MONGO_HOST)
})

/* Closing database connection after each test. */
afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
})

describe('POST /api/travels/travel', () => {
  it('should not create a travel with wrong min and max atendees', async () => {
    const res = (await request(app).post('/api/travels/travel')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Viaje',
        description: 'description',
        startDate: '2025-01-01T12:00:00.000Z',
        endDate: '2026-03-01T12:00:00.000Z',
        maxAtendees: 2,
        minAtendees: 7
      }))
    expect(res.statusCode).toBe(400)
  })
})

describe('POST /api/travels/travel', () => {
  it('should not create a travel with overlapping destinations', async () => {
    const res = (await request(app).post('/api/travels/travel')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Viaje',
        description: 'description',
        destinations: [
          {
            city: 'Huelva',
            country: 'Spain',
            endDest: '2026-03-01T12:00:00.000Z',
            startDest: '2026-01-01T12:00:00.000Z'
          },
          {
            city: 'Sevilla',
            country: 'Spain',
            endDest: '2026-02-01T12:00:00.000Z',
            startDest: '2025-01-01T12:00:00.000Z'
          }
        ],
        startDate: '2025-01-01T12:00:00.000Z',
        endDate: '2026-03-01T12:00:00.000Z',
        maxAtendees: 9,
        minAtendees: 2
      }))
    expect(res.statusCode).toBe(400)
  })
})

describe('POST /api/travels/travel', () => {
  it('should not create a travel with destinations out from the travel`s dates range', async () => {
    const res = (await request(app).post('/api/travels/travel')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Viaje',
        description: 'description',
        destinations: [
          {
            city: 'Huelva',
            country: 'Spain',
            endDest: '2026-03-01T12:00:00.000Z',
            startDest: '2026-01-01T12:00:00.000Z'
          },
          {
            city: 'Sevilla',
            country: 'Spain',
            endDest: '2026-01-01T12:00:00.000Z',
            startDest: '2025-01-01T12:00:00.000Z'
          }
        ],
        startDate: '2026-01-01T12:00:00.000Z',
        endDate: '2026-03-01T12:00:00.000Z',
        maxAtendees: 9,
        minAtendees: 2
      }))
    expect(res.statusCode).toBe(400)
  })
})

describe('POST /api/travels/travel', () => {
  it('should not create a travel with startDate posterior to endDate', async () => {
    const res = (await request(app).post('/api/travels/travel')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Viaje',
        description: 'description',
        startDate: '2027-01-01T12:00:00.000Z',
        endDate: '2026-03-01T12:00:00.000Z',
        maxAtendees: 9,
        minAtendees: 2
      }))
    expect(res.statusCode).toBe(400)
  })
})

describe('POST /api/travels/travel', () => {
  it('should not create a travel with startDate posterior to endDate in a destination', async () => {
    const res = (await request(app).post('/api/travels/travel')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Viaje',
        description: 'description',
        destinations: [
          {
            city: 'Huelva',
            country: 'Spain',
            endDest: '2026-01-01T12:00:00.000Z',
            startDest: '2026-03-01T12:00:00.000Z'
          }
        ],
        startDate: '2026-01-01T12:00:00.000Z',
        endDate: '2026-03-01T12:00:00.000Z',
        maxAtendees: 9,
        minAtendees: 2
      }))
    expect(res.statusCode).toBe(400)
  })
})

describe('POST /api/travels/travel', () => {
  it('should create a travel', async () => {
    const res = (await request(app).post('/api/travels/travel')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Viaje',
        description: 'description',
        destinations: [
          {
            city: 'Huelva',
            country: 'Spain',
            endDest: '2026-03-01T12:00:00.000Z',
            startDest: '2026-01-02T12:00:00.000Z'
          },
          {
            city: 'Sevilla',
            country: 'Spain',
            endDest: '2026-01-01T12:00:00.000Z',
            startDest: '2025-01-01T12:00:00.000Z'
          }
        ],
        startDate: '2025-01-01T12:00:00.000Z',
        endDate: '2027-03-01T12:00:00.000Z',
        maxAtendees: 5,
        minAtendees: 2
      }))
    expect(res.statusCode).toBe(201)
    const travel = await PlannedTravel.findOne({ name: 'Viaje' }).populate('destination')
    travelId = travel.id
    expect(travel).toBeTruthy()
    expect(travel.description).toBe('description')
    expect(travel.minAtendees).toBe(2)
    expect(travel.maxAtendees).toBe(5)
    expect(travel.startDate).toStrictEqual(new Date('2025-01-01T12:00:00.000Z'))
    expect(travel.endDate).toStrictEqual(new Date('2027-03-01T12:00:00.000Z'))
    expect(travel.destination.length).toBe(2)
    destId2 = travel.destination[0].id
    expect(travel.destination[0].city).toBe('Sevilla')
    expect(travel.destination[0].country).toBe('Spain')
    expect(travel.destination[0].endDate).toStrictEqual(new Date('2026-01-01T12:00:00.000Z'))
    expect(travel.destination[0].startDate).toStrictEqual(new Date('2025-01-01T12:00:00.000Z'))
    expect(travel.destination[1].city).toBe('Huelva')
    expect(travel.destination[1].country).toBe('Spain')
    expect(travel.destination[1].endDate).toStrictEqual(new Date('2026-03-01T12:00:00.000Z'))
    expect(travel.destination[1].startDate).toStrictEqual(new Date('2026-01-02T12:00:00.000Z'))
  })
})

describe('GET /api/travels/travel', () => {
  it('should return all travels, between now and three years more, ordered by startDate asc', async () => {
    const res = (await request(app).get('/api/travels/travel')
      .send())

    expect(res.statusCode).toBe(200)
    expect(res.body.data).toBeTruthy()
    expect(res.body.data.length).toBe(3)
    expect(res.body.data[0]._id).toBe(travelId)
    expect(res.body.data[1]._id).toBe(travelId2)
    expect(res.body.data[2]._id).toBe(travelId4)
  })
})

describe('GET /api/travels/travel', () => {
  it('should return all travels, between now and three years more, ordered by startDate desc', async () => {
    const res = (await request(app).get('/api/travels/travel?sort=startDate,desc')
      .send())

    expect(res.statusCode).toBe(200)
    expect(res.body.data).toBeTruthy()
    expect(res.body.data.length).toBe(3)
    expect(res.body.data[0]._id).toBe(travelId4)
    expect(res.body.data[1]._id).toBe(travelId2)
    expect(res.body.data[2]._id).toBe(travelId)
  })
})

describe('GET /api/travels/travel', () => {
  it('should return all travels, between now and three years more, ordered by startDate, with destination, name or description Sevilla', async () => {
    const res = (await request(app).get('/api/travels/travel?search=Sevilla')
      .send())

    expect(res.statusCode).toBe(200)
    expect(res.body.data).toBeTruthy()
    expect(res.body.data.length).toBe(2)
    expect(res.body.data[0]._id).toBe(travelId)
    expect(res.body.data[1]._id).toBe(travelId4)
  })
})

describe('GET /api/travels/travel', () => {
  it('should return all travels, between now and three years more, ordered by startDate, with destination, name or description Sevilla, and country Spain', async () => {
    const res = (await request(app).get('/api/travels/travel?search=Sevilla&country=Spain')
      .send())

    expect(res.statusCode).toBe(200)
    expect(res.body.data).toBeTruthy()
    expect(res.body.data.length).toBe(2)
    expect(res.body.data[0]._id).toBe(travelId)
    expect(res.body.data[1]._id).toBe(travelId4)
  })
})

describe('GET /api/travels/travel', () => {
  it('should return all travels, between 2027-01-01 and 2031-01-01, ordered by startDate', async () => {
    const res = (await request(app).get('/api/travels/travel?startDate=2027-01-01T12:00:00.000Z&endDate=2031-01-01T12:00:00.000Z')
      .send())

    expect(res.statusCode).toBe(200)
    expect(res.body.data).toBeTruthy()
    expect(res.body.data.length).toBe(1)
    expect(res.body.data[0]._id).toBe(travelId3)
  })
})

describe('GET /api/travels/dashboard/:id', () => {
  it('should not return travel dashboard while not logged', async () => {
    const res = (await request(app).get(`/api/travels/dashboard/${travelId}`)
      .send())

    expect(res.statusCode).toBe(403)
    expect(res.body.data).toBeFalsy()
  })
})

describe('GET /api/travels/dashboard/:id', () => {
  it('should not return travel dashboard for an user who is not atendee either organizer', async () => {
    const res = (await request(app).get(`/api/travels/dashboard/${travelId}`)
      .set('Authorization', `Bearer ${accessToken2}`)
      .send())

    expect(res.statusCode).toBe(403)
    expect(res.body.data).toBeFalsy()
  })
})

describe('GET /api/travels/dashboard/:id', () => {
  it('should return travel dashboard', async () => {
    const res = (await request(app).get(`/api/travels/dashboard/${travelId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send())

    expect(res.statusCode).toBe(200)
    expect(res.body.data).toBeTruthy()
    expect(res.body.data).toBeTruthy()
    expect(res.body.data.description).toBe('description')
    expect(res.body.data.state).toBe('Planning')
    expect(res.body.data.minAtendees).toBe(2)
    expect(res.body.data.maxAtendees).toBe(5)
    expect(res.body.data.startDate).toBe('2025-01-01T12:00:00.000Z')
    expect(res.body.data.endDate).toBe('2027-03-01T12:00:00.000Z')
    expect(res.body.data.organizerId.username).toBe('testuser')
    expect(res.body.data.atendees.length).toBe(0)
    expect(res.body.data.destination.length).toBe(2)
    expect(res.body.data.destination[0].city).toBe('Sevilla')
    expect(res.body.data.destination[0].country).toBe('Spain')
    expect(res.body.data.destination[0].endDate).toBe('2026-01-01T12:00:00.000Z')
    expect(res.body.data.destination[0].startDate).toBe('2025-01-01T12:00:00.000Z')
    expect(res.body.data.destination[1].city).toBe('Huelva')
    expect(res.body.data.destination[1].country).toBe('Spain')
    expect(res.body.data.destination[1].endDate).toBe('2026-03-01T12:00:00.000Z')
    expect(res.body.data.destination[1].startDate).toBe('2026-01-02T12:00:00.000Z')
  })
})

describe('GET /api/travels/info/:id', () => {
  it('should return travel info', async () => {
    const res = (await request(app).get(`/api/travels/info/${travelId}`).send())
    expect(res.statusCode).toBe(200)
    expect(res.body.data).toBeTruthy()
    expect(res.body.data).toBeTruthy()
    expect(res.body.data.description).toBe('description')
    expect(res.body.data.state).toBe('Planning')
    expect(res.body.data.minAtendees).toBe(2)
    expect(res.body.data.maxAtendees).toBe(5)
    expect(res.body.data.startDate).toBe('2025-01-01T12:00:00.000Z')
    expect(res.body.data.endDate).toBe('2027-03-01T12:00:00.000Z')
    expect(res.body.data.organizerId.username).toBe('testuser')
    expect(res.body.data.atendees.length).toBe(0)
    expect(res.body.data.destination.length).toBe(2)
    expect(res.body.data.destination[0].city).toBe('Sevilla')
    expect(res.body.data.destination[0].country).toBe('Spain')
    expect(res.body.data.destination[0].endDate).toBe('2026-01-01T12:00:00.000Z')
    expect(res.body.data.destination[0].startDate).toBe('2025-01-01T12:00:00.000Z')
    expect(res.body.data.destination[1].city).toBe('Huelva')
    expect(res.body.data.destination[1].country).toBe('Spain')
    expect(res.body.data.destination[1].endDate).toBe('2026-03-01T12:00:00.000Z')
    expect(res.body.data.destination[1].startDate).toBe('2026-01-02T12:00:00.000Z')
  })
})

describe('PUT /api/travels/dashboard/:id', () => {
  it('should not update a travel with a non existent id', async () => {
    const res = (await request(app).put('/api/travels/dashboard/602f787718e96515e8857303')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Viaje nuevo',
        description: 'description nueva',
        startDate: '2024-12-01T12:00:00.000Z',
        endDate: '2027-03-01T12:00:00.000Z',
        maxAtendees: 18,
        minAtendees: 6
      }))
    expect(res.statusCode).toBe(404)
  })
})

describe('PUT /api/travels/dashboard/:id', () => {
  it('should not update a travel that does not belong to the user', async () => {
    const res = (await request(app).put(`/api/travels/dashboard/${travelId}`)
      .set('Authorization', `Bearer ${accessToken2}`)
      .send({
        name: 'Viaje nuevo',
        description: 'description nueva',
        startDate: '2024-12-01T12:00:00.000Z',
        endDate: '2027-03-01T12:00:00.000Z',
        maxAtendees: 18,
        minAtendees: 6
      }))
    expect(res.statusCode).toBe(403)
  })
})

describe('PUT /api/travels/dashboard/:id', () => {
  it('should not update a travel with a range of dates that overlaps the destinations', async () => {
    const res = (await request(app).put(`/api/travels/dashboard/${travelId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Viaje nuevo',
        description: 'description nueva',
        startDate: '2024-12-01T12:00:00.000Z',
        endDate: '2025-03-01T12:00:00.000Z',
        maxAtendees: 18,
        minAtendees: 6
      }))
    expect(res.statusCode).toBe(400)
  })
})

describe('PUT /api/travels/dashboard/:id', () => {
  it('should update a travel with no startDate and no maxAtendees', async () => {
    const res = (await request(app).put(`/api/travels/dashboard/${travelId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Viaje nuevo',
        description: 'description nueva',
        endDate: '2028-02-01T12:00:00.000Z',
        minAtendees: 4
      }))
    expect(res.statusCode).toBe(200)
    const travel = await PlannedTravel.findOne({ name: 'Viaje nuevo' })
    expect(travel).toBeTruthy()
    expect(travel.description).toBe('description nueva')
    expect(travel.minAtendees).toBe(4)
    expect(travel.maxAtendees).toBe(5)
    expect(travel.startDate).toStrictEqual(new Date('2025-01-01T12:00:00.000Z'))
    expect(travel.endDate).toStrictEqual(new Date('2028-02-01T12:00:00.000Z'))
  })
})

describe('PUT /api/travels/dashboard/:id', () => {
  it('should update a travel', async () => {
    const res = (await request(app).put(`/api/travels/dashboard/${travelId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Viaje nuevo nuevo',
        description: 'description nueva nueva',
        startDate: '2024-12-01T12:00:00.000Z',
        endDate: '2028-03-01T12:00:00.000Z',
        maxAtendees: 18,
        minAtendees: 6
      }))
    expect(res.statusCode).toBe(200)
    const travel = await PlannedTravel.findOne({ name: 'Viaje nuevo nuevo' })
    expect(travel).toBeTruthy()
    expect(travel.description).toBe('description nueva nueva')
    expect(travel.minAtendees).toBe(6)
    expect(travel.maxAtendees).toBe(18)
    expect(travel.startDate).toStrictEqual(new Date('2024-12-01T12:00:00.000Z'))
    expect(travel.endDate).toStrictEqual(new Date('2028-03-01T12:00:00.000Z'))
  })
})

describe('POST /api/travels/dashboard/:id/dest', () => {
  it('should not add a destination with startDate posterior than endDate to the travel', async () => {
    const res = (await request(app).post(`/api/travels/dashboard/${travelId}/dest`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        city: 'Cádiz',
        country: 'Spain',
        endDate: '2026-01-01T12:00:00.000Z',
        startDate: '2027-03-01T12:00:00.000Z'
      }))
    expect(res.statusCode).toBe(400)
  })
})

describe('POST /api/travels/dashboard/:id/dest', () => {
  it('should not add a destination that overlaps other destination to the travel', async () => {
    const res = (await request(app).post(`/api/travels/dashboard/${travelId}/dest`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        city: 'Cádiz',
        country: 'Spain',
        endDate: '2027-01-01T12:00:00.000Z',
        startDate: '2026-01-01T12:00:00.000Z'
      }))
    expect(res.statusCode).toBe(400)
  })
})

describe('POST /api/travels/dashboard/:id/dest', () => {
  it('should not add a destination which dates are out from the travel`s dates range to the travel', async () => {
    const res = (await request(app).post(`/api/travels/dashboard/${travelId}/dest`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        city: 'Cádiz',
        country: 'Spain',
        endDate: '2029-01-01T12:00:00.000Z',
        startDate: '2026-03-01T12:00:00.000Z'
      }))
    expect(res.statusCode).toBe(400)
  })
})

describe('POST /api/travels/dashboard/:id/dest', () => {
  it('should add a destination to the travel', async () => {
    const res = (await request(app).post(`/api/travels/dashboard/${travelId}/dest`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        city: 'Cádiz',
        country: 'Spain',
        endDate: '2027-01-01T12:00:00.000Z',
        startDate: '2026-03-01T12:00:00.000Z'
      }))
    expect(res.statusCode).toBe(201)
    const travel = await PlannedTravel.findById(travelId).populate('destination')
    expect(travel.destination.length).toBe(3)
    expect(travel.destination[2].city).toBe('Cádiz')
    expect(travel.destination[2].country).toBe('Spain')
    expect(travel.destination[2].endDate).toStrictEqual(new Date('2027-01-01T12:00:00.000Z'))
    expect(travel.destination[2].startDate).toStrictEqual(new Date('2026-03-01T12:00:00.000Z'))
    destId = travel.destination[2].id
  })
})

describe('PUT /api/travels/dashboard/:id/dest/:destId', () => {
  it('should not update a destination with startDate posterior than endDate to the travel', async () => {
    const res = (await request(app).put(`/api/travels/dashboard/${travelId}/dest/${destId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        city: 'Cádiz',
        country: 'Spain',
        endDate: '2026-01-01T12:00:00.000Z',
        startDate: '2027-03-01T12:00:00.000Z'
      }))
    expect(res.statusCode).toBe(400)
  })
})

describe('PUT /api/travels/dashboard/:id/dest/:destId', () => {
  it('should not update a destination that overlaps other destination to the travel', async () => {
    const res = (await request(app).put(`/api/travels/dashboard/${travelId}/dest/${destId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        city: 'Cádiz',
        country: 'Spain',
        endDate: '2027-01-01T12:00:00.000Z',
        startDate: '2026-01-01T12:00:00.000Z'
      }))
    expect(res.statusCode).toBe(400)
  })
})

describe('PUT /api/travels/dashboard/:id/dest/:destId', () => {
  it('should not add a destination which dates are out from the travel`s dates range to the travel', async () => {
    const res = (await request(app).put(`/api/travels/dashboard/${travelId}/dest/${destId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        city: 'Cádiz',
        country: 'Spain',
        endDate: '2029-01-01T12:00:00.000Z',
        startDate: '2026-03-01T12:00:00.000Z'
      }))
    expect(res.statusCode).toBe(400)
  })
})

describe('PUT /api/travels/dashboard/:id/dest/:destId', () => {
  it('should update a destination from the travel', async () => {
    const res = (await request(app).put(`/api/travels/dashboard/${travelId}/dest/${destId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        city: 'Córdoba',
        country: 'Spain',
        endDate: '2027-02-01T12:00:00.000Z',
        startDate: '2026-03-01T12:00:00.000Z',
        hotel: 'Hotel Barceló'
      }))
    expect(res.statusCode).toBe(201)
    const travel = await PlannedTravel.findById(travelId).populate('destination')
    expect(travel.destination.length).toBe(3)
    expect(travel.destination[2].city).toBe('Córdoba')
    expect(travel.destination[2].country).toBe('Spain')
    expect(travel.destination[2].endDate).toStrictEqual(new Date('2027-02-01T12:00:00.000Z'))
    expect(travel.destination[2].startDate).toStrictEqual(new Date('2026-03-01T12:00:00.000Z'))
    expect(travel.destination[2].hotel).toBe('Hotel Barceló')
  })
})

describe('DELETE /api/travels/dashboard/:id/dest/:destId', () => {
  it('should not delete a non existent destination from the travel', async () => {
    const res = (await request(app).delete(`/api/travels/dashboard/${travelId}/dest/602f787718e96515e8857303`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send())

    expect(res.statusCode).toBe(404)
    const travel = await PlannedTravel.findById(travelId)
    expect(travel.destination.length).toBe(3)
  })
})

describe('DELETE /api/travels/dashboard/:id/dest/:destId', () => {
  it('should delete a destination from the travel', async () => {
    const res = (await request(app).delete(`/api/travels/dashboard/${travelId}/dest/${destId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send())

    expect(res.statusCode).toBe(200)
    const dest = await Destination.findById(destId)
    expect(dest).toBeFalsy()
    const travel = await PlannedTravel.findById(travelId)
    expect(travel.destination.length).toBe(2)
  })
})

describe('DELETE /api/travels/dashboard/:id', () => {
  it('should not delete a non existent travel', async () => {
    const res = (await request(app).delete('/api/travels/dashboard/602f787718e96515e8857303')
      .set('Authorization', `Bearer ${accessToken}`)
      .send())

    expect(res.statusCode).toBe(404)
  })
})

describe('DELETE /api/travels/dashboard/:id', () => {
  it('should delete a travel', async () => {
    const res = (await request(app).delete(`/api/travels/dashboard/${travelId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send())

    expect(res.statusCode).toBe(200)
    const travel = await PlannedTravel.findById(travelId)
    expect(travel).toBeFalsy()
    const dest = await Destination.findById(destId2)
    expect(dest).toBeFalsy()
  })
})
