import bcrypt from 'bcrypt'
import User from '../models/user.js'
import PlannedTravel from '../models/plannedTravel.js'
import Destination from '../models/destination.js'
import Request from '../models/request.js'
import mongoose from 'mongoose'
import config from '../../config.js'

await mongoose.connect(config.MONGO_HOST)
await PlannedTravel.deleteMany({})
await Destination.deleteMany({})
await Request.deleteMany({})
await User.deleteMany({})

// Función para cifrar la contraseña
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

const clearDatabase = async () => {
  try {
    // Eliminar todos los documentos de las colecciones
    await PlannedTravel.deleteMany({})
    await Destination.deleteMany({})
    await Request.deleteMany({})
    await User.deleteMany({})

    console.log('Todos los documentos de las colecciones han sido eliminados.')
  } catch (error) {
    console.error('Error al eliminar documentos de las colecciones:', error)
  }
}

// Llamar a la función para limpiar la base de datos
clearDatabase()

// Datos de prueba para usuarios
const userSeed = [
  {
    username: 'usuario1',
    name: 'Nombre1',
    lastName: 'Apellido1',
    email: 'usuario1@example.com',
    password: await hashPassword('Contrasena123'),
    description: 'Descripción usuario1',
    birthDate: new Date('1990-01-01'),
    country: 'Spain',
    city: 'Madrid'
  },
  {
    username: 'usuario2',
    name: 'Nombre2',
    lastName: 'Apellido2',
    email: 'usuario2@example.com',
    password: await hashPassword('Contrasena456'),
    description: 'Descripción usuario2',
    birthDate: new Date('1991-02-02'),
    country: 'United States of America (the)',
    city: 'New York'
  },
  {
    username: 'usuario3',
    name: 'Nombre3',
    lastName: 'Apellido3',
    email: 'usuario3@example.com',
    password: await hashPassword('Contrasena789'),
    description: 'Descripción usuario3',
    birthDate: new Date('1992-03-03'),
    country: 'France',
    city: 'Paris'
  },
  {
    username: 'usuario4',
    name: 'Nombre4',
    lastName: 'Apellido4',
    email: 'usuario4@example.com',
    password: await hashPassword('ContrasenaABC'),
    description: 'Descripción usuario4',
    birthDate: new Date('1993-04-04'),
    country: 'Italy',
    city: 'Rome'
  },
  {
    username: 'usuario5',
    name: 'Nombre5',
    lastName: 'Apellido5',
    email: 'usuario5@example.com',
    password: await hashPassword('ContrasenaDEF'),
    description: 'Descripción usuario5',
    birthDate: new Date('1994-05-05'),
    country: 'Germany',
    city: 'Berlin'
  },
  {
    username: 'usuario6',
    name: 'Nombre6',
    lastName: 'Apellido6',
    email: 'usuario6@example.com',
    password: await hashPassword('ContrasenaGHI'),
    description: 'Descripción usuario6',
    birthDate: new Date('1995-06-06'),
    country: 'Canada',
    city: 'Toronto'
  },
  {
    username: 'usuario7',
    name: 'Nombre7',
    lastName: 'Apellido7',
    email: 'usuario7@example.com',
    password: await hashPassword('ContrasenaJKL'),
    description: 'Descripción usuario7',
    birthDate: new Date('1996-07-07'),
    country: 'Australia',
    city: 'Sydney'
  },
  {
    username: 'usuario8',
    name: 'Nombre8',
    lastName: 'Apellido8',
    email: 'usuario8@example.com',
    password: await hashPassword('ContrasenaMNO'),
    description: 'Descripción usuario8',
    birthDate: new Date('1997-08-08'),
    country: 'Brazil',
    city: 'Rio de Janeiro'
  },
  {
    username: 'usuario9',
    name: 'Nombre9',
    lastName: 'Apellido9',
    email: 'usuario9@example.com',
    password: await hashPassword('ContrasenaPQR'),
    description: 'Descripción usuario9',
    birthDate: new Date('1998-09-09'),
    country: 'Japan',
    city: 'Tokyo'
  },
  {
    username: 'usuario10',
    name: 'Nombre10',
    lastName: 'Apellido10',
    email: 'usuario10@example.com',
    password: await hashPassword('ContrasenaSTU'),
    description: 'Descripción usuario10',
    birthDate: new Date('1999-10-10'),
    country: 'China',
    city: 'Beijing'
  }
]

const seedDatabase = async () => {
  try {
    const insertedUsers = await User.insertMany(userSeed)
    const userIds = insertedUsers.map(user => user._id)
    console.log('Datos de prueba de Users añadidos')
    return userIds
  } catch (error) {
    console.error('Error al insertar datos de prueba de usuarios:', error)
    return []
  }
}

const userIds = await seedDatabase()

const seedDestinations = async () => {
  try {
    const destinationSeed = [
      {
        city: 'Rabat',
        country: 'Malta',
        hotel: 'Airbnb en Saint Julian',
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-07-10')
      },
      {
        city: 'Tokio',
        country: 'Japan',
        hotel: 'Hotel en Shinjuku',
        startDate: new Date('2024-08-15'),
        endDate: new Date('2024-08-25')
      },
      {
        city: 'París',
        country: 'France',
        hotel: 'Hotel en Montmartre',
        startDate: new Date('2024-09-10'),
        endDate: new Date('2024-09-20')
      },
      {
        city: 'Nueva York',
        country: 'United States of America (the)',
        hotel: 'Hotel en Manhattan',
        startDate: new Date('2024-10-05'),
        endDate: new Date('2024-10-15')
      }
    ]

    const insertedDestinations = await Destination.insertMany(destinationSeed)
    const destinationIds = insertedDestinations.map(destination => destination._id)
    console.log('Datos de prueba de destinos insertados correctamente.')
    console.log('IDs de destinos:', destinationIds)
    return destinationIds
  } catch (error) {
    console.error('Error al insertar datos de prueba de destinos:', error)
  }
}

const seedPlannedTravels = async () => {
  try {
    const destinationIds = await seedDestinations()

    const plannedTravelSeed = [
      {
        organizerId: userIds[0],
        name: 'Viaje a Malta',
        description: 'Viaje por Rabat',
        destination: [destinationIds[0]],
        suggestions: [],
        itinerary: [],
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-07-10'),
        atendees: [userIds[1], userIds[2]],
        maxAtendees: 10,
        minAtendees: 5,
        state: 'Planning',
        requests: []
      },
      {
        organizerId: userIds[1],
        name: 'Viaje a Tokio',
        description: 'Vacaciones en Japon',
        destination: [destinationIds[1]],
        suggestions: [],
        itinerary: [],
        startDate: new Date('2024-08-15'),
        endDate: new Date('2024-08-25'),
        atendees: [userIds[2], userIds[3]],
        maxAtendees: 8,
        minAtendees: 3,
        state: 'Planning',
        requests: []
      },
      {
        organizerId: userIds[2],
        name: 'Viaje a París',
        description: 'Explorando la ciudad del amor',
        destination: [destinationIds[2]],
        suggestions: [],
        itinerary: [],
        startDate: new Date('2024-09-10'),
        endDate: new Date('2024-09-20'),
        atendees: [userIds[3], userIds[4]],
        maxAtendees: 6,
        minAtendees: 2,
        state: 'Planning',
        requests: []
      },
      {
        organizerId: userIds[3],
        name: 'Viaje a Nueva York',
        description: 'Explorando la Gran Manzana',
        destination: [destinationIds[3]],
        suggestions: [],
        itinerary: [],
        startDate: new Date('2024-10-05'),
        endDate: new Date('2024-10-15'),
        atendees: [userIds[4], userIds[0]],
        maxAtendees: 12,
        minAtendees: 4,
        state: 'Planning',
        requests: []
      }
    ]

    const insertedPlannedTravels = await PlannedTravel.insertMany(plannedTravelSeed)

    console.log('Datos de prueba de viajes planificados insertados correctamente.')

    for (const travel of insertedPlannedTravels) {
      const attendeesAndOrganizer = travel.atendees.concat(travel.organizerId)
      const eligibleUsers = userIds.filter(userId => !attendeesAndOrganizer.includes(userId))
      const randomUserId = eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)]

      const request = new Request({
        user: randomUserId,
        travel: travel._id
      })

      await request.save()

      travel.requests.push(request._id)
      await travel.save()
    }

    console.log('Solicitudes creadas y añadidas correctamente a los viajes planificados.')
  } catch (error) {
    console.error('Error al insertar datos de prueba de viajes planificados:', error)
  }
}

await seedPlannedTravels()

await mongoose.connection.close()
