export const NOTNULL = <T>(x: T | null | undefined, msg: string = ""): T => {
    if (x == null) {
        console.error(`[🔴] NOTNULL INVARIANT VIOLATION`, msg);
        // throw new Error("bang: " + (msg ?? "no message"));
    }
    return x as any;
};
