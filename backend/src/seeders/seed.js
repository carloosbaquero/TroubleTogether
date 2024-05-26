import bcrypt from 'bcrypt'
import User from '../models/User.js'
import PlannedTravel from '../models/plannedTravel.js'
import Destination from '../models/destination.js'
import Request from '../models/request.js'
import mongoose from 'mongoose'
import config from '../../config.js'
import DailyItinerary from '../models/dailyItinerary.js'
import Suggestion from '../models/suggestion.js'
import Post from '../models/post.js'
import Comment from '../models/comment.js'
import Like from '../models/like.js'
import ApprovationSugestion from '../models/approvationSugestion.js'

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
    await Comment.deleteMany({})
    await Like.deleteMany({})
    await Post.deleteMany({})
    await Suggestion.deleteMany({})
    await DailyItinerary.deleteMany({})
    await PlannedTravel.deleteMany({})
    await Destination.deleteMany({})
    await Request.deleteMany({})
    await User.deleteMany({})
    await ApprovationSugestion.deleteMany({})

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
    username: 'juanito10',
    name: 'Juan',
    lastName: 'Sánchez Rodríguez',
    email: 'usuario1@example.com',
    password: await hashPassword('Contrasena123'),
    description: 'Soy un chico al que le encanta viajar',
    birthDate: new Date('1990-01-01'),
    country: 'Spain',
    city: 'Madrid',
    profPic: `${config.HOST_DIR}/public/profPic/image-000.jpg`
  },
  {
    username: 'techlover92',
    name: 'Emily',
    lastName: 'Johnson',
    email: 'usuario2@example.com',
    password: await hashPassword('Contrasena456'),
    description: 'Amante de la tecnología y los videojuegos.',
    birthDate: new Date('1991-02-02'),
    country: 'United States of America (the)',
    city: 'New York',
    profPic: `${config.HOST_DIR}/public/profPic/image-001.jpg`
  },
  {
    username: 'chef_pierre',
    name: 'Pierre',
    lastName: 'Dubois',
    email: 'usuario3@example.com',
    password: await hashPassword('Contrasena789'),
    description: 'Apasionado por la cocina y la gastronomía francesa.',
    birthDate: new Date('1992-03-03'),
    country: 'France',
    city: 'Paris',
    profPic: `${config.HOST_DIR}/public/profPic/image-002.jpg`
  },
  {
    username: 'art_lover',
    name: 'Luca',
    lastName: 'Bianchi',
    email: 'usuario4@example.com',
    password: await hashPassword('ContrasenaABC'),
    description: 'Fanático del arte renacentista y la historia.',
    birthDate: new Date('1993-04-04'),
    country: 'Italy',
    city: 'Rome',
    profPic: `${config.HOST_DIR}/public/profPic/image-003.jpg`
  },
  {
    username: 'auto_engineer',
    name: 'Hans',
    lastName: 'Schmidt',
    email: 'usuario5@example.com',
    password: await hashPassword('ContrasenaDEF'),
    description: 'Entusiasta del automovilismo y la ingeniería mecánica.',
    birthDate: new Date('1994-05-05'),
    country: 'Germany',
    city: 'Berlin'
  },
  {
    username: 'nature_fanatic',
    name: 'Aiden',
    lastName: 'Miller',
    email: 'usuario6@example.com',
    password: await hashPassword('ContrasenaGHI'),
    description: 'Amante de los deportes al aire libre y la naturaleza.',
    birthDate: new Date('1995-06-06'),
    country: 'Canada',
    city: 'Toronto'
  },
  {
    username: 'surf_addict',
    name: 'Oliver',
    lastName: 'Wilson',
    email: 'usuario7@example.com',
    password: await hashPassword('ContrasenaJKL'),
    description: 'Aficionado al surf y la cultura australiana.',
    birthDate: new Date('1996-07-07'),
    country: 'Australia',
    city: 'Sydney'
  },
  {
    username: 'futbol_fan',
    name: 'Carlos',
    lastName: 'Silva',
    email: 'usuario8@example.com',
    password: await hashPassword('ContrasenaMNO'),
    description: 'Fanático del fútbol y la samba brasileña.',
    birthDate: new Date('1997-08-08'),
    country: 'Brazil',
    city: 'Rio de Janeiro'
  },
  {
    username: 'tech_anime',
    name: 'Yuki',
    lastName: 'Takahashi',
    email: 'usuario9@example.com',
    password: await hashPassword('ContrasenaPQR'),
    description: 'Interesado en la tecnología avanzada y el anime.',
    birthDate: new Date('1998-09-09'),
    country: 'Japan',
    city: 'Tokyo'
  },
  {
    username: 'kungfu_master',
    name: 'Li',
    lastName: 'Wei',
    email: 'usuario10@example.com',
    password: await hashPassword('ContrasenaSTU'),
    description: 'Apasionado por la cultura tradicional china y el kung-fu.',
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
      },
      {
        city: 'Roma',
        country: 'Italy',
        hotel: 'Hotel en Trastevere',
        startDate: new Date('2024-11-01'),
        endDate: new Date('2024-11-10')
      },
      {
        city: 'Florencia',
        country: 'Italy',
        hotel: 'Hotel en el centro histórico',
        startDate: new Date('2024-11-11'),
        endDate: new Date('2024-11-20')
      },
      {
        city: 'Londres',
        country: 'United Kingdom of Great Britain and Northern Ireland (the)',
        hotel: 'Hotel en Westminster',
        startDate: new Date('2024-12-01'),
        endDate: new Date('2024-12-10')
      },
      {
        city: 'Edimburgo',
        country: 'United Kingdom of Great Britain and Northern Ireland (the)',
        hotel: 'Hotel en el casco antiguo',
        startDate: new Date('2024-12-11'),
        endDate: new Date('2024-12-20')
      },
      {
        city: 'Sídney',
        country: 'Australia',
        hotel: 'Hotel en Bondi Beach',
        startDate: new Date('2025-01-05'),
        endDate: new Date('2025-01-15')
      },
      {
        city: 'Melbourne',
        country: 'Australia',
        hotel: 'Hotel en el distrito central',
        startDate: new Date('2025-01-16'),
        endDate: new Date('2025-01-25')
      },
      {
        city: 'Ciudad del Cabo',
        country: 'South Africa',
        hotel: 'Airbnb en Camps Bay',
        startDate: new Date('2025-02-10'),
        endDate: new Date('2025-02-20')
      },
      {
        city: 'Johannesburgo',
        country: 'South Africa',
        hotel: 'Hotel en Sandton',
        startDate: new Date('2025-02-21'),
        endDate: new Date('2025-03-02')
      },
      {
        city: 'Bangkok',
        country: 'Thailand',
        hotel: 'Hotel en Sukhumvit',
        startDate: new Date('2025-03-05'),
        endDate: new Date('2025-03-15')
      },
      {
        city: 'Chiang Mai',
        country: 'Thailand',
        hotel: 'Hotel en el casco antiguo',
        startDate: new Date('2025-03-16'),
        endDate: new Date('2025-03-25')
      },
      {
        city: 'Rio de Janeiro',
        country: 'Brazil',
        hotel: 'Hotel en Copacabana',
        startDate: new Date('2025-04-01'),
        endDate: new Date('2025-04-10')
      },
      {
        city: 'Sao Paulo',
        country: 'Brazil',
        hotel: 'Hotel en Paulista',
        startDate: new Date('2025-04-11'),
        endDate: new Date('2025-04-20')
      },
      {
        city: 'Barcelona',
        country: 'Spain',
        hotel: 'Hotel en Las Ramblas',
        startDate: new Date('2025-05-01'),
        endDate: new Date('2025-05-10')
      },
      {
        city: 'Madrid',
        country: 'Spain',
        hotel: 'Hotel en Gran Vía',
        startDate: new Date('2025-05-11'),
        endDate: new Date('2025-05-20')
      },
      {
        city: 'Sevilla',
        country: 'Spain',
        hotel: 'Hotel en el casco antiguo',
        startDate: new Date('2025-05-21'),
        endDate: new Date('2025-05-30')
      },
      {
        city: 'Valencia',
        country: 'Spain',
        hotel: 'Hotel en el centro histórico',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-06-10')
      },
      {
        city: 'Split',
        country: 'Croatia',
        startDate: new Date('2026-02-02'),
        endDate: new Date('2026-02-15')
      },
      {
        city: 'Bled',
        country: 'Slovenia',
        startDate: new Date('2025-02-02'),
        endDate: new Date('2025-02-15')
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

// Función para crear sugerencias
const createSuggestion = async (description, userId) => {
  try {
    const suggestion = new Suggestion({
      description,
      user: userId
    })
    await suggestion.save()
    return suggestion._id
  } catch (error) {
    console.error('Error al crear sugerencia:', error)
  }
}

// Función para crear itinerarios diarios
const createDailyItineraries = async (startDate, endDate, itinerary) => {
  const dailyItineraries = []
  const currentDate = new Date(startDate)
  let i = 0
  while (currentDate <= endDate) {
    dailyItineraries.push({ date: new Date(currentDate), itinerary: itinerary[i] || 'To be filled' })
    currentDate.setDate(currentDate.getDate() + 1)
    i++
  }

  const insertedItinerary = await DailyItinerary.insertMany(dailyItineraries)

  const insertedItineraryIds = insertedItinerary.map(it => it._id)
  return insertedItineraryIds
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
        suggestions: [await createSuggestion('Sería buena idea ir a más ciudades', userIds[2])],
        itinerary: await createDailyItineraries(
          new Date('2024-07-01'),
          new Date('2024-07-10'),
          [
            'Día 1: Llegada y recorrido por la ciudad.',
            'Día 2: Visita a museos y parques.',
            'Día 3: Día de playa y relajación.',
            'Día 4: Excursión a sitios históricos.',
            'Día 5: Día libre para explorar.',
            'Día 6: Tour gastronómico.',
            'Día 7: Compras y entretenimiento.',
            'Día 8: Visita a mercados locales.',
            'Día 9: Día de deportes acuáticos.',
            'Día 10: Salida y despedida.'
          ]
        ),
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
        suggestions: [await createSuggestion('Os parece buena idea ir a Osaka?', userIds[3])],
        itinerary: await createDailyItineraries(
          new Date('2024-08-15'),
          new Date('2024-08-25'),
          [
            'Día 1: Llegada y recorrido por Shinjuku.',
            'Día 2: Visita al templo Senso-ji.',
            'Día 3: Tour por Akihabara.',
            'Día 4: Excursión a Monte Fuji.',
            'Día 5: Día de compras en Ginza.',
            'Día 6: Visita a parques temáticos.',
            'Día 7: Tour culinario.',
            'Día 8: Visita al mercado de pescado de Tsukiji.',
            'Día 9: Día de relajación en onsens.',
            'Día 10: Salida y despedida.'
          ]
        ),
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
        itinerary: await createDailyItineraries(
          new Date('2024-09-10'),
          new Date('2024-09-20'),
          [
            'Día 1: Llegada y paseo por la Torre Eiffel.',
            'Día 2: Visita al Louvre.',
            'Día 3: Recorrido por Montmartre.',
            'Día 4: Día en Versalles.',
            'Día 5: Paseo por el Sena.',
            'Día 6: Tour por Notre Dame.',
            'Día 7: Visita a museos.',
            'Día 8: Día de compras en Champs-Élysées.',
            'Día 9: Explorar mercados locales.',
            'Día 10: Salida y despedida.'
          ]
        ),
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
        suggestions: [await createSuggestion('He oído que se puede subir a la Estatua de la Libertad', userIds[4])],
        itinerary: await createDailyItineraries(
          new Date('2024-10-05'),
          new Date('2024-10-15'),
          [
            'Día 1: Llegada y recorrido por Times Square.',
            'Día 2: Visita a Central Park.',
            'Día 3: Tour por museos de arte.',
            'Día 4: Excursión a la Estatua de la Libertad.',
            'Día 5: Día de compras en 5th Avenue.',
            'Día 6: Visita a Broadway.',
            'Día 7: Tour culinario.',
            'Día 8: Paseo por Brooklyn Bridge.',
            'Día 9: Explorar barrios locales.',
            'Día 10: Salida y despedida.'
          ]
        ),
        startDate: new Date('2024-10-05'),
        endDate: new Date('2024-10-15'),
        atendees: [userIds[4], userIds[0]],
        maxAtendees: 12,
        minAtendees: 4,
        state: 'Planned',
        requests: []
      },
      {
        organizerId: userIds[4],
        name: 'Tour por Italia',
        description: 'Visitando Roma y Florencia',
        destination: [destinationIds[4], destinationIds[5]],
        suggestions: [],
        itinerary: await createDailyItineraries(
          new Date('2024-11-01'),
          new Date('2024-11-20'),
          [
            'Día 1: Llegada a Roma y recorrido por el Coliseo.',
            'Día 2: Visita al Vaticano.',
            'Día 3: Paseo por el Foro Romano.',
            'Día 4: Excursión a la Fontana di Trevi.',
            'Día 5: Día de compras en Via del Corso.',
            'Día 6: Tour culinario en Roma.',
            'Día 7: Recorrido por el Trastevere.',
            'Día 8: Viaje a Florencia.',
            'Día 9: Visita a la Catedral de Florencia.',
            'Día 10: Tour por la Galería Uffizi.',
            'Día 11: Paseo por el Ponte Vecchio.',
            'Día 12: Excursión a los jardines de Boboli.',
            'Día 13: Día de compras en Florencia.',
            'Día 14: Visita a mercados locales.',
            'Día 15: Tour culinario en Florencia.',
            'Día 16: Día de relajación.',
            'Día 17: Exploración de museos.',
            'Día 18: Paseo por barrios históricos.',
            'Día 19: Día libre para explorar.',
            'Día 20: Salida y despedida.'
          ]
        ),
        startDate: new Date('2024-11-01'),
        endDate: new Date('2024-11-20'),
        atendees: [userIds[5], userIds[6]],
        maxAtendees: 10,
        minAtendees: 5,
        state: 'Planning',
        requests: []
      },
      {
        organizerId: userIds[5],
        name: 'Tour por Reino Unido',
        description: 'Descubriendo Londres y Edimburgo',
        destination: [destinationIds[6], destinationIds[7]],
        suggestions: [],
        itinerary: await createDailyItineraries(
          new Date('2024-12-01'),
          new Date('2024-12-20'),
          [
            'Día 1: Llegada a Londres y recorrido por el Big Ben.',
            'Día 2: Visita a la Torre de Londres.',
            'Día 3: Paseo por el Museo Británico.',
            'Día 4: Excursión a la Catedral de San Pablo.',
            'Día 5: Día de compras en Oxford Street.',
            'Día 6: Tour culinario en Londres.',
            'Día 7: Recorrido por Camden Market.',
            'Día 8: Viaje a Edimburgo.',
            'Día 9: Visita al Castillo de Edimburgo.',
            'Día 10: Tour por la Royal Mile.',
            'Día 11: Paseo por Holyrood Palace.',
            'Día 12: Excursión a Arthur\'s Seat.',
            'Día 13: Día de compras en Princes Street.',
            'Día 14: Visita a museos locales.',
            'Día 15: Tour culinario en Edimburgo.',
            'Día 16: Día de relajación.',
            'Día 17: Exploración de barrios históricos.',
            'Día 18: Paseo por jardines y parques.',
            'Día 19: Día libre para explorar.',
            'Día 20: Salida y despedida.'
          ]
        ),
        startDate: new Date('2024-12-01'),
        endDate: new Date('2024-12-20'),
        atendees: [userIds[6], userIds[7]],
        maxAtendees: 8,
        minAtendees: 4,
        state: 'Planning',
        requests: []
      },
      {
        organizerId: userIds[6],
        name: 'Tour por Australia',
        description: 'Explorando Sydney y Melbourne',
        destination: [destinationIds[8], destinationIds[9]],
        suggestions: [],
        itinerary: await createDailyItineraries(
          new Date('2025-01-05'),
          new Date('2025-01-25'),
          [
            'Día 1: Llegada a Sydney y recorrido por la Ópera de Sydney.',
            'Día 2: Visita al puente de la Bahía de Sídney.',
            'Día 3: Paseo por Bondi Beach.',
            'Día 4: Excursión a los Jardines Botánicos Reales.',
            'Día 5: Día de compras en George Street.',
            'Día 6: Tour culinario en Sydney.',
            'Día 7: Recorrido por The Rocks.',
            'Día 8: Viaje a Melbourne.',
            'Día 9: Visita a la Plaza de la Federación.',
            'Día 10: Tour por los Jardines Botánicos Reales.',
            'Día 11: Paseo por el mercado Queen Victoria.',
            'Día 12: Excursión a la Gran Carretera Oceánica.',
            'Día 13: Día de compras en Bourke Street.',
            'Día 14: Visita a museos locales.',
            'Día 15: Tour culinario en Melbourne.',
            'Día 16: Día de relajación.',
            'Día 17: Exploración de barrios históricos.',
            'Día 18: Paseo por parques y jardines.',
            'Día 19: Día libre para explorar.',
            'Día 20: Salida y despedida.'
          ]
        ),
        startDate: new Date('2025-01-05'),
        endDate: new Date('2025-01-25'),
        atendees: [userIds[7], userIds[8]],
        maxAtendees: 10,
        minAtendees: 5,
        state: 'Planning',
        requests: []
      },
      {
        organizerId: userIds[7],
        name: 'Descubrimiento de Sudáfrica',
        description: 'Conociendo Ciudad del Cabo y Johannesburgo',
        destination: [destinationIds[10], destinationIds[11]],
        suggestions: [],
        itinerary: await createDailyItineraries(
          new Date('2025-02-10'),
          new Date('2025-03-02'),
          [
            'Día 1: Llegada a Ciudad del Cabo y recorrido por Table Mountain.',
            'Día 2: Visita a Robben Island.',
            'Día 3: Paseo por el V&A Waterfront.',
            'Día 4: Excursión a los Jardines Botánicos de Kirstenbosch.',
            'Día 5: Día de compras en Long Street.',
            'Día 6: Tour culinario en Ciudad del Cabo.',
            'Día 7: Recorrido por el Distrito Seis.',
            'Día 8: Viaje a Johannesburgo.',
            'Día 9: Visita al Museo del Apartheid.',
            'Día 10: Tour por Soweto.',
            'Día 11: Paseo por Gold Reef City.',
            'Día 12: Excursión a Lion Park.',
            'Día 13: Día de compras en Sandton City.',
            'Día 14: Visita a museos locales.',
            'Día 15: Tour culinario en Johannesburgo.',
            'Día 16: Día de relajación.',
            'Día 17: Exploración de barrios históricos.',
            'Día 18: Paseo por parques y jardines.',
            'Día 19: Día libre para explorar.',
            'Día 20: Salida y despedida.'
          ]
        ),
        startDate: new Date('2025-02-10'),
        endDate: new Date('2025-03-02'),
        atendees: [userIds[8], userIds[9]],
        maxAtendees: 8,
        minAtendees: 4,
        state: 'Planning',
        requests: []
      },
      {
        organizerId: userIds[8],
        name: 'Exploración de Tailandia',
        description: 'Disfrutando de Bangkok y Chiang Mai',
        destination: [destinationIds[12], destinationIds[13]],
        suggestions: [],
        itinerary: await createDailyItineraries(
          new Date('2025-03-05'),
          new Date('2025-03-25'),
          [
            'Día 1: Llegada a Bangkok y recorrido por el Gran Palacio.',
            'Día 2: Visita al Templo del Buda de Esmeralda.',
            'Día 3: Paseo por Khao San Road.',
            'Día 4: Excursión al Mercado Flotante de Damnoen Saduak.',
            'Día 5: Día de compras en MBK Center.',
            'Día 6: Tour culinario en Bangkok.',
            'Día 7: Recorrido por el Barrio Chino.',
            'Día 8: Viaje a Chiang Mai.',
            'Día 9: Visita al Templo Doi Suthep.',
            'Día 10: Tour por el Mercado Nocturno de Chiang Mai.',
            'Día 11: Paseo por el Parque Nacional Doi Inthanon.',
            'Día 12: Excursión al Santuario de Elefantes.',
            'Día 13: Día de compras en el Bazar Nocturno.',
            'Día 14: Visita a museos locales.',
            'Día 15: Tour culinario en Chiang Mai.',
            'Día 16: Día de relajación.',
            'Día 17: Exploración de barrios históricos.',
            'Día 18: Paseo por jardines y parques.',
            'Día 19: Día libre para explorar.',
            'Día 20: Salida y despedida.'
          ]
        ),
        startDate: new Date('2025-03-05'),
        endDate: new Date('2025-03-25'),
        atendees: [userIds[9], userIds[0]],
        maxAtendees: 6,
        minAtendees: 3,
        state: 'Planning',
        requests: []
      },
      {
        organizerId: userIds[9],
        name: 'Tour por Brasil',
        description: 'Visitando Rio de Janeiro y Sao Paulo',
        destination: [destinationIds[14], destinationIds[15]],
        suggestions: [],
        itinerary: await createDailyItineraries(
          new Date('2025-04-01'),
          new Date('2025-04-20'),
          [
            'Día 1: Llegada a Rio de Janeiro y recorrido por el Cristo Redentor.',
            'Día 2: Visita al Pan de Azúcar.',
            'Día 3: Paseo por Copacabana.',
            'Día 4: Excursión al Parque Nacional de Tijuca.',
            'Día 5: Día de compras en Ipanema.',
            'Día 6: Tour culinario en Rio de Janeiro.',
            'Día 7: Recorrido por Santa Teresa.',
            'Día 8: Viaje a Sao Paulo.',
            'Día 9: Visita a la Avenida Paulista.',
            'Día 10: Tour por el Parque Ibirapuera.',
            'Día 11: Paseo por el Mercado Municipal.',
            'Día 12: Excursión al Museo de Arte de Sao Paulo.',
            'Día 13: Día de compras en Oscar Freire.',
            'Día 14: Visita a museos locales.',
            'Día 15: Tour culinario en Sao Paulo.',
            'Día 16: Día de relajación.',
            'Día 17: Exploración de barrios históricos.',
            'Día 18: Paseo por jardines y parques.',
            'Día 19: Día libre para explorar.',
            'Día 20: Salida y despedida.'
          ]
        ),
        startDate: new Date('2025-04-01'),
        endDate: new Date('2025-04-20'),
        atendees: [userIds[0], userIds[1]],
        maxAtendees: 10,
        minAtendees: 5,
        state: 'Planned',
        requests: []
      },
      {
        organizerId: userIds[2],
        name: 'Gran Tour de España',
        description: 'Explorando Barcelona, Madrid, Sevilla y Valencia',
        destination: [destinationIds[16], destinationIds[17], destinationIds[18], destinationIds[19]],
        suggestions: [],
        itinerary: [],
        startDate: new Date('2025-05-01'),
        endDate: new Date('2025-06-10'),
        atendees: [userIds[1], userIds[2], userIds[3]],
        maxAtendees: 12,
        minAtendees: 6,
        state: 'Planning',
        requests: []
      },
      {
        organizerId: userIds[2],
        name: 'Unos dias en Croacia',
        description: 'Explorando Split',
        destination: [destinationIds[20]],
        suggestions: [],
        itinerary: [],
        startDate: new Date('2026-02-02'),
        endDate: new Date('2025-02-15'),
        atendees: [userIds[1], userIds[2], userIds[3]],
        maxAtendees: 12,
        minAtendees: 6,
        state: 'Planning',
        requests: []
      },
      {
        organizerId: userIds[7],
        name: 'Viajazo por Eslovenia',
        description: 'Explorando el Lago Bled',
        destination: [destinationIds[21]],
        suggestions: [],
        itinerary: [],
        startDate: new Date('2025-02-02'),
        endDate: new Date('2025-02-15'),
        atendees: [userIds[1], userIds[5], userIds[3]],
        maxAtendees: 12,
        minAtendees: 6,
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

      if (travel.name === 'Tour por Brasil') {
        const post0 = new Post({
          user: userIds[0],
          travel: travel._id,
          description: 'Preciosos fuegos artificiales.',
          image: `${config.HOST_DIR}/public/posts/image-000.jpg`
        })

        const savedPost0 = await post0.save()
        travel.posts.push(savedPost0._id)

        const post1 = new Post({
          user: userIds[1],
          travel: travel._id,
          description: 'Rio de Janeiro es precioso.',
          image: `${config.HOST_DIR}/public/posts/image-001.jpg`
        })

        const savedPost1 = await post1.save()
        travel.posts.push(savedPost1._id)

        const post9 = new Post({
          user: userIds[9],
          travel: travel._id,
          description: 'Que bonitas playas las de Rio.',
          image: `${config.HOST_DIR}/public/posts/image-002.jpg`
        })

        const savedPost9 = await post9.save()
        travel.posts.push(savedPost9._id)
      }

      if (travel.name === 'Viaje a Nueva York') {
        const post0 = new Post({
          user: userIds[0],
          travel: travel._id,
          description: 'El Empire State es una locura.',
          image: `${config.HOST_DIR}/public/posts/image-003.jpg`
        })

        const savedPost0 = await post0.save()
        travel.posts.push(savedPost0._id)

        const post3 = new Post({
          user: userIds[3],
          travel: travel._id,
          description: 'Grandiosa, la Estatua de la Libertad.',
          image: `${config.HOST_DIR}/public/posts/image-004.jpg`
        })

        const savedPost3 = await post3.save()
        travel.posts.push(savedPost3._id)

        const post4 = new Post({
          user: userIds[4],
          travel: travel._id,
          description: 'El puente de Brooklyn es una maravilla arquitectónica.',
          image: `${config.HOST_DIR}/public/posts/image-005.jpg`
        })

        const savedPost4 = await post4.save()
        travel.posts.push(savedPost4._id)
      }
      await travel.save()
    }

    console.log('Solicitudes creadas y añadidas correctamente a los viajes planificados.')
  } catch (error) {
    console.error('Error al insertar datos de prueba de viajes planificados:', error)
  }
}

await seedPlannedTravels()

await mongoose.connection.close()
