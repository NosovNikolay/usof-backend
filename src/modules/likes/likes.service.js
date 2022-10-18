import {usersService} from "../users/users.service.js";
import {prisma} from "../../dbConnector/db.js";

class LikesService {
    constructor(prisma) {
        this.prisma = prisma
    }

    async createLike (authorId, type, comment_postId, id) {
        const ifExists = await this.prisma.like.findUnique({
            where: {
                authorId_post_comment:{
                    authorId,
                    post_comment: comment_postId
                }
            }
        })

        const rating = this.prisma.user.update({
            where: {
                id: authorId
            },
            data: {
                rating: {increment: type === 'LIKE' ? 1 : -1}
            }
        })

        const like = this.prisma.like.upsert({
            where: {
                authorId_post_comment:{
                    authorId,
                    post_comment: comment_postId
                }
            },
            create: {
                authorId,
                type,
                post_comment: comment_postId
            },
            update: {
                type,
            }
        })
        try {
            return type === ifExists?.type ? this.prisma.$transaction([like]) : this.prisma.$transaction([like, rating])
        } catch (e) {
            // return error
            console.log(e)
        }
    }

    async deleteLike (authorId, comment_postId, id) {
        const like = await this.prisma.like.delete({
            where: {
                authorId_post_comment:{
                    authorId,
                    post_comment: comment_postId
                }
            }
        })

        return await this.prisma.user.update({
            where: {
                id
            },
            data: {
                rating: {increment: like.type === 'LIKE' ? -1 : 1}
            }
        })
    }

    async getLikes (comments_postId) {
        return await this.prisma.like.findMany({
            where: {
                post_comment: comments_postId
            }
        })
    }
}

export const likesService = new LikesService(prisma)