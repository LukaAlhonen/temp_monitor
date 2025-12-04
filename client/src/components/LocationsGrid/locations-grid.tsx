import styled from "@emotion/styled";
import type { GetLocationsQuery } from "../../__generated__/graphql";
import { LocationOverview } from "../LocationOverview";
import { colors } from "../../colors";

interface LocationsGridProps {
  locations?: GetLocationsQuery["locations"];
}

const LocationsGrid = (props: LocationsGridProps) => {
  return (
    <LocationsGridContainer>
      {props.locations?.map((location) => (
        <LocationOverview key={location.id} location={location} />
      ))}
    </LocationsGridContainer>
  );
};

export default LocationsGrid;

const LocationsGridContainer = styled.div({
  background: colors.bg3,
  overflowX: "hidden",
  display: "grid",
  gap: "1.5em",
  width: "100%",
  minHeight: "100vh",
  gridTemplateColumns: "repeat(auto-fit, minmax(30rem, 1fr))",
  justifyContent: "center",
  boxSizing: "border-box",
  padding: "1.5rem",
  justifyItems: "center",
});
