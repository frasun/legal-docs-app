import { db } from "./db";

const KEY = "user";

export const getUserByEmail = async (email: string) => {
  const user = await db
    .selectFrom(KEY)
    .selectAll()
    .where("email", "=", email)
    .executeTakeFirst();

  return user || null;
};

export const createUser = async (email, password) => {
  return await db
    .insertInto(KEY)
    .values([{ email, password }])
    .returning(["id", "email"])
    .execute();
};
