import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_LOCATION } from "./location.graphql";
import type {
  GetLocationQuery,
  GetLocationQueryVariables,
} from "../../__generated__/graphql";
import { LocationDetail } from "../../components/LocationDetail";
import { Layout } from "../../components/Layout";
import HeaderLink from "../../components/HeaderLink/header-link";

const Location = () => {
  const { locationId = "" } = useParams<{ locationId: string }>();
  const { data, loading, error } = useQuery<
    GetLocationQuery,
    GetLocationQueryVariables
  >(GET_LOCATION, {
    variables: {
      id: locationId,
    },
  });
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <Layout
      headerLeft={<HeaderLink path="/" text="Locations" icon="arrow-left" />}
      headerTitle={locationId}
    >
      <LocationDetail location={data?.location} />
    </Layout>
  );
};

export default Location;
