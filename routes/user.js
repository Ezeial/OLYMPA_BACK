import { hash, compareHash } from '../utils/hash.js'

export default async (fastify, options) => {
    fastify.get(
        '/', 
        { preValidation: [fastify.authenticate] },
        async (req, reply) => {
        try {
            const player = await fastify.mariadb.query(`SELECT * from common.players WHERE pseudo='${req.user.pseudo}'`)
            if (!player[0]) reply.code(404).send('No user for this id')
            return player[0]
        } catch (err) { return err }
    })
    /*
        register les mecs sur ma db, mais les empecher de se login, leurs dire de se co sur le serv
    */
    fastify.post('/register', async (req, reply) => {
        const { pseudo, password, email } = req.body
        try {
            const playerCommon = await fastify.mariadb.query(`SELECT * from common.players WHERE pseudo='${pseudo}' OR email='${email}'`)
            if (!playerCommon[0]) {
                const playerSite = await fastify.mariadb.query(`SELECT * from players WHERE pseudo='${pseudo}' OR email='${email}'`)
                if (!playerSite[0]) {
                    await fastify.mariadb.query(`INSERT INTO players (pseudo, password, email) VALUES ('${pseudo}', '${hash(password)}', '${email}')`)
                    return reply.code(200).send({ error: 'Ton compte à bien été crée sur le site, mais pour pouvoir accéder à un vrai compte tu dois t\'inscrire sur le server' })
                } else return reply.code(409).send({ error: 'This pseudo/email already exist in the site db' })
            } else {
                if (!playerCommon[0]?.password) return reply.code(400).send({ error: 'You need to create a password on the minecraft server' })
                return reply.code(409).send({ error: 'This pseudo/email already exist in the common db'})
            }
        } catch (err) { return err }
    })

    fastify.post('/login', async (req, reply) => {
        const { password, pseudo } = req.body
        try {    
            const playerCommon = await fastify.mariadb.query(`SELECT * from common.players WHERE pseudo='${pseudo}' LIMIT 1`)
            if (!playerCommon[0]) return reply.code(401).send({error: 'this acc doesn\'t exist'}) 
            if (!compareHash(password, playerCommon[0]?.password)) return reply.code(401).send({error: 'wrong password'})
            const token = fastify.jwt.sign({ pseudo })
            reply.code(200).send({ token, uuid: playerCommon[0]?.uuid_premium })

        } catch (err) { reply.code(400).send(err) }
    })
} 