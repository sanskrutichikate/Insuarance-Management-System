import express from "express";
import { createPolicy ,  getAllPolicies,getPolicyById,updatePolicy ,deletePolicy} from "../controllers/policyControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "AGENT"),
  createPolicy
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "AGENT"),
getAllPolicies
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "AGENT"),
getPolicyById
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "AGENT"),
updatePolicy
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "AGENT"),
deletePolicy
);




export default router;