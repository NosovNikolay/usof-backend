const createUser = {
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

const getUser = {
    querystring: {
        type: 'object',
        required: ['login'],
        properties: {
            login: { type: 'string' },
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id : { type: 'number' },
                login: { type: 'string' },
                full_name: { type: 'string' },
                rating: { type: 'number' },
                role: { type: 'string' },
            },
            additionalProperties: false
        }
    }
}

export const userSchema = {
    getUser: getUser
}
