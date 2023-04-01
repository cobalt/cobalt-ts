import { ZodValidationError } from "@hexworks/cobalt-data";
import { HTTPDataTransferError } from "./HTTPDataTransferError";
import { HTTPRequestError } from "./HTTPRequestError";
import { RemoteDataTransferError } from "./RemoteDataTransferError";
import { UnknownDataTransferError } from "./UnknownDataTransferError";

export type DataTransferError =
    | HTTPDataTransferError
    | ZodValidationError<unknown>
    | HTTPRequestError
    | RemoteDataTransferError
    | UnknownDataTransferError;
