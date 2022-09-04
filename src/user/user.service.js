import createError from '@fastify/error'
import * as bcrypt from 'bcrypt'

export default class UserService {

    constructor(prisma) {
        this.prisma = prisma
    }

    async getUser(login) {
        const user = await this.prisma.user.findUnique({
            where: {
                login,
            }
        })
        return user || new createError('FST_DB', 'User not found', 404, )();
    }

    async createUser(userInfo) {
        try {
            userInfo.password = await bcrypt.hash(userInfo.password, 10)
            const user = await this.prisma.user.create({ data: userInfo}) || null;
            return user;
        } catch (e) {
            // need to create custom error handler with db replies
            return new createError('FST_DB', 'User already exists', 409, )();
        }
    }
}