import type { MyContext } from "../../types/context.js";
import { schema } from "../../schema.js";
import { type Services } from "../../services/index.js";
import { ApolloServer } from "@apollo/server";
import type { DocumentNode } from "graphql";

export async function createTestServer({ services }: { services: Services }) {
  const server = new ApolloServer<MyContext>({
    schema,
  });

  await server.start();

  return {
    server,
    services,

    execute: async <
      TData = unknown,
      TVars extends Record<string, any> = Record<string, any>,
    >({
      query,
      variables,
    }: {
      query: DocumentNode;
      variables?: TVars;
    }) => {
      const result = await server.executeOperation<TData, TVars>(
        {
          query,
          variables: (variables ?? {}) as TVars,
        },
        {
          contextValue: { services },
        },
      );

      return result;
    },

    stop: () => server.stop(),
  };
}
