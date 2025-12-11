import { createId } from "@paralleldrive/cuid2";

const newId = `session_${createId()}`;

console.log(newId);
