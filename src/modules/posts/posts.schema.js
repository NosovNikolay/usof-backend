const getPost = {
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

const createPost = {
  body: {
    type: 'object',
    required: ['categories', 'title', 'content'],
    properties: {
      categories: {
        type: 'array',
        items: {type: 'string'},
        nullable: false,
      },
      content: {
        type: 'string',
        nullable: false,
      },
      title: {
        type: 'string',
        nullable: false,
      },
    },
  },
};

const changePost = {
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
      addCategories: {
        type: 'array',
        items: {type: 'string'},
        nullable: false,
      },
      deleteCategories: {
        type: 'array',
        items: {type: 'string'},
        nullable: false,
      },
      status: {
        type: 'string',
        enum: ['ACTIVE', 'INACTIVE'],
      },
      content: {
        type: 'string',
      },
    },
  },
};

const likePost = {
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
    required: ['type'],
    properties: {
      type: {
        type: 'string',
        enum: ['LIKE', 'DISLIKE'],
      },
    },
  },
};

const commentPost = {
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
    required: ['content'],
    properties: {
      content: {
        type: 'string',
      },
    },
  },
};
export const postSchema = {
  getPost,
  createPost,
  changePost,
  likePost,
  commentPost,
};
