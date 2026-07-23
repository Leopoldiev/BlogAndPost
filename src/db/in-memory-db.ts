export const db = {
  blogs: [
    {
      id: '1',
      name: 'JavaScript',
      description: 'Computer Science',
      websiteUrl: 'https://learnjavascript.ru',
    },
    {
      id: '2',
      name: 'Pancakes',
      description: 'Cooking',
      websiteUrl: 'https://cookies.ru',
    },
  ],
  posts: [
    {
      id: '1',
      title: 'Data types in JavaScript',
      shortDescription: 'Simple and complex types',
      content:
        'number ,string, boolean, null ,undefined, bigint symbol, object',
      blogId: '1',
      blogName: 'JavaScript',
    },
    {
      id: '2',
      title: 'How to cook pancake',
      shortDescription: 'Chocolate pancake cooking',
      content: '2 pieces of butter ...',
      blogId: '2',
      blogName: 'Cooking',
    },
  ],
};
