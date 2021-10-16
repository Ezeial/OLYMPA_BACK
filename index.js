import framework from 'fastify'
import mariadb from 'fastify-mariadb'
import fastifyCors from 'fastify-cors'
import dotenv from 'dotenv'
import user from './routes/user.js'
import fastifyJwt from './plugins/fastifyJwt.js'

dotenv.config()

const fastify = framework({ logger: true })

// plugins

fastify.register(mariadb, {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'site',
    promise: true
})

fastify.register(fastifyCors, { origin: true })

// customs plugins

fastify.register(fastifyJwt)

// custom routes

fastify.register(user, { prefix: '/user'})

// run the server

const start = async () => {
    try {
        await fastify.listen(process.env.API_PORT)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    } 
}
start()