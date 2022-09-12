import createError from "@fastify/error";
import {userService} from "../user.service.js"
import {blockList} from "./auth.blocklist.js";
import {confirmAccount} from "../../../emailer/email.sender.js"
import {prisma} from "../../../dbConnector/db.js";
import * as bcrypt from 'bcrypt'

export class AuthService {

    constructor(prisma) {
        this.prisma = prisma
    }

    async register(userInfo, token) {
        try {
            const user = await userService.createUser(userInfo);
            await confirmAccount(user.email, token);
        } catch (e) {
            return e
        }
    }

    async confirm(login) {
        const user = await userService.updateUser(login);
        return user;
    }

    async login(loginInfo) {
        const user = await userService.getUser(loginInfo.login)
        if (!user) throw new createError('FST_DB', 'Wrong email or password', 404, )()

        bcrypt.compare(loginInfo.password, user.password, function(err, data) {
            if (data) {
                return user
            } else {
                return err
            }
        })

        // if (!bcrypt.compare(, user.password)) new createError('FST_DB', 'User already registered', 404, )()
        return user
    }

    async emailApprove(token) {
        // token parse
        // get login

        // const user = await userService.update({isConfirmed: true})
        // return user;
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
