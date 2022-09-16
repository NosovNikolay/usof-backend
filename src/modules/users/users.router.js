import {userSchema} from "./users.schemas.js";
import {usersService} from "./users.service.js"
import {authService} from "../auth/auth.service.js";
import createError from "@fastify/error";

export async function usersRouter(fastify, options) {
    // TODO: add middleware after jwt auth
    //onRequest: fastify.authenticate

    // {schema: userSchema.getUser, onRequest: [fastify.authenticate]}
    fastify.get('/api/users',
        {onRequest: [fastify.authenticate, fastify.admin]}, getUsersHandler)

    fastify.get('/api/users/:id', async (req, rep) => {
        return usersService.getUser({id: req.params.id});
    })

    // schema replace JOI
    fastify.post('/api/users', {
        onRequest: [fastify.authenticate, fastify.admin],
        schema: userSchema.createUser
    }, async (request, reply) => {
        return usersService.createUser(request.body)
    })

    fastify.patch("/api/users/:id", patchUserHandler)

    // fastify.patch('/api/users/avatar', {schema: userSchema.getUser}, async (request, reply) => {
    //
    // })

    fastify.delete('/api/users/:id', {onRequest: fastify.authenticate}, deleteUserHandler)

    // fastify.patch('/api/users/avatar', {preHandler: fastify.multer.parser.single('upload'),} , async (req, res) => {
    //     console.log(req)
    //     console.log({
    //         filename: req.file.filename,
    //         originalname: req.file.originalname,
    //         url: req.file.path
    //     })
    //
    // })
    //
    // fastify.get('/api/users/avatar' , async (req, res) => {
    //
    //     console.log(req)
    //     // console.log({
    //     //     filename: req.file.filename,
    //     //     originalname: req.file.originalname,
    //     //     url: req.file.path
    //     // })
    //
    // })

    // server.route({
    //     method: 'GET',
    //     url: '/gallery',
    //     handler: async (request, reply) => {
    //         // request.file is the `avatar` file
    //         // request.body will hold the text fields, if there were any
    //         const { Gallery } = server.db.models;
    //         const data = await Gallery.find({});
    //         reply.code(200).send({ message: 'SUCCESS', data });
    //     }
    // });
    // server.route({
    //     method: 'POST',
    //     url: '/gallery',
    //     preHandler: server.multer.parser.single('upload'),
    //     handler: async (request, reply) => {
    //         // request.file is the `avatar` file
    //         // request.body will hold the text fields, if there were any
    //         const { Gallery } = server.db.models;
    //         const image = new Gallery({
    //             filename: request.file.filename,
    //             originalname: request.file.originalname,
    //             url: request.file.path
    //         });
    //         const data = await image.save();
    //         reply.code(200).send({ message: 'SUCCESS', data });
    //     }
    // });
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
