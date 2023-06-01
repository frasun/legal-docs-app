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

export const createUser = async (email, password) =>
  await db
    .insertInto(KEY)
    .values([{ email, password, code: getVerificationCode() }])
    .returning(["id", "email"])
    .executeTakeFirst();

export const activateUser = async (id) => {
  try {
    return await db
      .updateTable(KEY)
      .set({ active: true })
      .where("id", "=", id)
      .execute();
  } catch (e: any) {
    throw e;
  }
};

export const resendCode = async (id) => {
  try {
    return await db
      .updateTable(KEY)
      .set({ code: getVerificationCode() })
      .where("id", "=", id)
      .execute();
  } catch (e: any) {
    throw e;
  }
};

const getVerificationCode = () => Math.random().toString(16).substring(2, 8);
