import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/schema.ts",
  documents: ["./src/utils/test/queries/**/*.ts"],
  generates: {
    "./src/__generated__/types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        contextType: "../types/context.js#MyContext",

        useTypeImports: true,

        mappers: {
          Measurement: "../models.js#MeasurementModel",
          Sensor: "../models.js#SensorModel",
          Location: "../models.js#LocationModel",
        },
      },
    },
    "./src/__generated__/graphql.ts": {
      plugins: ["typescript-operations", "typescript", "typed-document-node"],
      config: {
        useTypeImports: true,
      },
    },
  },
};

export default config;
