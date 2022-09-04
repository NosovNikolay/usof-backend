import {prisma} from '../dbConnector/db.js'
import {userSchema} from "./user.schemas.js";
import UserService from "./user.service.js"

export async function userRouter (fastify, options) {
    const userService = new UserService(prisma)

    fastify.get('/user', {schema: userSchema.getUser}, async (request, reply) => {
        const user = userService.getUser(request.query.login)
        return user;
    })
}