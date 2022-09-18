import Fastify from 'fastify';
import FastifyMultipart from "@fastify/multipart";
import chalk from 'chalk';
import fp from 'fastify-plugin';
import path from 'path'
import fs from 'fs';
import fastifyStatic from '@fastify/static'
import { fileURLToPath } from 'url';

import {env} from './env/config.js';
import {prisma} from './dbConnector/db.js';
import {usersRouter} from './modules/users/users.router.js';
import {jwtMiddleWare} from './middleware/jwt.auth.middleware.js';
import {authRouter} from './modules/auth/auth.router.js';
import {adminPermissionMiddleware} from './middleware/admin.permission.middleware.js';

const fastify = Fastify({
    logger: true,
})

const __filename = fileURLToPath(import.meta.url);
fastify.__dirname = path.dirname(__filename);
fastify.__avatars = path.join(fastify.__dirname, '../storage/avatars')
fastify.__posts = path.dirname(fastify.__dirname, '../storage/posts');

fastify.register(FastifyMultipart, {
    limits: {
        fieldNameSize: 100, // Max field name size in bytes
        fieldSize: 100,     // Max field value size in bytes
        fields: 10,         // Max number of non-file fields
        fileSize: 1000000,  // For multipart forms, the max file size in bytes
        files: 1,           // Max number of file fields
        headerPairs: 2000   // Max number of header key=>value pairs
    }
})
fastify.register(fp(jwtMiddleWare))
fastify.register(fp(adminPermissionMiddleware))
fastify.register(usersRouter)
fastify.register(authRouter)

fastify.register(fastifyStatic, {
    root: path.join(fastify.__dirname, '../static'),
    prefix: '/static/'
})

fastify.get('/',
    (req, rep) => {
        try {
            rep.sendFile('download.png')
        }
        catch (e) { console.log(e) }
    }
)

async function start () {
    try {
        await prisma.$connect();
        console.log(chalk.green('DB connection established'));
        await fastify.ready()
        await fastify.listen({ port: env.PORT});
    } catch (e) {
        console.log(chalk.red(e));
        process.exit(1)
    }
}

start().then(() => {
    console.log(chalk.green('Server started'));
    const storage = path.join(fastify.__dirname, '../storage')

    if (!fs.existsSync(storage)) fs.mkdirSync(storage);

    if (!fs.existsSync(storage + '/avatars')) fs.mkdirSync(storage + '/avatars');

    if (!fs.existsSync(storage + '/posts')) fs.mkdirSync(storage + '/posts');
});
