import styled from "@emotion/styled";
import { useFragment, type FragmentType } from "../../__generated__";
import { LOCATION_DETAIL_FRAGMENT } from "./location-detail.graphql";
import { colors } from "../../colors";

import { SensorCard } from "../../containers/SensorCard";

interface LocationDetailProps {
  location?: FragmentType<typeof LOCATION_DETAIL_FRAGMENT>;
}

const LocationDetail = (props: LocationDetailProps) => {
  const location = useFragment(LOCATION_DETAIL_FRAGMENT, props.location);

  return (
    <SensorGrid>
      {location?.sensors.map((sensor) => (
        <SensorCard key={sensor.id} sensor={sensor} link={true} />
      ))}
    </SensorGrid>
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
  gridTemplateColumns: "repeat(auto-fit, minmax(25rem, 1fr))",
  gridAutoRows: "25rem",
  justifyContent: "center",
  boxSizing: "border-box",
  padding: "1.5rem",
  justifyItems: "center",
});
