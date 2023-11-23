import mongo, { encryptField, getDataKey } from "@db/mongodb";
import { entityEnum } from "@utils/constants";
import * as validators from "@utils/dataValidation";
import { z } from "astro:content";
import { UUID } from "mongodb";
import type { Identity, UserIdentity as UIdentity } from "@type";

type UserIdentity = Identity & { userId: string };

const identityCollection = mongo.collection<UserIdentity>("identities");

export async function createUserIdentity(data: UserIdentity) {
  const { userId, ...identity } = data;
  const personalData = identity.type === entityEnum[0];

  const identitySchema = getIdentitySchema(personalData);

  try {
    const validatedIdentity = identitySchema.parse(identity);
    const encryptedIdentity = await getEncryptedIdentity(validatedIdentity);

    return await identityCollection.insertOne({
      ...encryptedIdentity,
      type: validatedIdentity.type,
      userId,
    });
  } catch (e) {
    throw e;
  }
}

export async function getUserIdentities(
  userId: string,
  type?: (typeof entityEnum)[number]
) {
  let query;

  if (type) {
    query = { userId, type };
  } else {
    query = { userId };
  }

  const identities = await identityCollection
    .find<Identity>(query)
    .project({ _id: 1, name: 1, type: 1 });

  const identitiesArray = (await identities.toArray()) as UIdentity[];

  return identitiesArray.sort(({ name }, { name: nextName }) =>
    name.localeCompare(nextName, "pl")
  );
}

export async function getUserIdentitiesCount(userId: string) {
  return await identityCollection.countDocuments({
    userId: { $eq: userId },
  });
}

export async function getUserIdentity(identityId: string, userId: string) {
  return await identityCollection.findOne<Identity>(
    { _id: new UUID(identityId).toBinary(), userId },
    { projection: { userId: 0, _id: 0 } }
  );
}

export async function updateUserIdentity(
  identityId: string,
  userId: string,
  identity: Identity
) {
  const personalData = identity.type === entityEnum[0];
  const identitySchema = getIdentitySchema(personalData);

  try {
    const validatedIdentity = identitySchema.parse(identity);
    const encryptedIdentity = await getEncryptedIdentity(validatedIdentity);

    return await identityCollection.updateOne(
      { _id: new UUID(identityId).toBinary(), userId },
      {
        $set: { ...encryptedIdentity },
      }
    );
  } catch (e) {
    throw e;
  }
}

export async function deleteUserIdentity(identityId: string, userId: string) {
  try {
    return await identityCollection.deleteOne({
      _id: new UUID(identityId).toBinary(),
      userId,
    });
  } catch (e) {
    throw e;
  }
}

function getIdentitySchema(personalData: boolean) {
  return z.object({
    type: z.enum(entityEnum),
    name: validators.trimmedString.refine((val) => val.length, {
      message: personalData ? "Podaj imię i nazwisko" : "Podaj nazwę firmy",
    }),
    pin: personalData
      ? validators.personalPin(true)
      : validators.companyPin(true),
    street: validators.trimmedString.refine((val) => val.length, {
      message: "Podaj adres",
    }),
    apt: validators.trimmedStringOrNumber,
    postalCode: validators.zipCode(true),
    city: validators.trimmedString.refine((val) => val.length, {
      message: "Podaj miasto",
    }),
  });
}

async function getEncryptedIdentity(validatedIdentity: Identity) {
  let { type, ...encryptedIdentity } = validatedIdentity;

  const dataKey = await getDataKey();

  if (dataKey) {
    for (let [key, value] of Object.entries(encryptedIdentity)) {
      Object.assign(encryptedIdentity, {
        [key]: await encryptField(value, dataKey),
      });
    }
  }

  return encryptedIdentity;
}

export async function deleteUserIdentities(userId: string) {
  try {
    return await identityCollection.deleteMany({
      userId,
    });
  } catch (e) {
    throw e;
  }
}
