import createError from '@fastify/error'
import {prisma} from '../../dbConnector/db.js'

class PostsService {

    constructor(prisma) {
        this.prisma = prisma
    }

    async createPost(data) {
        const categories = data.categories.map((e) => new Object(
            {
                category: {
                    connect: {
                        id: e,
                    },
                },
            })
        )

        return await this.prisma.post.create({
            data: {
                authorId: data.authorId,
                content: data.content,
                title:  data.title,
                categories: {
                    create: categories
                }
            }
        })
    }

    async getPosts(params) {
        const posts = await this.prisma.post.findMany({
            select: {
                content: true,
                title: true,
                author: {
                    select: {
                        login: true,
                        full_name: true,
                        rating: true,
                    }
                },

                categories: {
                    select: {
                        category: {
                            select: {
                                title: true
                            }
                        }
                    }
                }
            },
        })
        return posts.map((post) => {
            post.categories = post.categories.map((el) => el.category)
            return post;
        })
    }

    async getPost(params) {
        return await this.prisma.post.findUnique({
            where: {
                id: params.id,
                isActive: params.isActive
            },
            select: {
                id: true,
                content: true,
                title: true,
                author: {
                    select: {
                        login: true,
                        full_name: true,
                        rating: true,
                    }
                },

                // comments

                categories: {
                    select: {
                        category: {
                            select: {
                                id: true,
                                title: true
                            }
                        }
                    }
                }
            },
        })
    }

    async deletePost(id) {
        return await this.prisma.post.delete({
            where: id
        })
    }

}
export const postsService = new PostsService(prisma)
