import { z } from "astro:content";
import { validatePolish } from "validate-polish";
import trimWhitespace from "@utils/whitespace";

export const personalPin = (required = false) =>
  z
    .string()
    .or(z.number())
    .transform((val) => val.toString())
    .refine(
      (val) => (required || val.length ? validatePolish.pesel(val) : true),
      {
        message: "Podaj prawidłowy numer PESEL",
      }
    );

export const companyPin = (required = false) =>
  z
    .string()
    .or(z.number())
    .transform((val) => val.toString())
    .refine(
      (val) => (required || val.length ? validatePolish.nip(val) : true),
      {
        message: "Podaj prawidłowy numer NIP",
      }
    );

const postalCodeRegExp = new RegExp("^[0-9]{2}-[0-9]{3}$");
export const zipCode = (required: boolean = false) =>
  z
    .string()
    .refine(
      (val) => (required || val.length ? postalCodeRegExp.test(val) : true),
      {
        message: "Podaj prawidłowy kod pocztowy",
      }
    );

export const notEmptyString = z
  .string()
  .nonempty()
  .transform((val) => trimWhitespace(val));

export const notEmptyStringOrNumber = z
  .string()
  .nonempty()
  .or(z.number())
  .transform((val) => trimWhitespace(val.toString()));

export const trimmedString = z.string().transform((val) => trimWhitespace(val));
export const trimmedStringOrNumber = z
  .string()
  .or(z.number())
  .transform((val) => trimWhitespace(val.toString()));

export const positiveNumber = z
  .string()
  .nonempty()
  .or(z.number())
  .transform((val) => parseInt(String(val)))
  .refine((val) => val >= 0);

export const positiveFloat = z
  .string()
  .nonempty()
  .or(z.number())
  .transform((val) => parseFloat(String(val)))
  .refine((val) => val > 0);

export const days = z
  .string()
  .nonempty()
  .or(z.number())
  .transform((val) => parseInt(String(val)))
  .refine((val) => val > 1);

function validateEnum(val: string, array: Readonly<string[]>) {
  const arr = val.split(", ");
  return arr.every((el) => array.includes(el));
}

export const stringEnum = (array: Readonly<string[]>) =>
  z
    .string()
    .nonempty()
    .refine((val) => validateEnum(val, array));

export const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegExp = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,20}$/;
export const testString = (string: string, regexp: RegExp) =>
  regexp.test(string);
