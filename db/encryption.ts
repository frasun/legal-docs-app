import { Binary, ClientEncryption, MongoClient } from "mongodb";

const client = new MongoClient(import.meta.env.MONGODB_KV_URI);
const keyVaultCollection = "__keyValut";
const encryption = new ClientEncryption(client, {
  keyVaultNamespace: `${import.meta.env.MONGODB_KVNAME}.${keyVaultCollection}`,
  kmsProviders: {
    local: {
      key: import.meta.env.MK,
    },
  },
});

export default encryption;

const ENCRYPTION_ALGORITHM = "AEAD_AES_256_CBC_HMAC_SHA_512-Random";

export async function encryptField(field: string) {
  const key = await dataKey();

  if (key) {
    return await encryption.encrypt(field, {
      algorithm: ENCRYPTION_ALGORITHM,
      keyId: new Binary(Buffer.from(key, "base64"), 4),
    });
  }
}

export const dataKey = async () => {
  const key = await encryption.getKeyByAltName(import.meta.env.DATA_KEY);

  return key ? key._id.toString("base64") : null;
};
