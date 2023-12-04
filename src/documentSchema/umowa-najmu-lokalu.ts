import { z } from "astro:content";
import * as validators from "@utils/validation";
import { draftIdentitySchema } from "@utils/validation";

export const systemsEnum = [
  "elektryczna",
  "gazowa",
  "centralne ogrzewanie",
  "kanalizacja",
  "klimatyzacja",
] as const;

export const purposeEnum = [
  "do celów mieszkalnych",
  "do prowadzenia działalności gospodarczej",
] as const;

export const billsEnum = [
  "zużycie energii",
  "zużycie gazu",
  "zużycie wody",
  "wywóz śmieci",
  "dostęp do internetu",
  "usługa telewizyjna",
] as const;

export const address = validators.address;
export const area = validators.positiveFloat;
export const rooms = z.object({
  room: validators.positiveNumber,
  kitchen: validators.positiveNumber,
  hall: validators.positiveNumber,
  bathroom: validators.positiveNumber,
  toilet: validators.positiveNumber,
  balcony: validators.positiveNumber,
  wardrobe: validators.positiveNumber,
  garage: validators.positiveNumber,
});
export const systems = validators.stringEnum(systemsEnum);
export const equipment = validators.optionalString;
export const purpose = validators.requiredEnum(purposeEnum);
export const rent = validators.payment;
export const bills = z.object({
  landlord: validators.stringEnum(billsEnum),
  tenant: validators.stringEnum(billsEnum),
});
export const deposit = validators.payment.omit({ due: true });
export const repairs = validators.positiveFloat;
export const termination = validators.days;
export const returnTime = validators.days;
export const start = validators.date;
export const contractDate = validators.date;
export const landlord = validators.identitySchema;
export const tenant = validators.identitySchema;

const schema = z.object({
  area,
  address,
  rooms,
  systems,
  equipment,
  purpose,
  rent,
  bills,
  deposit,
  repairs,
  termination,
  returnTime,
  start,
  contractDate,
  landlord,
  tenant,
});

export default schema;

export const draftSchema = schema
  .omit({ landlord: true, tenant: true })
  .catchall(draftIdentitySchema);
