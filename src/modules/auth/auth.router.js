import {authService} from "./auth.service.js";
import createError from "@fastify/error";
import {usersService} from "../users/users.service.js";
import {changePassword} from "../../emailer/email.sender.js";
import {blockList} from "./auth.blocklist.js";

export async function authRouter (fastify, options) {
    // TODO: add middleware after jwt auth
    // onRequest: fastify.authenticate

    fastify.post('/api/auth/registration', registrationHandler)
    // send confirmation html
    fastify.get('/api/auth/registration', registrationConfirmationHandler)

    fastify.post('/api/auth/login', loginHandler)

    fastify.post('/api/auth/logout', logoutHandler)

    fastify.post('/api/auth/password-reset', changePasswordHandler)

    fastify.get('/api/auth/password-reset', (req, rep) => {
        rep.sendFile('reset-password.html')
    })

    fastify.post('/api/auth/password-reset/confirm', {onRequest: fastify.authenticate }, changePasswordApproveHandler)

    // fastify.post('/api/auth/password-reset', async (request, reply) => {
    //     reply.send({ token: authService.changePasswordApprove})
    //         .status(200)
    // })

}

async function registrationHandler(req, rep) {
    const token = await rep.jwtSign({ login: req.body.login })
    return await authService.register(req.body, token)
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
        return {token: this.jwt.sign({login: user.login, id: user.id, role: user.role})}
    return new createError('FST_LOGIN', 'Wrong email or password', 403)
}

async function logoutHandler (req, rep) {
    rep.send({message: await authService.logout(req.auth)})
        .status(200)
}

async function changePasswordHandler (req, rep) {
    const user = await usersService.getUser({email: req.body.email})
    if (user) {
        await changePassword(user.email, this.jwt.sign({login: user.login, id: user.id}));
        rep.send({message: 'Email sent. Check your email'}).status(200);
    }
    rep.send({message: 'User does not exist'}).status(404);
}
async function changePasswordApproveHandler (req, rep) {
    blockList.blockToken(req.auth)
    if (await authService.changePasswordApprove(req.user.login, req.body.password))
        rep.send({message: 'Password changed', status: 200}).status(200)
    rep.send({message: 'Failed', status: 403}).status(403)
}
