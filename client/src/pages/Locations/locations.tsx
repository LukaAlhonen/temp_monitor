import { useQuery } from "@apollo/client/react";
import type {
  GetLocationsQuery,
  GetLocationsQueryVariables,
} from "../../__generated__/graphql";
import { GET_LOCATIONS } from "./locations.graphql";
import { LocationsGrid } from "../../components/LocationsGrid";
import { Layout } from "../../components/Layout";

const Locations = () => {
  const { data, loading, error } = useQuery<
    GetLocationsQuery,
    GetLocationsQueryVariables
  >(GET_LOCATIONS);
  if (loading) return <div>loading...</div>;
  if (error) return <div>error: {error.message}</div>;

  return (
    <Layout headerTitle="Locations">
      <LocationsGrid locations={data?.locations} />
    </Layout>
  );
};

export default Locations;
