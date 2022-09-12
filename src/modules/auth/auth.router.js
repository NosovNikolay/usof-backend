import {authService} from "./auth.service.js";
import createError from "@fastify/error";

export async function authRouter (fastify, options) {
    // TODO: add middleware after jwt auth
    // onRequest: fastify.authenticate

    fastify.post('/api/auth/registration', registrationHandler)

    fastify.get('/api/auth/registration', registrationConfirmationHandler)

    fastify.post('/api/auth/login', loginHandler)

    fastify.post('/api/auth/logout', logoutHandler)

    fastify.post('/api/auth/password-reset', changePassword)

    fastify.get('/api/auth/password-reset/:confirm_token', async (request, reply) => {
        reply.send({ token: authService.changePasswordApprove()})
            .status(200)
    })

}

async function registrationHandler(req, rep) {
    const token = await rep.jwtSign({ login: req.body.login })
    const user = await authService.register(req.body, token)
    return user

}
// TODO:
// Add shadow worker to delete not activated accounts in 2h
async function registrationConfirmationHandler(req, rep) {
    const decodedToken = this.jwt.decode(req.query.token)
    return authService.confirm(decodedToken.login)
}
// Choose one definition
// return or rep.send
async function loginHandler (req, rep) {
    const user = await authService.login(req.body)
    if (user)
        return {token: this.jwt.sign({login: user.login, id: user.id})}
    return new createError('FST_LOGIN', 'Wrong email or password', 403)
}

async function logoutHandler (req, rep) {
    rep.send({ message: await authService.logout(req.headers.authorization.split(' ')[1])})
        .status(200)
}

async function changePassword (req, rep) {
    return authService.changePassword(req.body)
}