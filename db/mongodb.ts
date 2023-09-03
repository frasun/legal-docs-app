import { MongoClient } from "mongodb";

const client = new MongoClient(import.meta.env.MONGODB_URI);
const database = client.db("admin");

export default database;
