import { openai } from "@ai-sdk/openai";
import { streamObject, generateText, tool } from "ai";
import { z } from "zod";
import dotenv from "dotenv";
import { DataMeeting } from "@/utils/interfaces";
import { addMeetingTool } from "@/utils/tools/addMeetingTool";

dotenv.config();
const apiKey = process.env.OPENAI_API_KEY;
const language = process.env.LANGUAGE;

export async function POST(request: Request) {
  const { task }: { task: string } = await request.json();
  const today = new Date();

  /*
  const { partialObjectStream } = await streamObject({
    model: openai("gpt-4o"),

    system: `All answers must be in ${language}. You're a productivity assistant and manage a daily meeting schedule. 
    You should keep in mind that you manage dates, times and duration of meetings. 
    - You cannot schedule meetings on dates and times before ${today} except when you move the meeting. 
    - If the date is not specified, take by default ${today}. 
    - You can schedule meetings, delete meetings, move meetings, modify meeting attendees, 
    modify the duration of meetings and modify the topics to be discussed during meetings.`,

    prompt: `The task to do now is ${task}`,

    schema: z.object({
      message: z
        .string()
        .describe("Report if it is correct or report the error."),
      what: z
        .array(z.string())
        .describe(
          "What you're going to do. It should be Schedule Meeting, Delete Meeting, Move Meeting, Add Attendees, Remove Attendees, Add Topics, Delete Topics, or any combination between them."
        ),
      who: z.array(z.string()).describe("Meeting participants"),
      when: dateSchema,
      since: timeSchemaSince,
      until: timeSchemaSinceUntil,
      about: z
        .array(z.string())
        .describe("Topics to be discussed during the meeting."),
      duration: z
        .number()
        .describe(
          "Duration of the meeting. Must be in HH:mm. It is not the same as Meeting Time. Default take an hour."
        ),
    }),
  });
*/
  const { roundtrips } = await generateText({
    model: openai("gpt-4o"),

    maxToolRoundtrips: 10,

    system: `You're a productivity assistant and manage a daily meeting schedule.
      You should keep in mind that you manage dates, times and duration of meetings. All answers must be in ${language}.
      - You cannot schedule meetings on dates and times before ${today} except when you move the meeting. 
      - If the date is not specified, take by default ${today}. 
      - You can schedule meetings, delete meetings, move meetings, modify meeting attendees, 
      modify the duration of meetings, modify the topics to be discussed during meetings.
      If the user requests to schedule a meeting, call \`add_Meeting\` to save it.`,

    prompt: `The task to do now is ${task}`,

    tools: {
      addMeeting: addMeetingTool,
    },
  });

  const allToolCalls = roundtrips.flatMap((roundtrip) => roundtrip.toolCalls);
  const temp = allToolCalls[0].args.dataMeeting;

  const array: any[] = [];
  array.push(temp);
  /*
  const partialObjects: any[] = [];
  for await (const partialObject of partialObjectStream) {
    partialObjects.push(partialObject);
  }
  const array = partialObjects.slice(-1);
  */

  console.log("Resultado final?", array[0]);

  const retorno = new Response(JSON.stringify(array), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(array[0]),
    }
  );

  const data = await response.json();

  return retorno;
}

/*
import { openai } from "@ai-sdk/openai";
import { streamObject, generateText, tool } from "ai";
import { streamUI } from "ai/rsc";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
const language = process.env.LANGUAGE;

// Define la interfaz para los datos de la tarea
interface TaskData {
  task: string;
}

// Define la interfaz para los parámetros del modelo
interface DataMeeting {
  message: string;
  what: string[];
  who: string[];
  when: string;
  since: string;
  until: string;
  about: string[];
  duration: string;
}

// Tipar la función POST
export async function POST(request: Request): Promise<Response> {
  const { task }: TaskData = await request.json();
  const today = new Date().toISOString().split("T")[0];

  const toolSchema = z.object({
    dataMeeting: z.object({
      message: z
        .string()
        .describe("Report if it is correct or report the error."),

      what: z
        .array(z.string())
        .describe(
          "What you're going to do. It should be Schedule Meeting, Delete Meeting, Move Meeting, Add Attendees, Remove Attendees, Add Topics, Delete Topics, or any combination between them."
        ),
      who: z.array(z.string()).describe("Meeting participants"),
      when: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, {
          message: "Meeting date must be in the format YYYY-MM-DD.",
        })
        .describe(`Today is ${today}. Meeting date. Must be YYYY-MM-DD.`),
      since: z
        .string()
        .regex(/^(2[0-3]|[01]?[0-9]):([0-5][0-9])$/, {
          message: "Meeting start time must be in the format HH:mm (24-hour).",
        })
        .describe("Meeting start time. Response in the format HH:mm."),
      until: z
        .string()
        .regex(/^(2[0-3]|[01]?[0-9]):([0-5][0-9])$/, {
          message: "Meeting end time must be in the format HH:mm (24-hour).",
        })
        .describe("Meeting end time. Response in the format HH:mm."),
      about: z
        .array(z.string())
        .describe("Topics to be discussed during the meeting."),
      duration: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/, {
          message: "Duration must be in the format HH:mm.",
        })
        .describe(
          "Duration of the meeting. Must be in HH:mm. It is not the same as Meeting Time. Default take an hour."
        ),
    }),
  });

  try {
    const { partialObjectStream } = await streamObject({
      model: openai("gpt-4o"),

      system: `You're a productivity assistant and manage a daily meeting schedule.
        You should keep in mind that you manage dates, times and duration of meetings. All answers must be in ${language}.
        - You cannot schedule meetings on dates and times before ${today} except when you move the meeting. 
        - If the date is not specified, take by default ${today}. 
        - You can schedule meetings, delete meetings, move meetings, modify meeting attendees, 
        modify the duration of meetings, modify the topics to be discussed during meetings.
        If the user requests to schedule a meeting, call \`add_Meeting\` to save it.`,

      prompt: `The task to do now is ${task}`,

      tools: {
        addMeeting: tool({
          description:
            "Save meeting. Use this when the user wants to schedule a meeting",

          parameters: z.object({
            dataMeeting: z.object({
              message: z
                .string()
                .describe("Report if it is correct or report the error."),

              what: z
                .array(z.string())
                .describe(
                  "What you're going to do. It should be Schedule Meeting, Delete Meeting, Move Meeting, Add Attendees, Remove Attendees, Add Topics, Delete Topics, or any combination between them."
                ),
              who: z.array(z.string()).describe("Meeting participants"),
              when: z
                .string()
                .regex(/^\d{4}-\d{2}-\d{2}$/, {
                  message: "Meeting date must be in the format YYYY-MM-DD.",
                })
                .describe(
                  `Today is ${today}. Meeting date. Must be YYYY-MM-DD.`
                ),
              since: z
                .string()
                .regex(/^(2[0-3]|[01]?[0-9]):([0-5][0-9])$/, {
                  message:
                    "Meeting start time must be in the format HH:mm (24-hour).",
                })
                .describe("Meeting start time. Response in the format HH:mm."),
              until: z
                .string()
                .regex(/^(2[0-3]|[01]?[0-9]):([0-5][0-9])$/, {
                  message:
                    "Meeting end time must be in the format HH:mm (24-hour).",
                })
                .describe("Meeting end time. Response in the format HH:mm."),
              about: z
                .array(z.string())
                .describe("Topics to be discussed during the meeting."),
              duration: z
                .string()
                .regex(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/, {
                  message: "Duration must be in the format HH:mm.",
                })
                .describe(
                  "Duration of the meeting. Must be in HH:mm. It is not the same as Meeting Time. Default take an hour."
                ),
            }),
          }),
          execute: async ({ dataMeeting }: { dataMeeting: DataMeeting }) => {
            console.log("Estoy en generate");
            try {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              return dataMeeting;
            } catch (error) {
              console.error("Error en generacion", error);
              throw error; // Opcionalmente, puedes lanzar el error para manejarlo en otros lugares
            }
          },
        }),
      },
    });

    const partialObjects: DataMeeting[] = [];
    for await (const partialObject of partialObjectStream) {
      partialObjects.push(partialObject as DataMeeting);
    }

    const array = partialObjects.slice(-1);
    console.log("Resultado final?", array[0]);

    const retorno = new Response(JSON.stringify(array), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(array[0]),
      }
    );

    const data = await response.json();

    return retorno;
  } catch (error) {
    console.error("Error en POST", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

*/
