export function isUniqueConstraintError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const maybe = error as { number?: unknown; code?: unknown; message?: unknown };
  if (typeof maybe.number === "number") {
    return maybe.number === 2627 || maybe.number === 2601;
  }
  if (typeof maybe.code === "string") {
    return maybe.code === "EREQUEST";
  }
  if (typeof maybe.message === "string") {
    return maybe.message.includes("UNIQUE KEY") || maybe.message.includes("duplicate");
  }
  return false;
}
