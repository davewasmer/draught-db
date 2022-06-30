import initializeDatabase from '../src';
import type { Id } from '@draught/utils';

describe('index', () => {
  describe('initializeDatabase', () => {
    it('connects to mongo', async () => {
      let db = initializeDatabase<{ posts: { _id: Id; title: string } }>({
        appName: 'draught-db-test',
        databaseName: 'draught_db_test',
      });

      let random = Math.random().toString();
      let id = `post_${random}` as Id;
      let title = `test ${random}`;

      await db.posts.insertOne({ _id: id, title });

      let lookup = await db.posts.findOne({ _id: `post_${random}` as Id });

      expect(lookup).toBeTruthy();
      expect(lookup!.title).toMatch(title);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      await (global as any).db.client.close();
    });
  });
});
