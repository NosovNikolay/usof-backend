import jwt from "@fastify/jwt";
import {env} from '../env/config.js'
import {blockList} from '../modules/auth/auth.blocklist.js'

export async function jwtMiddleWare(fastify, opts, done) {
    await fastify.register(jwt, {
        secret: env.SECRET_KEY || 'secretKey',
        signOptions: {
            expiresIn: '2h'
        },
    })

    fastify.addHook('onRequest', (request, reply, done) => {
        const bearer = request.headers.authorization;
        if (bearer) {
            request.auth = bearer.split(' ')[1];
        }
        done()
    })
    //
    fastify.decorate("authenticate", async function(req, rep) {
        try {
            await req.jwtVerify()
            if (blockList.checkIsBlocked(req.auth))
                rep.send({
                    message: 'Token already exists',
                    status: 403
                }).code(401)
        } catch (err) {
            rep.send(err)
        }
    })
    done()
}