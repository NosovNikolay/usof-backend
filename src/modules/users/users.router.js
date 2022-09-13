import {userSchema} from "./users.schemas.js";
import {usersService} from "./users.service.js"

export async function usersRouter (fastify, options) {
    // TODO: add middleware after jwt auth
    //onRequest: fastify.authenticate

    // {schema: userSchema.getUser, onRequest: [fastify.authenticate]}
    fastify.get('/api/users' , getUsersHandler)

    fastify.get('/api/users/:id', async (request, reply) => {
        return usersService.getUserById(request.params.id);
    })

    fastify.post('/api/user', {schema: userSchema.createUser}, async (request, reply) => {
        return usersService.createUser(request.body)
    })

    fastify.patch('/api/user/:id', {schema: userSchema.getUser}, async (request, reply) => {
    })

    fastify.delete('/api/user/:id', {schema: userSchema.getUser}, async (request, reply) => {
    })

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

async function getUsersHandler() {
    return usersService.getUsers();
}
