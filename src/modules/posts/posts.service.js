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
            where: params,
            select: {
                content: true,
                title: true,
                id: true,
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
            where: params,
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

                comments: {
                    select: {
                        author: true,
                        content: true
                    }
                },

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

    async getCategoriesOfPost(id) {
        return await this.prisma.category.findMany({
            where: {
                posts: {
                    some: {
                        post: {
                            id
                        }
                    }
                }
            }
        })
    }

    async deletePost(id) {
        const deletePostCategories = this.prisma.CategoriesOnPosts.deleteMany({
            where: {
                postId: id
            }
        })

        // const Delete all Likes
        // const Delete all Commenst

        const deletePost = this.prisma.post.delete({
            where: id
        })

        try {
            return this.prisma.$transaction([deletePostCategories, deletePost])
        } catch (e) {
            console.log(e)
        }
    }

}
export const postsService = new PostsService(prisma)
