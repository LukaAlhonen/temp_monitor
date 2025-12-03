import styled from "@emotion/styled";
import { useFragment, type FragmentType } from "../../__generated__";
import { LOCATION_DETAIL_FRAGMENT } from "./location-detail.graphql";
import { Link } from "react-router-dom";
import { colors } from "../../colors";

import ArrowLeftSVG from "../../assets/icons/angle-left.svg?react";
import { Layout } from "../Layout";
import { SensorCard } from "../../containers/SensorCard";

interface LocationDetailProps {
  location?: FragmentType<typeof LOCATION_DETAIL_FRAGMENT>;
}

const LocationDetail = (props: LocationDetailProps) => {
  const location = useFragment(LOCATION_DETAIL_FRAGMENT, props.location);

  return (
    <Layout
      headerLeft={
        <LocationsLink to="/">
          <ArrowLeftIcon />
          Locations
        </LocationsLink>
      }
      headerTitle={location ? location.id : ""}
    >
      <SensorGrid>
        {location?.sensors.map((sensor) => (
          <SensorCard key={sensor.id} sensor={sensor} />
        ))}
      </SensorGrid>
    </Layout>
  );
};

export default LocationDetail;

const SensorGrid = styled.div({
  background: colors.bg3,
  overflowX: "hidden",
  display: "grid",
  gap: "1.5em",
  width: "100%",
  minHeight: "100vh",
  gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))",
  justifyContent: "center",
  boxSizing: "border-box",
  padding: "1.5rem",
  justifyItems: "center",
});

const LocationsLink = styled(Link)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: colors.blue,
  textDecoration: "none",
  gap: "0.3rem",
  "&:hover": {
    color: colors.dBlue,
    textDecoration: "underline",
  },
});

const ArrowLeftIcon = styled(ArrowLeftSVG)({
  height: "1rem",
  width: "1rem",
  "& path": {
    fill: "currentcolor",
  },
});
