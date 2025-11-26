import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/schema.ts",
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
  },
};

export default config;
