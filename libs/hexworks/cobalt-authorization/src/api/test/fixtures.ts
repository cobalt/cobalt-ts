import * as O from "fp-ts/Option";
import { roles } from "./roles";
import { Todo } from "./Todo";

type TodoMap = {
    [key: number]: Todo;
};

export const anonUser = {
    id: 1,
    name: "anonymous",
    roles: [roles.anonymous],
};

export const userJohn = {
    id: 2,
    name: "John Doe",
    roles: [roles.user],
};

export const userJane = {
    id: 3,
    name: "Jane Doe",
    roles: [roles.user],
};

export const adminBob = {
    id: 4,
    name: "Bob Doe",
    roles: [roles.admin],
};

export const todos: TodoMap = {
    1: {
        id: 1,
        owner: userJohn,
        description: O.some("Learn TypeScript"),
        completed: O.some(true),
        published: O.some(true),
    },
    2: {
        id: 2,
        owner: userJane,
        description: O.some("Learn fp-ts"),
        completed: O.some(false),
        published: O.some(false),
    },
    3: {
        id: 3,
        owner: adminBob,
        description: O.some("Create a typeclass"),
        completed: O.some(false),
        published: O.some(true),
    },
    4: {
        id: 4,
        owner: userJohn,
        description: O.some("Go to sleep"),
        completed: O.some(true),
        published: O.some(false),
    },
};
