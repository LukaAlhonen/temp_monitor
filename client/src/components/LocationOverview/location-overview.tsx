import styled from "@emotion/styled";
import { useFragment, type FragmentType } from "../../__generated__";
import { LOCATION_OVERVIEW_FRAGMENT } from "./location-overview.graphql";
import { colors } from "../../colors";

import ArrowSVG from "../../assets/icons/angle-right.svg?react";
import { Link } from "react-router-dom";

interface LocationOverviewProps {
  location?: FragmentType<typeof LOCATION_OVERVIEW_FRAGMENT>;
}

const LocationOverview = (props: LocationOverviewProps) => {
  const location = useFragment(LOCATION_OVERVIEW_FRAGMENT, props.location);
  return (
    <LocationOverViewContainer>
      <LocationHeader>
        <h1>{location?.id}</h1>
        <LocationLink to={location ? `/location/${location.id}` : "#"}>
          Live-Monitor
          <ArrowIcon />
        </LocationLink>
      </LocationHeader>
      <SensorsContainer>
        <SensorContainerHeader>sensors</SensorContainerHeader>
        <SensorList>
          {location?.sensors.map((sensor) => (
            <SensorContainer key={sensor.id}>
              {sensor.id}
              <SensorLink to={`/location/${location.id}/sensor/${sensor.id}`}>
                Live-Monitor
                <ArrowIcon />
              </SensorLink>
            </SensorContainer>
          ))}
        </SensorList>
      </SensorsContainer>
    </LocationOverViewContainer>
  );
};

export default LocationOverview;

const LocationOverViewContainer = styled.div({
  display: "flex",
  maxWidth: "45rem",
  minwidht: "30rem",
  width: "100%",
  height: "30rem",
  color: "white",
  flexDirection: "column",
  border: `0.10rem solid ${colors.darkGray}`,
  padding: "1rem",
  borderRadius: "0.5rem",
  background: colors.bg3,
});

const LocationHeader = styled.div({
  display: "flex",
  alignSelf: "center",
  alignItems: "center",
  width: "100%",
  color: colors.white,
  justifyContent: "space-between",
  "& h1": {
    textTransform: "uppercase",
    padding: 0,
    margin: 0,
    fontSize: "1.3rem",
  },
});

const LocationLink = styled(Link)({
  textDecoration: "none",
  display: "flex",
  justifyContent: "right",
  alignItems: "center",
  gap: "0.5rem",
  fontSize: "1.1rem",
  color: colors.blue,
  "&:hover": {
    color: colors.dBlue,
    cursor: "pointer",
    textDecoration: "underline",
  },
});

const SensorsContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  borderRadius: "0.3rem",
  padding: "2rem",
  height: "100%",
  marginTop: "1rem",
  background: colors.bg4,
  color: colors.white,
  gap: "1rem",
  overflowY: "auto",
});

const SensorContainerHeader = styled.div({
  textTransform: "uppercase",
});

const SensorList = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  overflow: "auto",
  border: `0.10rem solid ${colors.darkGray}`,
  borderRadius: "0.3rem",
  padding: "0.7rem",
  height: "100%",
  "&::-webkit-scrollbar": {
    display: "none",
  },
});

const SensorContainer = styled.div({
  display: "flex",
  flexShrink: 0,
  flexDirection: "row",
  padding: "0.5rem",
  height: "2.5rem",
  width: "100%",
  alignItems: "center",
  justifyContent: "space-between",
  borderRadius: "0.3rem",
  border: `0.10rem solid ${colors.darkGray}`,
  background: colors.bg5,
});

const SensorLink = styled(Link)({
  textDecoration: "none",
  display: "flex",
  justifyContent: "right",
  alignItems: "center",
  gap: "0.5rem",
  color: colors.blue,
  "&:hover": {
    color: colors.dBlue,
    cursor: "pointer",
    textDecoration: "underline",
  },
});

const ArrowIcon = styled(ArrowSVG)({
  height: "1rem",
  width: "1rem",
  "& path": {
    fill: "currentColor",
  },
});
