import {postsService} from './posts.service.js'
import {commentsService} from "../comments/comments.service.js";
export async function postsRouter(fastify, options) {
    // fastify.addHook('onRequest', fastify.authenticate);

    fastify.get('/api/posts', getPostsHandler)
    fastify.get('/api/posts/:id', getPostHandler)
    fastify.get('/api/posts/:id/comments', () => {})
    fastify.get('/api/posts/:id/categories', getCategoriesOfPostHandler)
    fastify.get('/api/posts/:id/likes', () => {})

    fastify.post('/api/posts', createPostHandler)

    // fastify.post('/api/posts', () => {})
    fastify.post('/api/posts/:id/like', () => {})
    fastify.post('/api/posts/:id/comments', createCommentHandler)

}

async function createPostHandler(req, rep) {
    return await postsService.createPost(req.body)
}
async function getPostHandler(req, rep) {
    return await postsService.getPost({id: req.params.id})
}
async function getPostsHandler(req, rep) {
    return await postsService.getPosts(req.params)
}
async function getCategoriesOfPostHandler(req, rep) {
    return await postsService.getCategoriesOfPost(req.params.id)
}
async function createCommentHandler(req, rep) {
    return await commentsService.createComment({authorId: req.user.id, postId: req.body.postId, content: req.body.content})
}