// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { padRouter } from "./PAD";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("pad.", padRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
