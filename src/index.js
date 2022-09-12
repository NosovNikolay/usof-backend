import Fastify from 'fastify'
import chalk from 'chalk';
import {env} from './env/config.js'
import {prisma} from './dbConnector/db.js'
import {usersRouter} from "./modules/users/users.router.js";
import {jwtMiddleWare} from "./middleware/jwt.auth.middleware.js"
import fp from "fastify-plugin"
import {authRouter} from "./modules/auth/auth.router.js";
import {cloudinaryDecorate} from "./cloudinaty/cloudinary.js"
import multer from "fastify-multer";

const fastify = Fastify({
    logger: true,
})

fastify.register(fp(jwtMiddleWare))
fastify.register(fp(cloudinaryDecorate))
fastify.register(usersRouter)
fastify.register(authRouter)
// TODO:
// add image/png parser
// fastify.addContentTypeParser('image/png', function (request, payload, done) {
//     done()
// })



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
});


