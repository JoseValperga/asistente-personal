import { z } from "zod";
import { tool } from "ai";
import { DataMeeting } from "../interfaces";
import {
  messageSchema,
  whatSchema,
  whenSchema,
  whoSchema,
  timeSchemaSince,
  timeSchemaSinceUntil,
  aboutSchema,
  durationSchema,
} from "./toolSchemas/toolSchemas";

export const addMeetingTool = tool({
  description:
    "Save meeting. Use this when the user wants to schedule a meeting",

  parameters: z.object({
    dataMeeting: z.object({
      message: messageSchema,
      what: whatSchema,
      who: whoSchema,
      when: whenSchema,
      since: timeSchemaSince,
      until: timeSchemaSinceUntil,
      about: aboutSchema,
      duration: durationSchema,
    }),
  }),
  execute: async ({ dataMeeting }: { dataMeeting: DataMeeting }) => {
    console.log("Estoy en generate");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return dataMeeting;
    } catch (error) {
      console.error("Error en generacion", error);
      throw error;
    }
  },
});
