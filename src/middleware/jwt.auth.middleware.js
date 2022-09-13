import jwt from "@fastify/jwt";
import {env} from '../env/config.js'
import {blockList} from '../modules/auth/auth.blocklist.js'
import createError from "@fastify/error";

// Not tested
export async function jwtMiddleWare(fastify, opts, done) {
    await fastify.register(jwt, {
        secret: env.SECRET_KEY || 'secretKey',
        signOptions: {
            expiresIn: '2h'
        }
    })
    fastify.decorate("authenticate", async function(req, rep) {
        if (blockList.checkIsBlocked(req.headers.auth))
            rep.send(new createError('FST_AUTH', 'Token already exists', 401))
        try {
            await req.jwtVerify()
        } catch (err) {
            rep.send(err)
        }
    })
    done()
}