import { MongoClient, Db } from 'mongodb';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
const mongoDbName = process.env.MONGO_DB || 'turbineops';

let mongoClient: MongoClient | null = null;
let db: Db | null = null;

export const connectMongo = async () => {
  try {
    mongoClient = new MongoClient(mongoUrl);
    await mongoClient.connect();
    db = mongoClient.db(mongoDbName);
    console.log('Mongo connected');
  } catch (e) {
    console.warn('Mongo unavailable yet:', (e as Error).message);
  }
};

export const getMongoDB = (): Db | null => db;

export const disconnectMongo = async () => {
  if (mongoClient) {
    await mongoClient.close();
  }
};
