import createError from '@fastify/error'
import * as bcrypt from 'bcrypt'
import {prisma} from '../../dbConnector/db.js'

class UsersService {

    constructor(prisma) {
        this.prisma = prisma
    }

    async getUser(userInfo) {
        try {
            return await this.prisma.user.findUnique({
                where: userInfo
            })
        } catch (e) {
            throw new createError('FST_DB', 'Wrong dataObj, try {id: ..., login: ...}', 409, )();
        }
    }

    async getUsers () {
        return await this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                full_name: true,
                rating: true,
                role: true
            }
        })
    }

    async createUser(userInfo) {
        try {
            userInfo.password = await bcrypt.hash(userInfo.password, 10)
            console.log(userInfo)
            return await this.prisma.user.create({data: userInfo});
        } catch (e) {
            // need to create custom error handler with db replies
            throw new createError('FST_DB', 'User already exists', 409, )();
        }
    }

    async confirmUser(login) {
        try {
            const user = await this.prisma.user.update({
                where: {
                    login
                },
                data: {
                    isActivated: true,
                },
            })
            return user;
        } catch (e) {
            // need to create custom error handler with db replies
            throw new createError('FST_DB', 'Cannot confirm users', 409, )();
        }
    }

    async updateUser (userData, id) {
        try {
            return await this.prisma.user.update({
                where: {
                    id
                },
                data: userData,
            });
        } catch (e) {
            // need to create custom error handler with db replies
            throw new createError('FST_DB', 'Cannot change user', 409)();
        }
    }

    async updateRating (userId, rating) {

    }

    async deleteUser(id) {

        try {
            return await this.prisma.user.delete({
                where: {
                    id
                }
            })
        } catch (e) {
            // need to create custom error handler with db replies
            throw new createError('FST_DB', 'Cannot confirm users', 409, )();
        }
    }
}

export const usersService = new UsersService(prisma)