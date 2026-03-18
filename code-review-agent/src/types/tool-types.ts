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
    filename: z.string(),
    folder: z.string().optional(),
    oldStr: z.string(),
    newStr: z.string(),
})

export const EditFileOutputSchema = z.union([
    z.object({
        success: z.literal(true),
        path: z.string(),
        summary: z.object({
            additions: z.string(),
            deletions: z.string(),
            additionsCount: z.number(),
            deletionsCount: z.number()
        })
    }),
    z.object({
        success: z.literal(false),
        error: z.string()
    })
])



export type WriteFileProps = z.infer<typeof WriteFileSchema>
export type ReadFileProps = z.infer<typeof ReadFileSchema>
export type ReadFileResults = z.infer<typeof ReadFileResultSchema>
export type SearchFiles = z.infer<typeof SearchFilesSchema>
export type SearchFilesResult = z.infer<typeof SearchFilesResultSchema>
export type EditFileInput = z.infer<typeof EditFileInputSchema>
export type EditFileOutput = z.infer<typeof EditFileOutputSchema>
