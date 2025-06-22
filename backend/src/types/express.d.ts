// src/types/express.d.ts
declare global {
  namespace Express {
    interface Request {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validatedData?: any;
    }
  }
}

export {};
