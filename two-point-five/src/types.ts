export type DirectionName = "FORWARD" | "LEFT" | "RIGHT" | "BACK"

export type NonEmptyArray<T> = [T, ...T[]];

export type WithOptional<P extends string, T, V = string> = Omit<T, P> & { P?: V | undefined }