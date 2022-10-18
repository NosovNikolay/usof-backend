import {commentsService} from './comments.service.js';
import {likesService} from '../likes/likes.service.js';
import {commentsSchema} from './comments.schema.js';

export async function commentsController(fastify, options) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get(
      '/api/comments/:id',
      {schema: commentsSchema.getComment},
      getCommentHandler,
  );
  fastify.delete(
      '/api/comments/:id',
      {schema: commentsSchema.getComment},
      deleteCommentHandler,
  );
  fastify.post(
      '/api/comments/:id/like',
      {schema: commentsSchema.createCommentLike},
      createLikeCommentHandler,
  );
  fastify.delete(
      '/api/comments/:id/like',
      {schema: commentsSchema.getComment},
      deleteLikeCommentHandler,
  );
  fastify.get(
      '/api/comments/:id/like',
      {schema: commentsSchema.getComment},
      getLikesComment,
  );
  fastify.patch(
      '/api/comments/:id',
      {schema: commentsSchema.getComment},
      patchComment,
  );
}

async function getCommentHandler(req, rep) {
  return await commentsService.getComment({id: req.params.id});
}
async function deleteCommentHandler(req, rep) {
  return await commentsService.deleteComment(req.params.id);
}
async function createLikeCommentHandler(req, rep) {
  return await likesService.createLike(
      req.user.id,
      req.body.type,
      req.params.id,
  );
}
async function deleteLikeCommentHandler(req, rep) {
  return await commentsService.deleteComment(req.params.id);
}
async function getLikesComment(req, rep) {
  return await commentsService.deleteComment(req.params.id);
}
async function patchComment(req, rep) {
  return await commentsService.changeStatus(
      req.param.id,
      req.user.role,
      req.user.id,
  );
}
