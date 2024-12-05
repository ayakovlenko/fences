import { fp, t } from "./deps.ts";

const ModuleCodec = t.intersection([
  t.type({
    name: t.string,
  }),
  t.partial({
    description: t.union([
      t.string,
      t.undefined,
    ]),
    exposes: t.union([
      t.readonlyArray(t.string),
      t.undefined,
    ]),
    dependsOn: t.union([
      t.readonlyArray(t.string),
      t.undefined,
    ]),
    skipFurther: t.union([
      t.boolean,
      t.undefined,
    ]),
  }),
]);

// TODO: rename `path` to `root` or `sourceRoot`
const ProjectCodec = t.type({
  path: t.string,
  modules: t.readonlyArray(ModuleCodec),
});

export type Module = t.TypeOf<typeof ModuleCodec>;

export type Project = t.TypeOf<typeof ProjectCodec>;

export function validate(json: unknown): Project {
  const result = ProjectCodec.decode(json);
  if (fp.either.isLeft(result)) {
    throw result.left;
  }
  return result.right;
}
