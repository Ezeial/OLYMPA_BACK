import fp from 'fastify-plugin'
import fastifyJwt from 'fastify-jwt'

export default fp(async function(fastify, opts) {
  fastify.register(fastifyJwt, {
    secret: process.env.SECRET_KEY_JWT
  })

  fastify.decorate('authenticate', async function(request, reply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })
})