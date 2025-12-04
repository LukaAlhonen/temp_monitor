import styled from "@emotion/styled";
import { useFragment, type FragmentType } from "../../__generated__";
import { MEASUREMENT_ADDED, SENSOR_FRAGMENT } from "./sensor-card.graphql";
import { colors } from "../../colors";
import { useSubscription } from "@apollo/client/react";
import type {
  MeasurementAddedSubscription,
  MeasurementAddedSubscriptionVariables,
} from "../../__generated__/graphql";
import HeaderLink from "../../components/HeaderLink/header-link";

import WarningSVG from "../../assets/icons/lightbulb-exclamation.svg?react";
import DagnerSVG from "../../assets/icons/diamond-exclamation.svg?react";

// TODO: should probably find a way to define temp thresholds for each sensor
const WARN = 10;
const DANGER = 20;

interface SensorCardProps {
  sensor?: FragmentType<typeof SENSOR_FRAGMENT>;
  link?: boolean;
}

const SensorCard = (props: SensorCardProps) => {
  const sensor = useFragment(SENSOR_FRAGMENT, props.sensor);
  const { data, loading, error } = useSubscription<
    MeasurementAddedSubscription,
    MeasurementAddedSubscriptionVariables
  >(MEASUREMENT_ADDED, {
    variables: {
      sensorId: sensor?.id,
      locationId: sensor?.location.id,
    },
  });

  if (error) console.log(error);

  // Map temp unit names and symbols
  // TODO: should also account for misspellings
  const unitMap = new Map<string, string>();
  unitMap.set("celsius", "°C");
  unitMap.set("c", "°C");
  unitMap.set("fahrenheit", "°F");
  unitMap.set("f", "°F");
  unitMap.set("kelvin", "°K");
  unitMap.set("k", "°K");

  if (!sensor) return <div>Loading...</div>;

  const temp = loading
    ? sensor?.latestMeasurement.temp
    : data?.measurementAdded.temp;

  return (
    <SensorCardContainer>
      <SensorCardHeader>
        <h1>{sensor?.id}</h1>
        {props.link && (
          <HeaderLink
            text="Live Monitor"
            path={`sensor/${sensor.id}`}
            icon="arrow-right"
          />
        )}
      </SensorCardHeader>
      <MonitorContainer>
        <h3>Current Temperature</h3>
        <TempContainer temp={temp}>
          {temp &&
            (temp > DANGER ? (
              <DangerIcon />
            ) : temp > WARN ? (
              <WarningIcon />
            ) : (
              <></>
            ))}
          <strong>
            {temp} {unitMap.get(sensor?.latestMeasurement.unit.toLowerCase())}
          </strong>
        </TempContainer>
      </MonitorContainer>
    </SensorCardContainer>
  );
};

export default SensorCard;

const SensorCardContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  padding: "1.5rem",
  background: colors.bg4,
  color: colors.white,
  border: `0.10rem solid ${colors.darkGray}`,
  borderRadius: "0.5rem",
  alignItems: "center",
  gap: "1.5rem",
  minWidth: "25rem",
  maxWidth: "40rem",
  width: "100%",
  flex: "1 1 auto",
  minHeight: 0,
  // height: "100%",
  justifyContent: "space-between",
});

const SensorCardHeader = styled.div({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  width: "100%",
  fontSize: "1.1rem",
  "& h1": {
    margin: 0,
    padding: 0,
    fontSize: "2rem",
  },
});

const MonitorContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  width: "100%",
  margin: "2rem",
  "& h3": {
    margin: 0,
    padding: 0,
    color: colors.white,
    textTransform: "uppercase",
  },
});

const TempContainer = styled.div<{ temp?: number }>(({ temp }) => ({
  display: "flex",
  borderRadius: "0.3rem",
  padding: "1rem",
  minWidth: "10rem",
  minHeight: "10rem",
  border: `0.10rem solid ${colors.darkGray}`,
  background: colors.bg5,
  fontSize: "2rem",
  gap: "0.6rem",
  color:
    temp && temp >= DANGER
      ? colors.status.danger
      : temp && temp >= WARN
        ? colors.status.warning
        : colors.status.okay,
  alignItems: "center",
  justifyContent: "center",
}));

const iconStyles = {
  width: "2rem",
  height: "2rem",
  "& path": {
    fill: "currentColor",
  },
};

const DangerIcon = styled(DagnerSVG)({
  ...iconStyles,
});

const WarningIcon = styled(WarningSVG)({
  ...iconStyles,
});
