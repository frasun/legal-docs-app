import {
  MongoClient,
  ServerApiVersion,
  Binary,
  ClientEncryption,
  UUID,
} from "mongodb";

export const keyVaultNamespace = `${import.meta.env.MONGODB_KVNAME}.${
  import.meta.env.MONGODB_KVCOLL
}`;
export const kmsProviders = {
  local: {
    key: import.meta.env.MK,
  },
};

const ENCRYPTION_ALGORITHM = "AEAD_AES_256_CBC_HMAC_SHA_512-Random";

export const client = new MongoClient(import.meta.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  compressors: ["zlib"],
  autoEncryption: {
    keyVaultNamespace: `${import.meta.env.MONGODB_KVNAME}.${
      import.meta.env.MONGODB_KVCOLL
    }`,
    kmsProviders: {
      local: {
        key: import.meta.env.MK,
      },
    },
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

export async function encryptField(field: string) {
  const key = await getDataKey();

  if (key) {
    return await encryption.encrypt(field, {
      algorithm: ENCRYPTION_ALGORITHM,
      keyId: new Binary(Buffer.from(key, "base64"), 4),
    });
  }
}

const database = client.db(import.meta.env.MONGODB_DBNAME);

export default database;
