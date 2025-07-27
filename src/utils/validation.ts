import { z } from "astro:schema";
import { validatePolish } from "validate-polish";
import trimWhitespace from "@utils/whitespace";
import { trimString } from "@utils/whitespace";
import { entityEnum, paymentMethodEnum } from "@utils/constants";
import errors from "@utils/errors";

export const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegExp = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,20}$/;
export const testString = (string: string, regexp: RegExp) =>
	regexp.test(string);
const postalCodeRegExp = new RegExp("^[0-9]{2}-[0-9]{3}$");

const testAccountNumber = (ac: string) => {
	const value = trimString(ac);

	if (value.length != 26) {
		return false;
	}

	const countryCode = 2521;
	const checkSum = value.substring(0, 2);
	const accountNumber = value.substring(2);
	const reversedDigits = `${accountNumber}${countryCode}${checkSum}`;

	return BigInt(reversedDigits) % 97n === 1n;
};

export const isEmail = (val: string) =>
	z.string().email().safeParse(val).success;

export const testPassword = (val: string) =>
	z
		.string()
		.refine((val) => testString(val, passwordRegExp))
		.safeParse(val).success;

export const personalPin = z
	.string()
	.transform((val) => val.toString())
	.refine((val) => val.length, errors.ANSWER_REQUIRED)
	.refine(
		(val) => (val.length ? validatePolish.pesel(val) : true),
		errors.ANSWER_WRONG_FORMAT
	);

export const companyPin = z
	.string()
	.transform((val) => val.toString())
	.refine((val) => val.length, errors.ANSWER_REQUIRED)
	.refine(
		(val) => (val.length ? validatePolish.nip(val) : true),
		errors.ANSWER_WRONG_FORMAT
	);

export const zipCode = z
	.string()
	.refine((val) => val.length, errors.ANSWER_REQUIRED)
	.refine(
		(val) => (val.length ? postalCodeRegExp.test(val) : true),
		errors.ANSWER_WRONG_FORMAT
	);

export const accountNumber = z
	.string()
	.or(z.number())
	.transform((val) => val.toString())
	.refine((val) => testAccountNumber(val), errors.ANSWER_WRONG_FORMAT);

export const notEmptyString = z
	.string()
	.transform((val) => trimWhitespace(val.toString()))
	.refine((val) => val.length, errors.ANSWER_REQUIRED);

export const stringOrEmpty = z
	.string()
	.transform((val) => (val.toString().length ? val : undefined))
	.refine((val) => (val ? trimWhitespace(val.toString()).length > 0 : true));

export const optionalString = z
	.string()
	.or(z.number())
	.transform((val) => trimWhitespace(val.toString()));

export const positiveNumber = z
	.number()
	.or(z.string().transform((val) => parseInt(val)))
	.refine((val) => val >= 0, errors.ANSWER_WRONG_FORMAT);

export const positiveFloat = z
	.number()
	.or(z.string().transform((val) => parseFloat(val)))
	.refine((val) => val > 0, errors.ANSWER_WRONG_FORMAT);

export const days = z
	.number()
	.or(z.string().transform((val) => parseInt(val)))
	.refine((val) => val > 1, errors.ANSWER_WRONG_FORMAT);

export const date = z
	.string()
	.or(z.date())
	.transform((val) => new Date(val).toISOString())
	.refine(
		(val) => z.coerce.date().safeParse(val).success,
		errors.ANSWER_WRONG_FORMAT
	);

function validateEnum(val: string[], array: Readonly<string[]>) {
	return val.every((el) => array.includes(el));
}

export const stringEnum = (array: Readonly<string[]>) =>
	z
		.array(z.string())
		.refine((val) => validateEnum(val, array), errors.ANSWER_WRONG_FORMAT);

export const requiredEnum = (array: Readonly<string[]>) =>
	z
		.array(z.string())
		.nonempty()
		.refine((val) => validateEnum(val, array), errors.ANSWER_WRONG_FORMAT);

export const address = z.object({
	street: notEmptyString,
	apt: optionalString,
	postalCode: zipCode,
	city: notEmptyString,
});

export const payment = z.object({
	value: positiveFloat,
	method: z.enum(paymentMethodEnum),
	due: days,
});

const iSchema = {
	name: notEmptyString,
	street: notEmptyString,
	apt: optionalString,
	postalCode: zipCode,
	city: notEmptyString,
	bankAccount: accountNumber.optional(),
};

export const personalSchema = z.object({
	type: z.literal(entityEnum.PERSONAL),
	pin: personalPin,
	...iSchema,
});

export const companySchema = z.object({
	type: z.literal(entityEnum.COMPANY),
	pin: companyPin,
	...iSchema,
});

export const identitySchema = z.discriminatedUnion("type", [
	personalSchema,
	companySchema,
]);

export const draftIdentitySchema = z.object({
	type: z.nativeEnum(entityEnum),
	pin: personalPin.or(companyPin).or(z.literal("")),
	name: optionalString,
	street: optionalString,
	apt: optionalString,
	postalCode: zipCode.or(z.literal("")),
	city: optionalString,
	bankAccount: accountNumber.or(z.literal("")).optional(),
});
