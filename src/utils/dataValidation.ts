import { z } from "astro:content";
import { validatePolish } from "validate-polish";

export const personalPin = (name: string) =>
  z
    .string()
    .or(z.number())
    .transform((val) => val.toString())
    .refine((val) => (val.length ? validatePolish.pesel(val) : true), {
      message: "Podaj prawidłowy numer PESEL",
      path: [name],
    });

export const companyPin = (name: string) =>
  z
    .string()
    .or(z.number())
    .transform((val) => val.toString())
    .refine((val) => (val.length ? validatePolish.nip(val) : true), {
      message: "Podaj prawidłowy numer NIP",
      path: [name],
    });
