import {commentsService} from "./comments.service.js";

export async function commentsController(fastify, options) {
    fastify.get('/api/comments/:id', getCommentHandler)
    fastify.delete('/api/comments/:id', deleteCommentHandler)
}

async function getCommentHandler(req, rep) {
    return await commentsService.getComment({id: req.params.id})
}
async function deleteCommentHandler(req, rep) {
    return await commentsService.deleteComment(req.params.id)
}