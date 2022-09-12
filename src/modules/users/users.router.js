import {userSchema} from "./user.schemas.js";
import {userService} from "./user.service.js"

export async function userRouter (fastify, options) {
    // TODO: add middleware after jwt auth
    //onRequest: fastify.authenticate

    // {schema: userSchema.getUser, onRequest: [fastify.authenticate]}
    fastify.get('/api/users' , getUsersHandler)

    fastify.get('/api/users/:id', async (request, reply) => {
        return userService.getUserById(request.params.id);
    })

    fastify.post('/api/user', {schema: userSchema.createUser}, async (request, reply) => {
        return userService.createUser(request.body)
    })

    fastify.patch('/api/user/:id', {schema: userSchema.getUser}, async (request, reply) => {
    })

    fastify.delete('/api/user/:id', {schema: userSchema.getUser}, async (request, reply) => {
    })

    fastify.patch('/api/users/avatar', () => {})



}

async function getUsersHandler() {
    return userService.getUsers();
}
