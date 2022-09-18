import createError from "@fastify/error";
import {usersService} from "../users/users.service.js"
import {blockList} from "./auth.blocklist.js";
import {changePassword, confirmAccount} from "../../emailer/email.sender.js"
import {prisma} from "../../dbConnector/db.js";
import * as bcrypt from 'bcrypt'

export class AuthService {

    constructor (prisma) {
        this.prisma = prisma
    }

    async register (userInfo, token) {
        try {
            userInfo.role = 'USER';
            const user = await usersService.createUser(userInfo);
            confirmAccount(user.email, token).then(() => {
                console.log('Email send')
            });
            setTimeout(async () => {
                await prisma.user.delete({
                    where: {
                        isActivated: false
                    }
                })
            }, 7200000) //2h
            return user;
        } catch (e) {
            return e;
        }
    }

    async confirm (login) {
        return await usersService.confirmUser(login);
    }

    async login (loginInfo) {
        const user = await usersService.getUser({login: loginInfo.login});
        if (!user ||
            !bcrypt.compareSync(loginInfo.password, user.password))
            throw new createError('FST_DB', 'Wrong email or password', 404, )();
        return user;
    }

    async logout (token) {
        return blockList.blockToken(token);
    }

    async changePassword (userInfo) {
        try {
            const user = await usersService.getUser({login: userInfo.login})
            await changePassword(user.email, token);
            return user;
        } catch (e) {
            return e;
        }
    }

    async changePasswordApprove (token) {

    }
}

export const authService = new AuthService(prisma);
