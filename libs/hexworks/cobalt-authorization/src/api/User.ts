/**
 * Contains information that can be used to identify a user,
 * and also the `roles` (only the names) the user has.
 */
export type User<I> = {
    id: I;
    name: string;
    roles: string[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyUser = User<any>;
