import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000/graphql",
  ignoreNoDocuments: true,
  documents: ["./src/**/*.{ts,tsx,graphql}"],
  generates: {
    "./src/__generated__/": {
      preset: "client",
      presetConfig: {
        gqlTagName: "gql",
        // fragmentMasking: false,
      },
      config: {
        useTypeImports: true,
      },
    },
    "./src/__generated__/types.ts": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        avoidOptionals: {
          // Use `null` for nullable fields instead of optionals
          field: true,
          // Allow nullable input fields to remain unspecified
          inputValue: false,
        },
        // Use `unknown` instead of `any` for unconfigured scalars
        defaultScalarType: "unknown",
        // Apollo Client always includes `__typename` fields
        nonOptionalTypename: true,
        // Apollo Client doesn't add the `__typename` field to root types so
        // don't generate a type for the `__typename` for root operation types.
        skipTypeNameForRoot: true,
        useTypeImports: true,
      },
    },
  },
};

export default config;
