import express from "express";
import { addCustomer ,getAllCustomers,getCustomerById,updateCustomer,deleteCustomer} from "../controllers/customerControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Add Customer
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "AGENT"),
  addCustomer
);
router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "AGENT"),
  getAllCustomers
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "AGENT"),
  getCustomerById
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "AGENT"),
  updateCustomer
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "AGENT"),
  deleteCustomer
);

export default router;