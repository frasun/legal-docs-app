import { MongoClient, ServerApiVersion } from "mongodb";

const client = new MongoClient(import.meta.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  compressors: ["zlib"],
});
const database = client.db(import.meta.env.MONGODB_DBNAME);

export default database;
