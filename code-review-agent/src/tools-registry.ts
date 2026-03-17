import type { ToolSet } from "ai";
import { writeFileTool } from "./tools/write-file";
import { readFileTool } from "./tools/read-file";
import { searchFilesTool } from "./tools/search-files";

export const tools = {
    write_file: writeFileTool,
    read_file: readFileTool,
    search_files: searchFilesTool
} satisfies ToolSet