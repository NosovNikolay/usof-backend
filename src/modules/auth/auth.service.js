import createError from "@fastify/error";
import {usersService} from "../users/users.service.js"
import {blockList} from "./auth.blocklist.js";
import {confirmAccount} from "../../emailer/email.sender.js"
import {prisma} from "../../dbConnector/db.js";
import * as bcrypt from 'bcrypt'

export class AuthService {

    constructor(prisma) {
        this.prisma = prisma
    }

    async register(userInfo, token) {
        try {
            const user = await usersService.createUser(userInfo);
            await confirmAccount(user.email, token);
            return user;
        } catch (e) {
            return e
        }
    }

    async confirm(login) {
        const user = await usersService.updateUser(login);
        return user;
    }

    async login(loginInfo) {
        const user = await usersService.getUser(loginInfo.login)
        if (!user ||
            !bcrypt.compareSync(loginInfo.password, user.password))
            throw new createError('FST_DB', 'Wrong email or password', 404, )();
        return user;
    }

    async emailApprove(token) {
        // token parse
        // get login

        // const users = await userService.update({isConfirmed: true})
        // return users;
    }

    async logout(token) {
        return blockList.blockToken(token)
    }

    async changePassword(userInfo) {
    }

    async changePasswordApprove(token) {

    }
}

export const authService = new AuthService(prisma);
