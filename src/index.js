import Fastify from 'fastify'
import chalk from 'chalk';
import {env} from './env/config.js'
import {prisma} from './dbConnector/db.js'
import {userRouter} from "./user/user.router.js";
import {jwtMiddleWare} from "./middleware/jwt.auth.middleware.js"
import fp from "fastify-plugin"

const fastify = Fastify({
    logger: true,
})
fastify.register(fp(jwtMiddleWare))
fastify.register(userRouter)

async function start () {
    try {
        await prisma.$connect();
        console.log(chalk.green('DB connection established'));
        await fastify.listen({ port: env.PORT});
    } catch (e) {
        console.log(chalk.red(e));
        process.exit(1)
    }
}

start().then(() => {
    console.log(chalk.green('Server started'));
});


