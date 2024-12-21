import { Specifier } from "../core/types/mod.ts";

export type ParsedFile = {
  path: string;
  imports: Specifier[];
  exports: Specifier[];
};
