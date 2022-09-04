export const userShema = {
    getUser: getUser
}


const getUser = {
    body: {
        type: 'object',
        required: [ 'username', 'password' ],
        properties: {
            username: {
                type: 'string'
            },
            password: {
                type: 'string'
            }
        },
        additionalProperties: false
    },
    response: {
        // The 200 body response is described
        // by the following schema
        200: {
            type: 'object',
            required: [ 'userId' ],
            properties: {
                userId: { type: 'string' }
            },
            additionalProperties: false
        }
    }
}