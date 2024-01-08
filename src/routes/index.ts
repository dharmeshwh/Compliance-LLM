import { Router } from "express";
import { validate } from "../middleware/joi";
import { complianceContract } from "./compliance/compliance.contract";
import { ComplianceService } from "./compliance/compliance.service";

/**
 * Express Router instance for compliance-related routes.
 * @type {Router}
 */
const router = Router();

/**
 * An instance of the ComplianceService class for handling compliance-related operations.
 * @type {ComplianceService}
 */
const complianceService = new ComplianceService();

/**
 * POST endpoint for checking policy compliance.
 * Uses the complianceContract middleware for request validation.
 */
router.post(
  "/check-policy",
  validate(complianceContract), // validating body
  complianceService.checkPolicy
);

export default router;
