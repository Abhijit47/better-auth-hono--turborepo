import { Hono } from 'hono';

import { zValidator } from '@hono/zod-validator';
import { auth } from '@workspace/auth/server';
import { bookSchema } from '@workspace/zod-schemas/book-schemas';

const book = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>().basePath('/books');

const books = [
  {
    id: 1,
    title: 'The Great Gatsby',
    description: 'A novel written by American author F. Scott Fitzgerald.',
    author: 'F. Scott Fitzgerald',
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    description:
      'A novel by Harper Lee published in 1960, instantly successful in the United States.',
    author: 'Harper Lee',
  },
  {
    id: 3,
    title: '1984',
    description:
      'A dystopian social science fiction novel and cautionary tale, written by the English writer George Orwell.',
    author: 'George Orwell',
  },
  {
    id: 4,
    title: 'Pride and Prejudice',
    description: 'A romantic novel of manners written by Jane Austen in 1813.',
    author: 'Jane Austen',
  },
  {
    id: 5,
    title: 'The Catcher in the Rye',
    description:
      'A novel by J. D. Salinger, partially published in serial form in 1945–1946.',
    author: 'J. D. Salinger',
  },
];

async function sleep() {
  // Simulate a delay dynamically between 100ms to 500ms
  const delay = Math.floor(Math.random() * 400) + 100;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

// Middleware to check authentication
book.use('*', async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    c.set('user', null);
    c.set('session', null);
    await next();
    return;
  }
  c.set('user', session.user);
  c.set('session', session.session);
  await next();
});

book.get('/', async (c) => {
  await sleep();
  const session = c.get('session');
  const user = c.get('user');

  if (!session || !user)
    return c.json(
      {
        status: 'error',
        message: 'You must be logged in to access this resource.',
      },
      401
    );

  return c.json(books);
});

book.post('/new', zValidator('json', bookSchema), (c) => {
  // await sleep();
  const session = c.get('session');
  const user = c.get('user');

  if (!session || !user)
    return c.json(
      {
        status: 'error',
        message: 'You must be logged in to access this resource.',
      },
      401
    );

  const validated = c.req.valid('json');
  console.log('Validated data:', validated);

  // const { title, description, author } = c.req.valid('form');
  // console.log('req.body:', await c.req.json());

  const newBook = {
    id: books.length + 1,
    title: 'Unknown Title',
    description: 'Unknown Description',
    author: 'Unknown Author',
  };
  books.push(newBook);
  return c.json(newBook, 201);
});

book.get('/:id', async (c) => {
  await sleep();
  const id = Number(c.req.param('id'));
  const book = books.find((b) => b.id === id);
  if (book) {
    return c.json(book);
  } else {
    return c.notFound();
  }
});

book.put('/:id', async (c) => {
  await sleep();
  const id = Number(c.req.param('id'));
  const updatedBook = await c.req.json();
  const index = books.findIndex((b) => b.id === id);
  if (index !== -1) {
    books[index] = { id, ...updatedBook };
    return c.json(books[index]);
  } else {
    return c.notFound();
  }
});

book.delete('/:id', async (c) => {
  await sleep();
  const id = Number(c.req.param('id'));
  const index = books.findIndex((b) => b.id === id);
  if (index !== -1) {
    books.splice(index, 1);
    return c.json({ message: 'Book deleted' });
  } else {
    return c.notFound();
  }
});

export default book;
