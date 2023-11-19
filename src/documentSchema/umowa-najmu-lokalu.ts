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
export const postalCode = validators.zipCode(true);
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
export const equipment = validators.trimmedString;
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
export const start = validators.date;
export const contractDate = validators.date;
export const landlordType = z.enum(entityEnum);
export const landlordPersonName = validators.trimmedStringOrNumber;
export const landlordPersonStreet = validators.trimmedStringOrNumber;
export const landlordPersonApt = validators.trimmedStringOrNumber;
export const landlordPersonPostalCode = validators.zipCode();
export const landlordPersonCity = validators.trimmedStringOrNumber;
export const landlordPersonPin = validators.personalPin();
export const landlordCompanyName = validators.trimmedStringOrNumber;
export const landlordCompanyPin = validators.companyPin();
export const landlordCompanyStreet = validators.trimmedStringOrNumber;
export const landlordCompanyApt = validators.trimmedStringOrNumber;
export const landlordCompanyPostalCode = validators.zipCode();
export const landlordCompanyCity = validators.trimmedStringOrNumber;
export const tenantType = z.enum(entityEnum);
export const tenantPersonName = validators.trimmedStringOrNumber;
export const tenantPersonStreet = validators.trimmedStringOrNumber;
export const tenantPersonApt = validators.trimmedStringOrNumber;
export const tenantPersonPostalCode = validators.zipCode();
export const tenantPersonCity = validators.trimmedStringOrNumber;
export const tenantPersonPin = validators.personalPin();
export const tenantCompanyName = validators.trimmedStringOrNumber;
export const tenantCompanyStreet = validators.trimmedStringOrNumber;
export const tenantCompanyApt = validators.trimmedStringOrNumber;
export const tenantCompanyPostalCode = validators.zipCode();
export const tenantCompanyCity = validators.trimmedStringOrNumber;
export const tenantCompanyPin = validators.companyPin();

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
  contractDate,
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
