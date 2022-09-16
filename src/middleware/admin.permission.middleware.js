import createError from "@fastify/error";

// Works only with JWT middleware before
export async function adminPermissionMiddleware(fastify, opts, done) {
    fastify.decorate("admin", async function(req, rep) {
        if (req?.user?.role !== 'ADMIN')
            rep.send({
                message: 'You are not admin',
                code: 403
            }).code(403)
    })
    done()
}