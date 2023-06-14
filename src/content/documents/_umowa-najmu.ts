import { z } from "astro:content";

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
  "opłata za internet",
  "opłata telewizyjna",
] as const;

export default z.object({
  address: z.string().nonempty(),
  apt: z.string().nonempty(),
  area: z.z
    .string()
    .nonempty()
    .or(z.number())
    .transform((val) => parseFloat(String(val)))
    .refine((val) => val > 0),
  room: z
    .string()
    .nonempty()
    .or(z.number())
    .transform((val) => parseInt(String(val)))
    .refine((val) => val >= 0),
  kitchen: z
    .string()
    .nonempty()
    .or(z.number())
    .transform((val) => parseInt(String(val)))
    .refine((val) => val >= 0),
  hall: z
    .string()
    .nonempty()
    .or(z.number())
    .transform((val) => parseInt(String(val)))
    .refine((val) => val >= 0),
  bathroom: z
    .string()
    .nonempty()
    .or(z.number())
    .transform((val) => parseInt(String(val)))
    .refine((val) => val >= 0),
  toilet: z
    .string()
    .nonempty()
    .or(z.number())
    .transform((val) => parseInt(String(val)))
    .refine((val) => val >= 0),
  wardrobe: z
    .string()
    .nonempty()
    .or(z.number())
    .transform((val) => parseInt(String(val)))
    .refine((val) => val >= 0),
  garage: z
    .string()
    .nonempty()
    .or(z.number())
    .transform((val) => parseInt(String(val)))
    .refine((val) => val >= 0),
  systems: z
    .string()
    .nonempty()
    .refine((val) => validateEnum(val, [...systemsEnum, EMPTY])),
  equipment: z.string(),
  purpose: z
    .string()
    .nonempty()
    .refine((val) => validateEnum(val, purposeEnum)),
  rent: z
    .string()
    .nonempty()
    .or(z.number())
    .transform((val) => parseFloat(String(val)))
    .refine((val) => val > 0),
  rentmethod: z.enum(paymentMethodEnum),
  rentdue: z
    .string()
    .nonempty()
    .or(z.number())
    .transform((val) => parseInt(String(val)))
    .refine((val) => val > 1),
  billslandlord: z
    .string()
    .nonempty()
    .refine((val) => validateEnum(val, [...billsEnum, EMPTY])),
  billstenant: z
    .string()
    .nonempty()
    .refine((val) => validateEnum(val, [...billsEnum, EMPTY])),
  deposit: z
    .string()
    .nonempty()
    .or(z.number())
    .transform((val) => parseFloat(String(val)))
    .refine((val) => val > 0),
  depositmethod: z.enum(paymentMethodEnum),
  repairs: z
    .string()
    .nonempty()
    .or(z.number())
    .transform((val) => parseFloat(String(val)))
    .refine((val) => val > 0),
  termination: z
    .string()
    .nonempty()
    .or(z.number())
    .transform((val) => parseInt(String(val)))
    .refine((val) => val > 1),
  return: z
    .string()
    .nonempty()
    .or(z.number())
    .transform((val) => parseInt(String(val)))
    .refine((val) => val > 1),
  start: z
    .string()
    .nonempty()
    .transform((val) => new Date(val).toISOString())
    .refine((val) => z.coerce.date().safeParse(val).success),
  "l-data": z
    .string()
    .nonempty()
    .or(z.number())
    .transform((val) => parseInt(String(val)))
    .refine((val) => validateDataType(val)),
  "l-type": z.enum(entityEnum),
  "l-name": z.string(),
  "l-address": z.string(),
  "l-pin": z.string(),
  "t-data": z
    .string()
    .nonempty()
    .or(z.number())
    .transform((val) => parseInt(String(val)))
    .refine((val) => validateDataType(val)),
  "t-type": z.enum(entityEnum),
  "t-name": z.string(),
  "t-address": z.string(),
  "t-pin": z.string(),
});

function validateDataType(val) {
  return [0, 1, 2].includes(val);
}

function validateEnum(val, array) {
  const arr = val.split(", ");
  return arr.every((el) => array.includes(el));
}
