import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const validate = (schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const submitData = { ...req.body };
      await schema.validate(submitData);
      next();
    } catch (err: any) {
      if (err && err.details && err.details[0] && err.details[0].message) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          responseMessage: err.message,
          status: false,
        });
      }
      return err;
    }
  };
};

export { validate };
