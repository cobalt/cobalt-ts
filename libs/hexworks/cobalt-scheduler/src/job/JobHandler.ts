/* eslint-disable @typescript-eslint/no-explicit-any */

import { ProgramError } from "@hexworks/cobalt-data";
import * as TE from "fp-ts/TaskEither";
import { JsonObject } from "type-fest";
import { JobExecutionError } from "../error";
import { JobContext, JobExecutionResult } from "./JobContext";
import { JobDescriptor } from "./JobDescriptor";
import { JobResult } from "./JobResult";

export type AnyJobHandler = JobHandler<any>;

export type AnyExecutionResult = TE.TaskEither<
    JobExecutionResult<JsonObject, ProgramError>,
    JobExecutionResult<JsonObject, JobResult>
>;

/**
 * A job handler is responsible for handling the lifecycle of a Job:
 * - execution
 * - retry
 * - error handling
 * - result handling
 */
export interface JobHandler<T extends JsonObject> {
    /**
     * The type of job this handler can handle.
     */
    type: string;
    /**
     * Tells whether this handler can execute the given {@link JobDescriptor}.
     */
    canExecute: (info: JobDescriptor<any>) => info is JobDescriptor<T>;
    /**
     * Executes the task with the given {@link JobDescriptor}.
     */
    execute: (context: JobContext<T>) => TE.TaskEither<ProgramError, JobResult>;

    onResult: (
        result: JobExecutionResult<T, JobResult>
    ) => TE.TaskEither<ProgramError, void>;

    onError: (
        error: JobExecutionError<T>
    ) => TE.TaskEither<JobExecutionError<T>, void>;
}