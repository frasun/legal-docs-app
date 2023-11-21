import bcrypt from "bcryptjs";
import { kv } from "@vercel/kv";
import errors from "@utils/errors";
import mongodb from "@db/mongodb";
import { emailRegExp, passwordRegExp, testString } from "@utils/dataValidation";

export enum UserRoles {
  admin = "admin",
  user = "user",
}

interface User {
  email: string;
  password: string;
  created?: Date;
  role: UserRoles;
}

const userCollection = mongodb.collection<User>("users");
const getVerificationCode = () => Math.random().toString(16).substring(2, 8);

export async function getUserByEmail(email: string) {
  return await userCollection.findOne<User>({ email });
}

export async function createUser(email: string, password: string) {
  if (!testString(email, emailRegExp)) {
    throw new Error(errors.WRONG_EMAIL, { cause: 400 });
  }

  if (!testString(password, passwordRegExp)) {
    throw new Error(errors.UNSAFE_PASSWORD, { cause: 400 });
  }

  try {
    await userCollection.insertOne({
      email,
      password,
      created: new Date(),
      role: UserRoles.user,
    });

    await kv.del(`verify-${email}`);
  } catch (e) {
    throw e;
  }
}

export async function initAccountVerify(email: string, password: string) {
  if (!testString(email, emailRegExp)) {
    throw new Error(errors.WRONG_EMAIL, { cause: 400 });
  }

  if (!testString(password, passwordRegExp)) {
    throw new Error(errors.UNSAFE_PASSWORD, { cause: 400 });
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
