import z from "zod";

export const WriteFileSchema = z.object({
    folder: z
        .string()
        .optional()
        .describe("Optional folder path (relative to project root) where the file should be created."),

    filename: z
        .string()
        .describe("Name of the file to create including extension (e.g. index.ts, config.json)."),

    fileContent: z
        .string()
        .describe("Full content that should be written into the file. This will overwrite the file if it already exists."),
})

export const ReadFileSchema = z.object({
    folder: z
        .string()
        .optional()
        .describe("Optional folder path (relative to the project root) where the file is located."),

    filename: z
        .string()
        .describe("Name of the file to read including extension (e.g. index.ts, package.json)."),
})

export const ReadFileResultSchema = z.union([
    z.object({
        success: z.literal(true),
        fileContent: z
            .string()
            .describe("Full textual content of the requested file."),
    }),
    z.object({
        success: z.literal(false),
        error: z.string()
    })
])

export const SearchFilesSchema = z.object({
    folder: z.string().optional(),
    pattern: z.string().optional()
})

export const SearchFilesResultSchema = z.union([
    z.object({
        success: z.literal(true),
        files: z
            .array(z.string())
            .describe("List of file paths")
    }),
    z.object({
        success: z.literal(false),
        error: z.string()
    })
])

export const EditFileInputSchema = z.object({
    filename: z.string()
        .describe(
            "Name of the file to edit (e.g. 'index.ts')."
        ),
    folder: z.string().optional()
        .describe(
            "Optional relative folder path from project root (e.g. 'src/utils'). If omitted, file is assumed to be in root."
        ),
    oldStr: z.string()
        .describe(
            "Exact or near-exact code snippet currently present in the file that should be replaced. \
        Must include enough surrounding context (multiple lines if possible) to uniquely identify the target location."
        ),

    newStr: z.string()
        .describe(
            "New code snippet that will replace oldStr. Should be a complete, valid replacement block (not partial)."
        ),
    isApproved: z.boolean().optional()
        .describe("Needs approval before writing new changes")
})

export const EditFileOutputSchema = z.union([
    z.object({
        success: z.literal(true),

        path: z.string()
            .describe(
                "File path of the file that was successfully modified."
            ),

        preview: z.object({
            before: z.string(),
            after: z.string(),
            diff: z.string()
        }).optional(),

        summary: z.object({
            additions: z.string()
                .describe(
                    "Text content that was added to the file (diff-style, may include multiple lines)."
                ),
            deletions: z.string()
                .describe(
                    "Text content that was removed from the file (diff-style, may include multiple lines)."
                ),
            additionsCount: z.number()
                .describe(
                    "Number of characters or lines added (depending on implementation). Indicates size of change."
                ),
            deletionsCount: z.number()
                .describe(
                    "Number of characters or lines removed. Indicates size of change."
                ),
        })
            .describe(
                "Summary of changes applied to the file. Useful for understanding impact without reading full diff."
            ),

        needsApproval: z.boolean().optional()
            .describe("Needs human approval to be true for the agent to write the changes in the file")
    }),

    z.object({
        success: z.literal(false),

        error: z.string().describe(
            "Error message explaining why the edit failed (e.g. oldStr not found, invalid path, permission issue)."
        ),
    }),
])


export type WriteFileProps = z.infer<typeof WriteFileSchema>
export type ReadFileProps = z.infer<typeof ReadFileSchema>
export type ReadFileResults = z.infer<typeof ReadFileResultSchema>
export type SearchFiles = z.infer<typeof SearchFilesSchema>
export type SearchFilesResult = z.infer<typeof SearchFilesResultSchema>
export type EditFileInput = z.infer<typeof EditFileInputSchema>
export type EditFileOutput = z.infer<typeof EditFileOutputSchema>
