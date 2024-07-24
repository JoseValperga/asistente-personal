import { saveMeeting } from "@/lib/actions";

interface MeetingData {
  message: string;
  what: string[];
  who: string[];
  when: string;
  since: string;
  until: string;
  about: string[];
  duration: string;
}

export async function POST(request: Request): Promise<Response> {
  "use server";
  const data: MeetingData = await request.json();
  //console.log("En tasks/route", data);

  try {
    const newData = await saveMeeting(data);
    const response = new Response(JSON.stringify(newData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error al guardar la reunión:", error);
    return new Response("Error al guardar la reunión", {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
