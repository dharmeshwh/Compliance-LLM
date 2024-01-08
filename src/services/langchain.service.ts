import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";

/**
 * LangchainService is a singleton class that encapsulates the functionality
 * for comparing a given input against a pre-retrieved vector of document embeddings.
 * It uses various modules from the Langchain library, such as document loaders,
 * text splitters, vector stores, and OpenAI-powered chat models.
 *
 * @class LangchainService
 */
class LangchainService {
  private static instance: LangchainService | null = null;
  private static url = "https://stripe.com/docs/treasury/marketing-treasury";
  private static vector: MemoryVectorStore;
  private constructor() {
    this.retrieveVector();
  }

  /**
   * Gets the singleton instance of LangchainService.
   * If an instance does not exist, it creates one.
   *
   * @static
   * @returns {LangchainService} The singleton instance of LangchainService.
   */
  public static getInstance(): LangchainService {
    if (!LangchainService.instance) {
      LangchainService.instance = new LangchainService();
    }

    return LangchainService.instance;
  }

  /**
   * Retrieves document embeddings from a specified URL using Langchain modules.
   *
   * @private
   * @async
   * @throws {Error} If an error occurs during the retrieval process.
   */
  private async retrieveVector() {
    try {
      const url = LangchainService.url;

      // Load documents from the specified URL using CheerioWebBaseLoader.
      const loader = new CheerioWebBaseLoader(url);
      const documents = await loader.load();

      // Split the documents into chunks using RecursiveCharacterTextSplitter.
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 0,
      });
      const splittedDocs = await textSplitter.splitDocuments(documents);

      // Create document embeddings using OpenAIEmbeddings and MemoryVectorStore.
      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPEN_API_KEY,
      });
      LangchainService.vector = await MemoryVectorStore.fromDocuments(
        splittedDocs,
        embeddings
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Compares the input string against the pre-retrieved document embeddings using Langchain modules.
   *
   * @async
   * @param {string} input - The input string to be compared.
   * @returns {Promise<string>} The comparison result as a string.
   * @throws {Error} If an error occurs during the comparison process.
   */
  async compare(input: string): Promise<string> {
    try {
      // Ensure that the vector is retrieved before comparison.
      if (!LangchainService.vector) {
        await this.retrieveVector();
      }

      // Create a prompt for the comparison using ChatPromptTemplate.
      const prompt = ChatPromptTemplate.fromTemplate(
        `Check the compliance of the following webpage based only on the provided context:\n<context>{context}</context>\nwebpage: {input}`
      );

      // Create a chat model using ChatOpenAI.
      const model = new ChatOpenAI({
        modelName: "gpt-4",
        openAIApiKey: process.env.OPEN_API_KEY,
      });

      // Create a document chain and retrieval chain using Langchain modules.
      const documentChain = await createStuffDocumentsChain({
        llm: model,
        prompt,
      });

      const retriever = LangchainService.vector.asRetriever();
      const retrievalChain = await createRetrievalChain({
        combineDocsChain: documentChain,
        retriever,
      });

      // Invoke the retrieval chain and return the result.
      const result = await retrievalChain.invoke({
        input,
      });
      return result.answer;
    } catch (error) {
      throw error;
    }
  }
}

/**
 * The exported instance of LangchainService.
 * @type {LangchainService}
 */
export const langchainService = LangchainService.getInstance();
