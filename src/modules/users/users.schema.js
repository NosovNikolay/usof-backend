const createUser = {
  body: {
    type: 'object',
    required: ['login', 'password', 'email', 'role'],
    properties: {
      login: {
        type: 'string',
      },
      password: {
        type: 'string',
        maxLength: 16,
        minLength: 8,
      },
      email: {
        type: 'string',
      },
      full_name: {
        type: ['string', 'null'],
      },
      role: {
        type: ['string'],
        enum: ['ADMIN', 'USER'],
      },
    },
    additionalProperties: false,
  },
};
const patchUser = {
  body: {
    type: 'object',
    required: ['full_name'],
    properties: {
      full_name: {
        type: ['string'],
      },
    },
    additionalProperties: false,
  },
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
      },
    },
  },
};

const getUser = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
      },
    },
  },
};

export const userSchema = {
  getUser,
  createUser,
  patchUser,
};
