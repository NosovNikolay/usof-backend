import createError from "@fastify/error";
import {usersService} from "../users/users.service.js"
import {blockList} from "./auth.blocklist.js";
import {confirmAccount} from "../../emailer/email.sender.js"
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
                await prisma.user.deleteMany({
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
        const user = await this.prisma.user.findUnique({
        where: {
            login: loginInfo.login
        }
        });
        if (!user ||
            !bcrypt.compareSync(loginInfo.password, user.password))
            throw new createError('FST_DB', 'Wrong email or password', 404, )();
        if (!user.isActivated)
            throw new createError('FST_DB', 'Activate your account', 404, )();
        return user;
    }

    async logout (token) {
        return blockList.blockToken(token);
    }

    async changePasswordApprove (login, newPassword) {
        newPassword = await bcrypt.hash(newPassword, 10)
        return await this.prisma.user.update({
            where: {
                login
            },
            data: {
                password: newPassword
            }
        })
    }
}

export const authService = new AuthService(prisma);
