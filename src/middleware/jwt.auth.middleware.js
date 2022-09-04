import fp from 'fastify-plugin'
import fastifyJwt from "@fastify/jwt";
import {env} from '../env/config.js'
import {blockList} from '../auth/auth.blocklist.js'

// Not tested
export async function jwtMiddleWare(fastify, opts, done) {
    fastify.register(fastifyJwt, {
        secret: env.SECRET_KEY || 'secretKey',
        signOptions: {
            expiresIn: '24h'
        }
    })
    fastify.decorate("authenticate", async function(request, reply) {
        try {
            if (!blockList.checkIsBlocked(request.token))
                await request.jwtVerify()
        } catch (err) {
            reply.send(err)
        }
    })
    done()
}