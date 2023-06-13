import { Express, Request, Response } from "express";

function notFound(app: Express) {
  // Swagger page
  app.get("*", async (req: Request, res: Response) => {
    res.status(404);
    res.send({
      error: "Not Found",
    });
  });
}

export { notFound };
