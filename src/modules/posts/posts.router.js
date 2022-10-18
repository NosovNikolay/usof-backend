import {postsService} from './posts.service.js';
import {commentsService} from '../comments/comments.service.js';
import {likesService} from '../likes/likes.service.js';
import createError from '@fastify/error';
import {postSchema} from './posts.schema.js';

export async function postsRouter(fastify, options) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get('/api/posts', getPostsHandler);
  fastify.get(
      '/api/posts/:id',
      {schema: postSchema.getPost},
      getPostHandler,
  );
  fastify.get(
      '/api/posts/:id/comments',
      {schema: postSchema.getPost},
      getCommentsHandler,
  );
  fastify.get(
      '/api/posts/:id/categories',
      {schema: postSchema.getPost},
      getCategoriesOfPostHandler,
  );
  fastify.get(
      '/api/posts/:id/like',
      {schema: postSchema.getPost},
      getLikesHandler,
  );

  fastify.post(
      '/api/posts',
      {schema: postSchema.createPost},
      createPostHandler,
  );
  fastify.delete(
      '/api/posts/:id',
      {schema: postSchema.getPost},
      deletePostHandler,
  );

  fastify.patch(
      '/api/posts/:id',
      {schema: postSchema.changePost},
      patchPostHandler,
  );
  fastify.post(
      '/api/posts/:id/like',
      {schema: postSchema.likePost},
      createLikeHandler,
  );
  fastify.delete(
      '/api/posts/:id/like',
      {schema: postSchema.getPost},
      deleteLikeHandler,
  );
  fastify.post(
      '/api/posts/:id/comments',
      {scheme: postSchema.commentPost},
      createCommentHandler,
  );
}

async function createPostHandler(req, rep) {
  return await postsService.createPost(req.user.id, req.body);
}
async function getPostHandler(req, rep) {
  if (req.user.role === 'USER') req.params.status = 'ACTIVE';
  return await postsService.getPost(req.params);
}
async function getPostsHandler(req, rep) {
  if (req.user.role === 'USER') req.params.status = 'ACTIVE';
  return await postsService.getPosts(
      req.params,
      req.query.page,
      req.query.orderBy,
      req.query.sequence,
  );
}
async function getCategoriesOfPostHandler(req, rep) {
  return await postsService.getCategoriesOfPost(req.params.id);
}
async function createCommentHandler(req, rep) {
  return await commentsService.createComment({
    authorId: req.user.id,
    postId: req.params.id,
    content: req.body.content,
  });
}
async function getCommentsHandler(req, rep) {
  return await commentsService.getComments(req.params.id);
}
async function createLikeHandler(req, rep) {
  return await postsService.likePost(
      req.user.id,
      req.body.type,
      req.params.id,
  );
}
async function deleteLikeHandler(req, rep) {
  return await postsService.deleteLike(req.user.id, req.params.id);
}
async function getLikesHandler(req, rep) {
  return await likesService.getLikes(req.params.id);
}
async function patchPostHandler(req, rep) {
  return await postsService.patchPost(
      req.params.id,
      req.user.id,
      req.user.role,
      {
        status: req.body.status,
        addCategories: req.body.addCategories,
        deleteCategories: req.body.deleteCategories,
      },
  );
}
async function deletePostHandler(req, rep) {
  const post = await postsService.getPost({id: req.params.id});
  if (post && (post.id === req.user.id || req.user.role === 'ADMIN')) {
    return await postsService.deletePost(req.params.id);
  }
  throw new createError('FST_PERMISSION', 'You can\'t delete this post', 403);
}
