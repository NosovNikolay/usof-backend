import {postsService} from './posts.service.js'
export async function postsRouter(fastify, options) {
    fastify.post('/api/posts', createPostHandler)
    fastify.get('/api/posts/:id', getPostHandler)
    fastify.get('/api/posts', getPostsHandler)
}

async function createPostHandler(req, rep) {
    return await postsService.createPost(req.body)
}
async function getPostHandler(req, rep) {

}
async function getPostsHandler(req, rep) {
    return await postsService.getPosts(req.params)
}
