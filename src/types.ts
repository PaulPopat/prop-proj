import {
  IsArray,
  IsBoolean,
  IsDictionary,
  IsLiteral,
  IsObject,
  IsString,
  IsType,
  IsUnion,
  IsRecord,
} from "@paulpopat/safe-type";

export const IsLibrary = IsObject({
  simplelibraries: IsBoolean,
  name: IsString,
  include: IsString,
  linker: IsString,
  depends: IsArray(IsString),
});

export type Library = IsType<typeof IsLibrary>;

export const IsProject = IsObject({
  build: IsObject({
    libraries: IsArray(IsLibrary),
    source: IsArray(IsString),
    presets: IsDictionary(
      IsObject({
        optimisation: IsUnion(
          IsLiteral(0),
          IsLiteral(1),
          IsLiteral(2),
          IsLiteral(3),
          IsLiteral("s")
        ),
        memory: IsUnion(
          IsLiteral("cog"),
          IsLiteral("cmm"),
          IsLiteral("lmm"),
        ),
        fast_cache: IsBoolean,
      })
    ),
    use: IsRecord(
      IsUnion(
        IsLiteral("maths"),
        IsLiteral("parallel"),
        IsLiteral("tiny"),
      ),
      IsBoolean
    ),
    runtime_types: IsBoolean,
    doubles: IsUnion(IsLiteral(32), IsLiteral(64)),
  }),
});

export type Project = IsType<typeof IsProject>;
