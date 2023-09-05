import { ObjectId } from "mongodb";

export default function isObjectId(str: string) {
  try {
    const objectId = new ObjectId(str);
    return objectId.toHexString() === str;
  } catch (error) {
    return false;
  }
}
