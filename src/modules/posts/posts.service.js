import createError from '@fastify/error'
import {prisma} from '../../dbConnector/db.js'
import {likesService} from "../likes/likes.service.js";

class PostsService {

    constructor(prisma) {
        this.prisma = prisma
    }

    async createPost(authorId, data) {
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
                authorId: authorId,
                content: data.content,
                title:  data.title,
                categories: {
                    create: categories
                }
            }
        })
    }

    async getPosts(params, page = 0, order = 'publishDate', sequence = 'asc') {
        const posts = await this.prisma.post.findMany({
            orderBy: {
                [order] : sequence
            },
            skip: page * 20,
            take: 20,
            where: params,
            select: {
                content: true,
                title: true,
                id: true,
                publishDate: true,
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
                        author: {
                            select: {
                                id: true,
                                full_name: true
                            }
                        },
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

        const comments = this.prisma.comment.deleteMany({
            where: {
                postId: id
            }
        })

        // const Delete all Commenst
        const deletePost = this.prisma.post.delete({
            where: id
        })

        try {
            return this.prisma.$transaction([deletePostCategories, deletePost, comments, ])
        } catch (e) {
            console.log(e)
        }
    }

    async patchPost(id, authorId, role, {status, addCategories, deleteCategories, content}) {

        const post = await this.prisma.post.findUnique({
            where: {id}
        })

        if (!post)
            throw new createError('FST_DB', 'Not found', 404)

        if (post.authorId !== authorId) {
            content = null;
            if (role !== 'ADMIN')
                throw new createError('FST_DB', 'You can not change this post', 403)
        }


        if (deleteCategories) {
            await this.prisma.categoriesOnPosts.deleteMany({
                where: {
                    categoryId: {
                        in: deleteCategories
                    }
                }
            })
        }

        const add = addCategories ? addCategories.map((e) => new Object(
            {
                category: {
                    connect: {
                        id: e,
                    },
                },
            })
        ) : undefined;

        return await this.prisma.post.update({
            where: {id},
            data: {
                categories: {
                    create: add,
                },
                status: status || post.status,
                content: content ? content : undefined
            }
        })
    }

    async likePost (userId, type, postId) {
        const post = await this.prisma.post.findUnique({where: {id:postId}})
        console.log(post)
        if (post)
            return likesService.createLike(userId, type, postId, post.authorId);
        return '';
    }

    async deleteLike (userId, postId) {
        const post = await this.prisma.post.findUnique({where: {id:postId}})
        if (post)
            return likesService.deleteLike(userId, postId, post.authorId);
        return '';
    }


}
export const postsService = new PostsService(prisma)
