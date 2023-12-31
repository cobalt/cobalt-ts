import { JsonObject } from "type-fest";
import { ProgramError } from "./ProgramError";

/**
 * Base class for all Error types. Use `__tag` for tagged unions.
 *
 * Example implementation:
 * ```ts
 * class MyError extends ProgramErrorBase<"MyError"> {
 *     constructor(message: string) {
 *         super({
 *             __tag: "MyError",
 *             message: message
 *         });
 *     }
 * }
 * ```
 */
export abstract class ProgramErrorBase<T extends string>
    extends Error
    implements ProgramError
{
    public override message: string;
    public override cause: ProgramError | undefined;

    public __tag: T;
    public details: JsonObject;

    constructor(params: {
        __tag: T;
        message: string;
        details?: JsonObject;
        cause?: ProgramError;
    }) {
        super(params.message);
        this.__tag = params.__tag;
        this.message = params.message;
        this.details = params.details ?? {};
        this.cause = params.cause;
    }
}
