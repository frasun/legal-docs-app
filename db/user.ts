import bcrypt from "bcryptjs";
import { kv } from "@vercel/kv";
import errors from "@utils/errors";
import mongodb from "@db/mongodb";
import { emailRegExp, passwordRegExp, testString } from "@utils/dataValidation";
import { UUID } from "mongodb";

export enum UserRoles {
  admin = "admin",
  user = "user",
}

export interface User {
  email: string;
  password: string;
  created?: Date;
  modified?: Date;
  role: UserRoles;
  deleted?: boolean;
}

const userCollection = mongodb.collection<User>("users");
const getVerificationCode = () => Math.random().toString(16).substring(2, 8);

export async function getUserByEmail(email: string) {
  return await userCollection.findOne<User>({
    email,
    deleted: undefined,
  });
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
  try {
    if (!testString(email, emailRegExp)) {
      throw new Error(errors.WRONG_EMAIL, { cause: 400 });
    }

    if (!testString(password, passwordRegExp)) {
      throw new Error(errors.UNSAFE_PASSWORD, { cause: 400 });
    }

    const code = getVerificationCode();

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

export async function initPasswordReset(email: string) {
  if (!testString(email, emailRegExp)) {
    throw new Error(errors.WRONG_EMAIL, { cause: 400 });
  }

  const code = getVerificationCode();
  const key = `reset-${email}`;

  try {
    await kv.hset(key, {
      email,
      code,
      rateLimit: 0,
    });
    await kv.expire(key, 600);

    return code;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function passwordResetInProgress(email: string | null) {
  try {
    return await kv.exists(`reset-${email}`);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getpasswordResetCode(
  email: string
): Promise<{ code: string; rateLimit: number }> {
  try {
    return (await kv.hgetall(`reset-${email}`)) as {
      code: string;
      rateLimit: number;
    };
  } catch (e) {
    throw e;
  }
}

export async function changePassword(
  email: string,
  password: string
): Promise<number> {
  try {
    if (!testString(email, emailRegExp)) {
      throw new Error(errors.WRONG_EMAIL, { cause: 400 });
    }

    if (!testString(password, passwordRegExp)) {
      throw new Error(errors.UNSAFE_PASSWORD, { cause: 400 });
    }

    const updated = await userCollection.updateOne(
      { email },
      {
        $set: { password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) },
        $currentDate: { modified: true },
      }
    );

    return updated.modifiedCount;
  } catch (e) {
    throw e;
  }
}

export async function wrongPasswordCode(email: string, rateLimit: number) {
  try {
    if (rateLimit > 2) {
      await kv.del(`reset-${email}`);
    } else {
      await kv.hset(`reset-${email}`, { rateLimit });
    }
  } catch (e) {
    throw e;
  }
}

export async function deleteUserAccount(userId: string): Promise<number> {
  try {
    const updated = await userCollection.deleteOne({
      _id: new UUID(userId).toBinary(),
    });

    return updated.deletedCount;
  } catch (e) {
    throw e;
  }
}
