import { db } from "@db/db";
import bcrypt from "bcryptjs";
import errors from "@utils/errors";

const KEY = "user";
const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegExp = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,20}$/;

export const getUserByEmail = async (email: string) => {
  const user = await db
    .selectFrom(KEY)
    .selectAll()
    .where("email", "=", email)
    .executeTakeFirst();

  return user || null;
};

export const createUser = async (email: string, password: string) => {
  if (!testString(email, emailRegExp)) {
    throw new Error(errors.WRONG_EMAIL);
  }

  if (!testString(password, passwordRegExp)) {
    throw new Error(errors.UNSAFE_PASSWORD);
  }

  try {
    return await db
      .insertInto(KEY)
      .values([
        {
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
          code: getVerificationCode(),
        },
      ])
      .returning(["id", "email", "code"])
      .executeTakeFirst();
  } catch (e) {
    throw e;
  }
};

export const activateUser = async (id: string) => {
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

export const sendCode = async (id: string) => {
  try {
    return await db
      .updateTable(KEY)
      .set({ code: getVerificationCode() })
      .where("id", "=", id)
      .returning(["code"])
      .executeTakeFirst();
  } catch (e: any) {
    throw e;
  }
};

const getVerificationCode = () => Math.random().toString(16).substring(2, 8);

const testString = (string: string, regexp: RegExp) => regexp.test(string);
