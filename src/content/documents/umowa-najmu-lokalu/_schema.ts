import { z } from "astro:content";
import { entityEnum, paymentMethodEnum, EMPTY } from "@utils/constants";
import * as validators from "@utils/dataValidation";

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

export const street = validators.notEmptyString;
export const apt = validators.notEmptyStringOrNumber;
export const postalCode = validators.zipCode("postalCode", true);
export const city = validators.notEmptyString;
export const area = validators.positiveFloat;
export const room = validators.positiveNumber;
export const kitchen = validators.positiveNumber;
export const hall = validators.positiveNumber;
export const bathroom = validators.positiveNumber;
export const toilet = validators.positiveNumber;
export const balcony = validators.positiveNumber;
export const wardrobe = validators.positiveNumber;
export const garage = validators.positiveNumber;
export const systems = validators.stringEnum([...systemsEnum, EMPTY]);
export const equipment = z.string();
export const purpose = validators.stringEnum(purposeEnum);
export const rent = validators.positiveFloat;
export const rentMethod = z.enum(paymentMethodEnum);
export const rentdue = validators.days;
export const billsLandlord = validators.stringEnum([...billsEnum, EMPTY]);
export const billsTenant = validators.stringEnum([...billsEnum, EMPTY]);
export const deposit = validators.positiveFloat;
export const depositMethod = z.enum(paymentMethodEnum);
export const repairs = validators.positiveFloat;
export const termination = validators.days;
export const returnTime = validators.days;
export const start = z
  .string()
  .nonempty()
  .transform((val) => new Date(val).toISOString())
  .refine((val) => z.coerce.date().safeParse(val).success);
export const landlordType = z.enum(entityEnum);
export const landlordPersonName = validators.trimmedString;
export const landlordPersonStreet = validators.trimmedString;
export const landlordPersonApt = validators.notEmptyStringOrNumber;
export const landlordPersonPostalCode = validators.zipCode(
  "landlordPersonPostalCode"
);
export const landlordPersonCity = validators.trimmedString;
export const landlordPersonPin = validators.personalPin("landlordPersonPin");
export const landlordCompanyName = validators.trimmedString;
export const landlordCompanyPin = validators.companyPin("landlordCompanyPin");
export const landlordCompanyStreet = validators.trimmedString;
export const landlordCompanyApt = validators.notEmptyStringOrNumber;
export const landlordCompanyPostalCode = validators.zipCode(
  "landlordCompanyPostalCode"
);
export const landlordCompanyCity = validators.trimmedString;
export const tenantType = z.enum(entityEnum);
export const tenantPersonName = validators.trimmedString;
export const tenantPersonStreet = validators.trimmedString;
export const tenantPersonApt = validators.notEmptyStringOrNumber;
export const tenantPersonPostalCode = validators.zipCode(
  "tenantPersonPostalCode"
);
export const tenantPersonCity = validators.trimmedString;
export const tenantPersonPin = validators.personalPin("tenantPersonPin");
export const tenantCompanyName = validators.trimmedString;
export const tenantCompanyStreet = validators.trimmedString;
export const tenantCompanyApt = validators.notEmptyStringOrNumber;
export const tenantCompanyPostalCode = validators.zipCode(
  "tenantCompanyPostalCode"
);
export const tenantCompanyCity = validators.trimmedString;
export const tenantCompanyPin = validators.companyPin("tenantCompanyPin");

export default z.object({
  street,
  apt,
  postalCode,
  city,
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
  landlordType,
  landlordPersonName,
  landlordPersonStreet,
  landlordPersonApt,
  landlordPersonPostalCode,
  landlordPersonCity,
  landlordPersonPin,
  landlordCompanyName,
  landlordCompanyStreet,
  landlordCompanyApt,
  landlordCompanyPostalCode,
  landlordCompanyCity,
  landlordCompanyPin,
  tenantType,
  tenantPersonName,
  tenantPersonStreet,
  tenantPersonApt,
  tenantPersonPostalCode,
  tenantPersonCity,
  tenantPersonPin,
  tenantCompanyName,
  tenantCompanyStreet,
  tenantCompanyApt,
  tenantCompanyPostalCode,
  tenantCompanyCity,
  tenantCompanyPin,
});
