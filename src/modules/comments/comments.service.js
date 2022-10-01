import {prisma} from "../../dbConnector/db.js";

class CommentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async createComment(data) {
        return await this.prisma.comment.create({
            data: data
        })
    }

    async getComment(data) {
        return await this.prisma.comment.findUnique({
            where: {
                id: data.id
            }
        })
    }

    async deleteComment(id, authorId) {
        return await this.prisma.comment.delete({
            where: {
                id
            }
        })
    }

    async changeStatus(id, authorId) {
        return await this.prisma.comment.create({
            data: data
        })
    }
}

export const commentsService = new CommentsService(prisma)