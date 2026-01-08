import { Hono } from 'hono';
import { getRouterName } from 'hono/dev';

const authors = [
  {
    id: 1,
    name: 'F. Scott Fitzgerald',
    bio: 'American novelist and short story writer, widely regarded as one of the greatest American writers of the 20th century.',
  },
  {
    id: 2,
    name: 'Harper Lee',
    bio: 'American novelist best known for her 1960 novel To Kill a Mockingbird, which won the Pulitzer Prize.',
  },
  {
    id: 3,
    name: 'George Orwell',
    bio: 'English novelist, essayist, journalist and critic, known for his lucid prose and opposition to totalitarianism.',
  },
  {
    id: 4,
    name: 'Jane Austen',
    bio: 'English novelist known primarily for her six major novels, which interpret, critique and comment upon the British landed gentry at the end of the 18th century.',
  },
  {
    id: 5,
    name: 'J. D. Salinger',
    bio: 'American writer known for his widely read novel The Catcher in the Rye, as well as his reclusive nature.',
  },
];

const app = new Hono().basePath('/authors');

app.get('/', (c) => {
  return c.json(authors);
});

app.get('/:id', (c) => {
  const id = c.req.param('id');
  const author = authors.find((a) => a.id === Number(id));
  if (!author) {
    return c.notFound();
  } else {
    return c.json(author);
  }
});

app.get('/posts/:id/comment/:comment_id', async (c) => {
  const { id, comment_id } = c.req.param();
  // ...
});

console.log(getRouterName(app));

export default app;
