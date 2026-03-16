import type { ToolSet } from "ai";
import { writeFileTool } from "./tools/write-file";

export const tools = {
    write_file: writeFileTool
} satisfies ToolSet