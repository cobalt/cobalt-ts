import { extractLeft, extractRight } from "@hexworks/cobalt-core";
import * as O from "fp-ts/Option";
import * as RTE from "fp-ts/ReaderTaskEither";
import { pipe } from "fp-ts/function";
import { AuthorizationError, AuthorizedOperationOf } from "..";
import { authorize } from "../Authorization";
import { Context } from "../Context";
import { authorization } from "./authorization";
import { anonUser, todos, userJane, userJohn } from "./fixtures";
import { Deps, deleteTodo, findAllTodos, findTodo } from "./operations";

describe("Given some authorized operations", () => {
    const notificationService = {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        notify(): void {},
    };

    const deps: Deps = {
        notificationService,
        authorization,
    };

    const authorizedFind: AuthorizedOperationOf<typeof findTodo> =
        authorize(findTodo);
    const authorizedDelete: AuthorizedOperationOf<typeof deleteTodo> =
        authorize(deleteTodo);
    const authorizedFindAll: AuthorizedOperationOf<typeof findAllTodos> =
        authorize(findAllTodos);

    const anonContext: Context<number> = {
        currentUser: anonUser,
        data: 1,
    };

    const janesContext: Context<number> = {
        currentUser: userJane,
        data: 2,
    };

    it("When finding all todos for anon Then it returns only published without completed", async () => {
        const result = extractRight(
            await authorizedFindAll(
                RTE.right({ currentUser: anonUser, data: undefined })
            )(deps)()
        ).data.map((todo) => ({
            id: todo.id,
            completed: todo.completed,
        }));

        expect(result).toEqual([
            { id: 1, completed: O.none },
            { id: 3, completed: O.none },
        ]);
    });

    it("When finding all todos for a registered user Then it returns only published", async () => {
        const result = extractRight(
            await authorizedFindAll(
                RTE.right({ currentUser: userJohn, data: undefined })
            )(deps)()
        ).data.map((todo) => ({
            id: todo.id,
            completed: todo.completed,
        }));

        expect(result).toEqual([
            { id: 1, completed: O.some(true) },
            { id: 3, completed: O.some(false) },
        ]);
    });

    it("When trying to find", async () => {
        const result = extractRight(
            await authorizedFind(RTE.right(anonContext))(deps)()
        );

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(result.data.id).toBe(todos[1]!.id);
    });
    it("When trying to delete with anon", async () => {
        const result = extractLeft(
            await pipe(
                RTE.right(anonContext),
                authorizedFind,
                authorizedDelete
            )(deps)()
        );

        expect(result).toEqual(
            new AuthorizationError(
                "Current user anonymous has no permission to perform deleteTodo"
            )
        );
    });
    it("When trying to delete with an authorized user", async () => {
        const result = extractRight(
            await pipe(
                RTE.right(janesContext),
                authorizedFind,
                authorizedDelete
            )(deps)()
        );

        expect(result.data).toBeUndefined();
    });
});
