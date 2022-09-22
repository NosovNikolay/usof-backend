const createUser = {
    body: {
        type: 'object',
        required: [ 'login', 'password', 'email'],
        properties: {
            login: {
                type: 'string'
            },
            password: {
                type: 'string',
                maxLength: 16,
                minLength: 8
            },
            email: {
                type: 'string'
            },
            full_name: {
                type: ['string', 'null']
            }
        },
        additionalProperties: false
    },
    response: {
        // The 200 body response is described
        // by the following schema
        200: {
            type: 'object',
            properties: {
                userId: { type: 'string' }
            },
            additionalProperties: false
        },
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
        },
    }
}

export const userSchema = {
    getUser,
    createUser,
}