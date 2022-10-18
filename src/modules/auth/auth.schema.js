const login = {
  body: {
    type: 'object',
    required: ['login', 'password'],
    additionalProperties: false,
    properties: {
      login: {
        type: 'string',
      },
      password: {
        type: 'string',
      },
    },
  },
};

const registration = {
  body: {
    type: 'object',
    required: ['login', 'password', 'email'],
    properties: {
      login: {
        type: 'string',
      },
      password: {
        type: 'string',
      },
      email: {
        type: 'string',
      },
      full_name: {
        type: 'string',
      },
    },
  },
};

const changePassword = {
  body: {
    type: 'object',
    required: ['email'],
    properties: {
      email: {
        type: 'string',
      },
    },
  },
};

const registrationConfirm = {
  query: {
    type: 'object',
    required: ['token'],
    properties: {
      token: {
        type: 'string',
      },
    },
  },
};

const changePasswordApprove = {
  body: {
    type: 'object',
    required: ['password'],
    properties: {
      password: {
        type: 'string',
      },
    },
  },
};

export const authSchema = {
  login,
  registration,
  changePassword,
  registrationConfirm,
  changePasswordApprove,
};
