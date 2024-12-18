import zod from "zod";

const moduleSchema = zod.object({
  name: zod.string(),
  exposes: zod.array(zod.string()).optional(),
  dependsOn: zod.array(zod.string()).optional(),
  libraries: zod.array(zod.string()).optional(),
});

const projectSchema = zod.object({
  path: zod.string(),
  modules: zod.array(moduleSchema),
});

export type Module = zod.infer<typeof moduleSchema>;

export type Project = zod.infer<typeof projectSchema>;

export function validate(json: unknown): Project {
  return projectSchema.parse(json);
}
