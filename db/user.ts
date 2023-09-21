import bcrypt from "bcryptjs";
import { kv } from "@vercel/kv";
import errors from "@utils/errors";
import mongodb from "@db/mongodb";

interface User {
  email: string;
  password: string;
  created?: Date;
}

const userCollection = mongodb.collection<User>("users");
export const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegExp = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,20}$/;
const getVerificationCode = () => Math.random().toString(16).substring(2, 8);
export const testString = (string: string, regexp: RegExp) =>
  regexp.test(string);

export async function getUserByEmail(email: string) {
  return await userCollection.findOne<User>({ email });
}

export async function createUser(email: string, password: string) {
  if (!testString(email, emailRegExp)) {
    throw new Error(errors.WRONG_EMAIL);
  }

  if (!testString(password, passwordRegExp)) {
    throw new Error(errors.UNSAFE_PASSWORD);
  }

  try {
    await userCollection.insertOne({
      email,
      password,
      created: new Date(),
    });

    await kv.del(`verify-${email}`);
  } catch (e) {
    throw e;
  }
}

export async function initAccountVerify(email: string, password: string) {
  if (!testString(email, emailRegExp)) {
    throw new Error(errors.WRONG_EMAIL);
  }

  if (!testString(password, passwordRegExp)) {
    throw new Error(errors.UNSAFE_PASSWORD);
  }

  const code = getVerificationCode();

  try {
    await kv.hset(`verify-${email}`, {
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
      code,
      rateLimit: 0,
    });
    await kv.expire(`verify-${email}`, 600);

    return code;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function verificationInProgress(email: string) {
  try {
    return await kv.exists(`verify-${email}`);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getVerificationData(email: string) {
  try {
    return await kv.hgetall(`verify-${email}`);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function wrongVerificationCode(email: string, rateLimit: number) {
  try {
    if (rateLimit > 2) {
      await kv.del(`verify-${email}`);
    } else {
      await kv.hset(`verify-${email}`, { rateLimit });
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
}
