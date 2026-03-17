import type { ToolSet } from "ai";
import { writeFileTool } from "./tools/write-file";
import { readFileTool } from "./tools/read-file";

export const tools = {
    write_file: writeFileTool,
    read_file: readFileTool
} satisfies ToolSet