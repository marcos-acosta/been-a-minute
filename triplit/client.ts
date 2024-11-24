import { TriplitClient } from "@triplit/client";
import { schema } from "./schema";

export const client = new TriplitClient({
  schema,
  serverUrl: import.meta.env.VITE_TRIPLIT_SERVER_URL,
  token: import.meta.env.VITE_TRIPLIT_TOKEN,
  storage: "indexeddb",
  autoConnect: true,
  // onSessionError: (type) => console.log(type),
});
