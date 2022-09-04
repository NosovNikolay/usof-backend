class AuthBlocklist {
    blockList = [];
    checkIsBlocked(token) {
        return this.blockList.includes(token)
    }

    blockToken(token) {
        this.blockList.push(token)
    }
}

export const blockList = new AuthBlocklist();