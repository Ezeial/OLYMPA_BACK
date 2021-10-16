const storeItems = new Map([
    [1, { priceInCents: 10000, name: "Learn React Today" }],
    [2, { priceInCents: 20000, name: "Learn CSS Today" }],
])

export default async (fastify, opts) => {
    fastify.get(
    '/create-checkout-session', 
    { preValidation: [fastify.authenticate] },
    (req, reply) => {
        console.log('server !')
    })
}