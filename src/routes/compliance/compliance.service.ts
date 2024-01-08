import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { langchainService } from "../../services/langchain.service";
import { convert } from "html-to-text";

/**
 * Service class responsible for handling compliance-related operations.
 * It includes a method for checking policy compliance based on a provided webpage URL.
 *
 * @class ComplianceService
 */
export class ComplianceService {
  /**
   * Handles the POST request for checking policy compliance.
   *
   * @async
   * @method checkPolicy
   * @memberof ComplianceService
   * @param {Request} request - Express request object containing the HTTP request details.
   * @param {Response} response - Express response object for sending HTTP responses.
   * @returns {Promise<void>} A Promise representing the completion of the operation.
   */
  async checkPolicy(request: Request, response: Response) {
    try {
      // Extract the webpage URL from the request body.
      const { webpageUrl } = request.body;

      // Create a CheerioWebBaseLoader to load documents from the specified webpage.
      const loader = new CheerioWebBaseLoader(webpageUrl);
      const documents = await loader.load();

      // Convert the HTML content of the first document to text and compare it using LangchainService.
      const splitedDocs = await langchainService.compare(
        convert(documents[0].pageContent)
      );

      // Send a successful response with the compliance check result.
      return response
        .status(StatusCodes.ACCEPTED)
        .send({ status: true, result: splitedDocs });
    } catch (error: Error | any) {
      // Handle errors and send a corresponding error response.
      return response
        .status(StatusCodes.BAD_REQUEST)
        .send({ status: false, message: error.message });
    }
  }
}
