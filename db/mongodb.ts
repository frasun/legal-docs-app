import { MongoClient } from "mongodb";

const client = new MongoClient(import.meta.env.MONGODB_URI);
// const database = client.db("prawniczek");
const database = client.db(import.meta.env.MONGODB_DBNAME);

export default database;
