import Joi from "@hapi/joi";

export const complianceContract = Joi.object({
  /**
   * The URL of the webpage to be checked for policy compliance.
   * It must be a valid URI and is required in the request body.
   */
  webpageUrl: Joi.string().uri().required(),
});
