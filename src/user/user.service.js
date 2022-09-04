export default class UserService {

    constructor(prisma) {
        this.prisma = prisma
    }

    async getUser(login) {
        const user = await this.prisma.user.findUnique({
            where: {
                login,
            },
        })
        return user;
    }
}