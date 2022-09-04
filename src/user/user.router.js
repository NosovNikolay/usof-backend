import {prisma} from '../dbConnector/db.js'
import {userSchema} from "./user.schemas.js";
import UserService from "./user.service.js"

export async function userRouter (fastify, options) {
    const userService = new UserService(prisma)

    fastify.get('/api/user', {schema: userSchema.getUser, onRequest: fastify.authenticate}, async (request, reply) => {
        return userService.getUser(request.query.login);
    })

    fastify.post('/api/user', {schema: userSchema.createUser, onRequest: [fastify.authenticate]}, async (request, reply) => {
        return userService.createUser(request.body)
    })

    fastify.put('/api/user', {schema: userSchema.getUser}, async (request, reply) => {
        return userService.getUser(request.query.login);
    })
}