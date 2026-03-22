import type { ToolSet } from "ai";
import { writeFileTool } from "./tools/write-file";
import { readFileTool } from "./tools/read-file";
import { searchFilesTool } from "./tools/search-files";
import { editFileTool } from "./tools/edit-file";
import { lsTool } from "./tools/ls";
import { pwdTool } from "./tools/pwd";
import { grepTool } from "./tools/grep";

export const tools = {
    write_file: writeFileTool,
    read_file: readFileTool,
    search_files: searchFilesTool,
    edit_file: editFileTool,

    ls: lsTool,
    pwd: pwdTool,
    grep: grepTool
} satisfies ToolSet