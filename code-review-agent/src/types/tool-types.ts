import z from "zod";

export const WriteFileSchema = z.object({
    folder: z.string().optional(),
    filename: z.string(),
    fileContent: z.string(),
})

export type WriteFileProps = z.infer<typeof WriteFileSchema>