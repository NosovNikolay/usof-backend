import createError from '@fastify/error'
import * as bcrypt from 'bcrypt'
import {prisma} from '../../dbConnector/db.js'

class UsersService {

    constructor(prisma) {
        this.prisma = prisma
    }

    async getUser(login) {
        return await this.prisma.user.findUnique({
            where: {
                login
            }
        })
    }

    async getUserById(id) {
        id = Number(id)
        return await this.prisma.user.findUnique({
            where: {
                id
            }
        })
    }

    async getUsers () {
        return await this.prisma.user.findMany({})
    }

    async createUser(userInfo) {
        try {
            userInfo.password = await bcrypt.hash(userInfo.password, 10)
            const user = await this.prisma.user.create({ data: userInfo});
            return user;
        } catch (e) {
            // need to create custom error handler with db replies
            throw new createError('FST_DB', 'User already exists', 409, )();
        }
    }

    async updateUser(login) {
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

    async deleteUser(login) {
        try {
            const user = await this.prisma.user.delete({
                where: {
                    login
                }
            })
            return user;
        } catch (e) {
            // need to create custom error handler with db replies
            throw new createError('FST_DB', 'Cannot confirm users', 409, )();
        }
    }

}

export const usersService = new UsersService(prisma)