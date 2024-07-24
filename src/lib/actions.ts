import { connectDB, Meeting } from "./db";

// Define una interfaz para el tipo de datos de la reunión
interface MeetingData {
  who: string[];
  when: string;
  since: string;
  until: string;
  about: string[];
  duration: string;
}

export const saveMeeting = async (data: MeetingData) => {
  console.log("data en actions: ", data);
  const { who, when, since, until, about, duration } = data;

  try {
    await connectDB();
    console.log("Conectado a la base de datos");
    const newMeet = await Meeting.create({
      who,
      when,
      since,
      until,
      about,
      duration,
    });
    return newMeet;
  } catch (error) {
    console.error("Error al crear la reunión:", error);
    throw error; // Opcionalmente, puedes lanzar el error para manejarlo en otros lugares
  }
};
