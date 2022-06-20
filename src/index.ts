import {
  Collection,
  CreateIndexesOptions,
  Db as MongoDb,
  IndexSpecification,
  MongoClient,
} from 'mongodb';
import debug from 'debug';

export * from './schema';

const log = debug('@draught/db');
const root = global as unknown as { db?: { client: MongoClient } };

export type DbConfig<Schema> = {
  url?: string;
  appName: string;
  databaseName: string;
  syncIndexesOnConnect?: boolean;
  indexes?: {
    [P in keyof Schema]?: Record<
      string,
      [IndexSpecification, CreateIndexesOptions]
    >;
  };
};

type Db<Schema> = MongoDb & { [P in keyof Schema]: Collection<Schema[P]> };

export default function initializeDatabase<Schema>(
  config: DbConfig<Schema>
): Db<Schema> {
  let client: MongoClient | undefined = root.db?.client;

  if (!client) {
    root.db = {
      client: new MongoClient(config.url ?? 'mongodb://localhost', {
        appName: config.appName,
      }),
    };
    client = root.db.client;

    void client.connect().then(async () => {
      log('connected');

      if (config.syncIndexesOnConnect) {
        let collections = await db.collections();
        // For each collection, sync it's indexes
        for (let collectionName in config.indexes) {
          let collectionIndexConfig = config.indexes[collectionName];

          if (collectionIndexConfig) {
            // Create missing collections so we can create their indexes
            if (!collections.find(c => c.collectionName === collectionName)) {
              log(`pre-creating ${collectionName} collection to build indexes`);
              await db.createCollection(collectionName);
            }

            // Find missing indexes
            for (let indexName in collectionIndexConfig) {
              let exists = await db
                .collection(collectionName)
                .indexExists(indexName);
              if (!exists) {
                let [spec, options] = collectionIndexConfig[indexName];
                log(
                  `creating missing index: ${collectionName}.${indexName}: ${JSON.stringify(
                    spec
                  )}`
                );
                void db.collection(collectionName).createIndex(spec, {
                  name: indexName,
                  ...options,
                });
              }
            }
          }

          // Remove extraneous / obsolete indexes
          let existingIndexes = await db.collection(collectionName).indexes();
          existingIndexes.forEach(indexDoc => {
            let name = indexDoc.name as string;
            if (
              !collectionIndexConfig ||
              (!collectionIndexConfig[name] && name !== '_id_')
            ) {
              log(`dropping obsolete index: ${collectionName}.${name}`);
              void db.collection(collectionName).dropIndex(name);
            }
          });
        }
      }
    });
  }

  const db = new Proxy(client.db(config.databaseName), {
    get(originalDb, maybeCollectionName) {
      if (
        typeof maybeCollectionName === 'symbol' ||
        maybeCollectionName in originalDb
      ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return (originalDb as any)[maybeCollectionName];
      }
      return originalDb.collection(maybeCollectionName);
    },
  }) as Db<Schema>;

  return db;
}
