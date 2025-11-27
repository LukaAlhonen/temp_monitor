import { useQuery } from "@apollo/client/react";
import { gql } from "../__generated__";
import type { GetMeasurementsQuery } from "../__generated__/types";

const GET_MEASUREMENTS = gql(`
  query GetMeasurements {
      measurements {
          id
          temp
      }
  }
`);

export const Monitor = () => {
  const { loading, error, data } =
    useQuery<GetMeasurementsQuery>(GET_MEASUREMENTS);

  if (loading) return <div>Loading</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (data) console.log(data);

  return <div>hello</div>;
};
