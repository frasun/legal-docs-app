import { z } from "astro:content";
import trimWhitespace from "@utils/whitespace";

export const entityEnum = ["osoba fizyczna", "firma"] as const;
export const paymentMethodEnum = [
  "przelewem na konto bankowe",
  "gotówką",
] as const;
export const systemsEnum = [
  "elektryczna",
  "gazowa",
  "centralne ogrzewanie",
  "kanalizacja",
  "klimatyzacja",
] as const;
export const EMPTY = "brak";
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

export const address = z
  .string()
  .nonempty()
  .transform((val) => trimWhitespace(val));

export const apt = z
  .string()
  .nonempty()
  .or(z.number())
  .transform((val) => trimWhitespace(val.toString()));

export const area = z
  .string()
  .nonempty()
  .or(z.number())
  .transform((val) => parseFloat(String(val)))
  .refine((val) => val > 0);

export const room = z
  .string()
  .nonempty()
  .or(z.number())
  .transform((val) => parseInt(String(val)))
  .refine((val) => val >= 0);

export const kitchen = z
  .string()
  .nonempty()
  .or(z.number())
  .transform((val) => parseInt(String(val)))
  .refine((val) => val >= 0);

export const hall = z
  .string()
  .nonempty()
  .or(z.number())
  .transform((val) => parseInt(String(val)))
  .refine((val) => val >= 0);

export const bathroom = z
  .string()
  .nonempty()
  .or(z.number())
  .transform((val) => parseInt(String(val)))
  .refine((val) => val >= 0);

export const toilet = z
  .string()
  .nonempty()
  .or(z.number())
  .transform((val) => parseInt(String(val)))
  .refine((val) => val >= 0);

export const balcony = z
  .string()
  .nonempty()
  .or(z.number())
  .transform((val) => parseInt(String(val)))
  .refine((val) => val >= 0);

export const wardrobe = z
  .string()
  .nonempty()
  .or(z.number())
  .transform((val) => parseInt(String(val)))
  .refine((val) => val >= 0);

export const garage = z
  .string()
  .nonempty()
  .or(z.number())
  .transform((val) => parseInt(String(val)))
  .refine((val) => val >= 0);

export const systems = z
  .string()
  .nonempty()
  .refine((val) => validateEnum(val, [...systemsEnum, EMPTY]));

export const equipment = z.string();

export const purpose = z
  .string()
  .nonempty()
  .refine((val) => validateEnum(val, purposeEnum));

export const rent = z
  .string()
  .nonempty()
  .or(z.number())
  .transform((val) => parseFloat(String(val)))
  .refine((val) => val > 0);

export const rentMethod = z.enum(paymentMethodEnum);

export const rentdue = z
  .string()
  .nonempty()
  .or(z.number())
  .transform((val) => parseInt(String(val)))
  .refine((val) => val > 1);

export const billsLandlord = z
  .string()
  .nonempty()
  .refine((val) => validateEnum(val, [...billsEnum, EMPTY]));

export const billsTenant = z
  .string()
  .nonempty()
  .refine((val) => validateEnum(val, [...billsEnum, EMPTY]));

export const deposit = z
  .string()
  .nonempty()
  .or(z.number())
  .transform((val) => parseFloat(String(val)))
  .refine((val) => val > 0);

export const depositMethod = z.enum(paymentMethodEnum);

export const repairs = z
  .string()
  .nonempty()
  .or(z.number())
  .transform((val) => parseFloat(String(val)))
  .refine((val) => val > 0);

export const termination = z
  .string()
  .nonempty()
  .or(z.number())
  .transform((val) => parseInt(String(val)))
  .refine((val) => val > 1);

export const returnTime = z
  .string()
  .nonempty()
  .or(z.number())
  .transform((val) => parseInt(String(val)))
  .refine((val) => val > 1);

export const start = z
  .string()
  .nonempty()
  .transform((val) => new Date(val).toISOString())
  .refine((val) => z.coerce.date().safeParse(val).success);

export const landlordData = z
  .string()
  .nonempty()
  .or(z.number())
  .transform((val) => parseInt(String(val)))
  .refine((val) => validateDataType(val));

export const landlordType = z.enum(entityEnum);

export const landlordName = z.string().transform((val) => trimWhitespace(val));

export const landlordAddress = z
  .string()
  .transform((val) => trimWhitespace(val));

export const landlordPin = z.string().transform((val) => trimWhitespace(val));

export const tenantData = z
  .string()
  .nonempty()
  .or(z.number())
  .transform((val) => parseInt(String(val)))
  .refine((val) => validateDataType(val));

export const tenantType = z.enum(entityEnum);

export const tenantName = z.string().transform((val) => trimWhitespace(val));

export const tenantAddress = z.string().transform((val) => trimWhitespace(val));

export const tenantPin = z.string().transform((val) => trimWhitespace(val));

export default z.object({
  address,
  apt,
  area,
  room,
  kitchen,
  hall,
  bathroom,
  toilet,
  balcony,
  wardrobe,
  garage,
  systems,
  equipment,
  purpose,
  rent,
  rentMethod,
  rentdue,
  billsLandlord,
  billsTenant,
  deposit,
  depositMethod,
  repairs,
  termination,
  returnTime,
  start,
  landlordData,
  landlordType,
  landlordName,
  landlordAddress,
  landlordPin,
  tenantData,
  tenantType,
  tenantName,
  tenantAddress,
  tenantPin,
});

function validateDataType(val: number) {
  return [0, 1, 2].includes(val);
}

function validateEnum(val: string, array: Readonly<string[]>) {
  const arr = val.split(", ");
  return arr.every((el) => array.includes(el));
}
