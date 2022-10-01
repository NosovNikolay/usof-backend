import createError from '@fastify/error'
import {prisma} from '../../dbConnector/db.js'
import {postsService} from '../posts/posts.service.js'

class CategoriesService {

    constructor(prisma) {
        this.prisma = prisma
    }

    async createCategory(data) {
        return await this.prisma.category.create({
            data
        })
    }

    async patchCategory(id, data) {
        return await this.prisma.category.update({
            where: {
                id
            },
            data
        })
    }

    // params
    async getCategories() {
        return await this.prisma.category.findMany({})
    }

    async getCategory(id) {
        return await this.prisma.category.findUnique({
            where: {
                id
            }
        })
    }

    // delete posts
    // const updatePost = await prisma.user.update({
    //     where: {
    //         id: 16,
    //     },
    //     data: {
    //         posts: {
    //             disconnect: [{ id: 12 }, { id: 19 }],
    //         },
    //     },
    //     select: {
    //         posts: true,
    //     },
    // })

    async deleteCategory(id) {
        const deletePostCategories = this.prisma.CategoriesOnPosts.deleteMany({
            where: {
                categoryId: id
            }
        })

        const deletePosts = this.prisma.post.deleteMany({
            where: {
                categories: {
                    none: {}
                }
            }
        })

        const deleteCategory = this.prisma.category.delete({
            where: {
                id
            }
        })

        try {
            return this.prisma.$transaction([deletePostCategories, deleteCategory, deletePosts])
        } catch (e) {
            console.log(e)
        }
    }

    async getPostsWithCategory(params) {
        return await postsService.getPosts({
            status: params.status,
            categories: {
                every: {
                    category: {
                        id: params.id
                    }
                }
            }
        })
    }
}

export const categoriesService = new CategoriesService(prisma)
