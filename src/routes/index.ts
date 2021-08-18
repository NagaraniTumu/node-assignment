import { Router } from "express";
import { createValidator } from "express-joi-validation";

import BookRoutes from "./book.routes";

import { authMiddleWare } from "../middleware";

import { reqHeaderSchema } from "../models";

const router = Router();
const validator = createValidator({ passError: true });

router.use(
  "/books",
  validator.headers(reqHeaderSchema),
  authMiddleWare,
  BookRoutes
);

export default router;
