/** What a Server Action reports back to the screen. Messages are written for the administrator and never carry database detail. */
export type ActionState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export const idleState: ActionState = { status: "idle" };
