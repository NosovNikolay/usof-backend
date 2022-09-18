import jwt from "@fastify/jwt";
import {env} from '../env/config.js'
import {blockList} from '../modules/auth/auth.blocklist.js'

// Not tested
export async function jwtMiddleWare(fastify, opts, done) {
    await fastify.register(jwt, {
        secret: env.SECRET_KEY || 'secretKey',
        signOptions: {
            expiresIn: '2h'
        },
        // Custom user obj in req
        // formatUser: function (user) {
        //     return {
        //         role: "ADMIN",
        //         login: user.login,
        //         id: user.id
        //     }
        // },
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
                    code: 401
                }).code(401)
        } catch (err) {
            rep.send(err)
        }
    })
    done()
}