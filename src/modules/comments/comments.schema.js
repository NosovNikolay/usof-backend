const getComment = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string'
            }
        }
    }
}

const createCommentLike = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string'
            }
        }
    },
    body: {
        type: 'object',
        required: ['type'],
        properties: {
            type: {
                type: 'string',
                enum: ['LIKE', 'DISLIKE']
            }
        }
    }
}


export const commentsSchema = {
    getComment,
    createCommentLike,
}