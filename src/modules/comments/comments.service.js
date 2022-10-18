import {prisma} from '../../dbConnector/db.js';
import createError from '@fastify/error';

class CommentsService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createComment(data) {
    return await this.prisma.comment.create({
      data: data,
    });
  }

  async getComment(data) {
    return await this.prisma.comment.findUnique({
      where: {
        id: data.id,
      },
    });
  }

  async getComments(postId) {
    return await this.prisma.comment.findUnique({
      where: {
        posts: {
          some: {
            id: postId,
          },
        },
      },
    });
  }

  async deleteComment(id, authorId) {
    return await this.prisma.comment.delete({
      where: {
        id,
      },
    });
  }

  async changeStatus(id, role, userId) {
    const comment = this.prisma.comment.findUnique({
      where: {id},
    });
    if (comment && (comment.authorId === userId || role === 'ADMIN')) {
      return await this.prisma.comment.update({
        where: {id},
        data: comment.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
      });
    }
    throw new createError('FST_DB', 'Comment is not changeable', 403);
  }
}

export const commentsService = new CommentsService(prisma);
