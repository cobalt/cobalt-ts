import { ProgramError } from "@hexworks/cobalt-core";
import * as RTE from "fp-ts/ReaderTaskEither";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { Schema } from "zod";
import { AnyEventWithType, StateBuilder, Transition } from ".";
import { DefaultStateBuilder } from "../internal";

export type UnknownStateWithContext<C> = State<unknown, C, string>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyStateWithContext<C> = State<any, C, string>;

/**
 * Describes the shape of a state in a state machine. Does not contain the
 * actual data (@see StateInstance).
 * @param DATA The type of the data that is stored in the state.
 * @param CONTEXT The type of the context that is passed to the state machine.
 * @param NAME The name of the state.
 */
export type State<DATA, CONTEXT, NAME extends string> = {
    /**
     * The schema of the data that is stored in the state.
     */
    readonly schema: Schema<DATA>;
    /**
     * The name of the state (must be unique within a state machine).
     */
    readonly name: NAME;
    /**
     * The transitions that can be triggered by events.
     * @param T The type (string representation) of the event.
     * @see Transition
     * @see Event
     */
    readonly transitions: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [T in string]: Transition<
            DATA,
            CONTEXT,
            unknown,
            T,
            AnyEventWithType<T>
        >[];
    };
    /**
     * An action that will be executed when the state is **entered**.
     * @param data The data that is stored in the state.
     * @see StateInstance
     */
    readonly onEntry: (
        data: DATA
    ) => RTE.ReaderTaskEither<CONTEXT, ProgramError, DATA>;
    /**
     * An action that will be executed when the state is **exited**
     * (after a successful state transition).
     * @param data The data that is stored in the state.
     * @see StateInstance
     */
    readonly onExit: (
        data: DATA
    ) => RTE.ReaderTaskEither<CONTEXT, ProgramError, DATA>;
};

/**
 * Builder function that can be used to create a new state.
 * @param name the unique name of the state.
 * @param DATA The type of the data that is stored in the state.
 * @param CONTEXT The type of the context that is passed to the state machine.
 * @param NAME The name of the state.
 * @returns
 */
export const state = <
    DATA = void,
    CONTEXT = never,
    NAME extends string = string
>(
    name: NAME
): StateBuilder<DATA, CONTEXT, NAME> => {
    return new DefaultStateBuilder(name);
};

/**
 * Returns a new {@link StateInstance} with the given data.
 */
export const newState = <
    DATA = void,
    CONTEXT = never,
    NAME extends string = string
>(
    state: State<DATA, CONTEXT, NAME>,
    data: DATA
) =>
    RTE.right({
        state,
        data,
    });

/**
 * Executes the given `fn` with the given `context` and returns the result.
 */
export const executeWithContext =
    <D, C>(
        fn: (stateData: D, context: C) => TE.TaskEither<ProgramError, unknown>
    ) =>
    (state: D) =>
        pipe(
            RTE.ask<C>(),
            RTE.chain((context) => {
                return RTE.fromTaskEither(fn(state, context));
            }),
            RTE.map(() => state)
        );
