const getCategory = {
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
const createCategory = {
  body: {
    type: 'object',
    required: ['title', 'description'],
    properties: {
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
    },
  },
};
const patchCategory = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
      },
    },
  },
  body: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
    },
  },
};
export const categoriesSchema = {
  getCategory,
  createCategory,
  patchCategory,
};
