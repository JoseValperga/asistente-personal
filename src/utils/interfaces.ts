export interface Task {
  message: string;
  what: string[];
  who: string[];
  when: string;
  since: string;
  until: string;
  about: string[];
  duration: string;
}

export interface DataMeeting {
  message: string;
  what: string[];
  who: string[];
  when: string;
  since: string;
  until: string;
  about: string[];
  duration: string;
}

export interface EnvVariables {
  DB_USER: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_NAME: string;
}
