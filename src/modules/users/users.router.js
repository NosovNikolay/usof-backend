import {userSchema} from "./users.schema.js";
import {usersService} from "./users.service.js"
import createError from "@fastify/error";

import util from 'util'
import path from 'path'
import {pipeline} from 'stream'
import fs from 'fs'

// const validatorCompiler = ({ schema, method, url, httpPart }) => {
//     return data => schema.validate(data)
// }



const pump = util.promisify(pipeline)

export async function usersRouter(fastify, options) {
    // TODO: add middleware after jwt auth
    //onRequest: fastify.authenticate
    // {schema: userSchema.getUser, onRequest: [fastify.authenticate]}
    fastify.get('/api/users',
        {onRequest: [fastify.authenticate, fastify.admin]}, getUsersHandler)

    fastify.get('/api/users/:id', {schema: userSchema.getUser}, getUserHandler)

    // schema replace JOI
    fastify.post('/api/users', {
        // onRequest: [fastify.authenticate, fastify.admin],
        // schema: userSchema.createUser
    }, async (request, reply) => {
        return usersService.createUser(request.body)
    })

    fastify.patch("/api/users/:id", patchUserHandler)

    fastify.delete('/api/users/:id', {onRequest: fastify.authenticate}, deleteUserHandler)

    fastify.patch('/api/users/avatar', uploadAvatarHandler)
}

async function getUserHandler(req, rep) {
    const user = await usersService.getUser({id: req.params.id})
    if (!user) rep.send({message: 'User not found'}).status(404)
    return user;
}

async function getUsersHandler(req, res) {
    return usersService.getUsers();
}

async function patchUserHandler(req, res) {
    if (req.user.id === req.body.id)
        return usersService.updateUser(req.body)
    throw new createError('FST_PERMISSION', 'You are not allowed to update this profile', 403)
}

async function deleteUserHandler(req, res) {
    return await usersService.deleteUser(req.params.id)
}

async function uploadAvatarHandler(req, res) {
    const data = await req.file()
    const user = await usersService.getUser({id: data.fields.id.value})

    if (!user)
        throw new createError('FST_DB', 'User not found', 404)

    data.filename = user.id + `.${data.mimetype.split('/')[1]}`

    try {
        const previousAvatar = fs.statSync(path.join(this.__avatars, data.filename));
        if (previousAvatar) {
            fs.unlinkSync(path.join(this.__avatars, data.filename));
        }
    } catch (e) {
    }

    await pump(data.file, fs.createWriteStream(path.join(this.__dirname, '../storage/avatars', data.filename)))
}