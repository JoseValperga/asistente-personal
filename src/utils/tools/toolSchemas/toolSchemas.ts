import { z } from "zod";
const today = new Date();

export const messageSchema = z
  .string()
  .describe("Report if it is correct or report the error.");

export const whatSchema = z
  .array(z.string())
  .describe(
    "What you're going to do. It should be Schedule Meeting, Delete Meeting, Move Meeting, Add Attendees, Remove Attendees, Add Topics, Delete Topics, or any combination between them."
  );

export const whoSchema = z.array(z.string()).describe("Meeting participants");

export const timeSchemaSince = z
  .string()
  .regex(/^(2[0-3]|[01]?[0-9]):([0-5][0-9]|\d{2})$/, {
    message: "Formato de hora inválido. Debe ser HH:mm (24 horas).",
  })
  .describe(`Meeting start time. Response in the format HH:mm`);

export const timeSchemaSinceUntil = z
  .string()
  .regex(/^(2[0-3]|[01]?[0-9]):([0-5][0-9]|\d{2})$/, {
    message: "Formato de hora inválido. Debe ser HH:mm (24 horas).",
  })
  .describe(`Meeting end time. Response in the format HH:mm`);

export const whenSchema = z
  .string()
  .describe(`Today is ${today}. Meeting date. Must be YYYY-MM-DD.`);

export const aboutSchema = z
  .array(z.string())
  .describe("Topics to be discussed during the meeting.");

export const durationSchema = z
  .string()
  .regex(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/, {
    message: "Duration must be in the format HH:mm.",
  })
  .describe(
    "Duration of the meeting. Must be in HH:mm. It is not the same as Meeting Time. Default take an hour."
  );
