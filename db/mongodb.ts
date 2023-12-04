import {
  MongoClient,
  ServerApiVersion,
  Binary,
  ClientEncryption,
  UUID,
} from "mongodb";

const keyVaultNamespace = `${import.meta.env.MONGODB_KVNAME}.${
  import.meta.env.MONGODB_KVCOLL
}`;
const kmsProviders = {
  local: {
    key: import.meta.env.MK,
  },
};

export const client = new MongoClient(import.meta.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  compressors: ["zlib"],
  autoEncryption: {
    keyVaultNamespace,
    kmsProviders,
    bypassAutoEncryption: true,
  },
  pkFactory: { createPk: () => new UUID().toBinary() },
});

export const encryption = new ClientEncryption(client, {
  keyVaultNamespace,
  kmsProviders,
});

export const getDataKey = async () => {
  const key = await encryption.getKeyByAltName(import.meta.env.DATA_KEY);

  return key ? key._id.toString("base64") : null;
};

const RANDOM_ENCRYPTION_ALGORITHM = "AEAD_AES_256_CBC_HMAC_SHA_512-Random";
const DETEMINISTIC_ENCRYPTION_ALGORITHM =
  "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic";

export async function encryptField(field: unknown, key: string, random = true) {
  return await encryption.encrypt(field, {
    algorithm: random
      ? RANDOM_ENCRYPTION_ALGORITHM
      : DETEMINISTIC_ENCRYPTION_ALGORITHM,
    keyId: new Binary(Buffer.from(key, "base64"), 4),
  });
}

const database = client.db(import.meta.env.MONGODB_DBNAME);
export default database;
