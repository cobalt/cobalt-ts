import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/lib/function";
import * as z from "zod";
import { ZodValidationError } from "../errors/ZodValidationError";

/**
 * Wraps the output of {@link ZodType.safeParse} into an {@link Either}.
 */
export const safeParse =
    <T>(schema: z.ZodType<T>) =>
    (input: unknown): E.Either<ZodValidationError<T>, T> => {
        const result = schema.safeParse(input);
        if (result.success) {
            return E.right(result.data);
        } else {
            return E.left(new ZodValidationError(result.error));
        }
    };

/**
 * Wraps the output of {@link ZodType.safeParseAsync} into a {@link TaskEither}.
 */
export const safeParseAsync =
    <T>(schema: z.ZodType<T>) =>
    (input: unknown): TE.TaskEither<ZodValidationError<T>, T> => {
        return pipe(
            TE.fromTask(() => schema.safeParseAsync(input)),
            TE.chain((result) => {
                if (result.success) {
                    return TE.right(result.data);
                } else {
                    return TE.left(new ZodValidationError(result.error));
                }
            })
        );
    };
