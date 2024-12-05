export type ImportType = "LocalImport" | "RemoteImport";

export type Import = {
  type: ImportType;
  value: string;
};

export type ParsedFile = {
  path: string;
  imports: Import[];
};
