class AuthBlocklist {

    constructor(props) {
        this.blockList = props || [];
    }

    checkIsBlocked(token) {
        return this.blockList.includes(token)
    }

    blockToken(token) {
        if(this.checkIsBlocked(token)) {
            return 'Token is already in block list';
        }

        this.blockList.push(token)

        setTimeout(() => {
            this.blockList = this.blockList.filter(function(ele){
                return ele !== token;
            });
        }, 7200000)
        return 'Token is blocked';
    }
}

export const blockList = new AuthBlocklist();
