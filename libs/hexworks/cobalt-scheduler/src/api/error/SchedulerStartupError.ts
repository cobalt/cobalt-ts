import { ProgramErrorBase } from "@hexworks/cobalt-core";

export class SchedulerStartupError extends ProgramErrorBase<"SchedulerStartupError"> {
    constructor(cause: unknown) {
        super({
            __tag: "SchedulerStartupError",
            message: `Couldn't start job scheduler. Cause: ${cause}`,
        });
    }
}
