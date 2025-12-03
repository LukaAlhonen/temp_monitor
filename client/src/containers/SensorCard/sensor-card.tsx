import styled from "@emotion/styled";
import { useFragment, type FragmentType } from "../../__generated__";
import { MEASUREMENT_ADDED, SENSOR_FRAGMENT } from "./sensor-card.graphql";
import { colors } from "../../colors";
import { useSubscription } from "@apollo/client/react";
import type {
  MeasurementAddedSubscription,
  MeasurementAddedSubscriptionVariables,
} from "../../__generated__/graphql";

// TODO: should probably find a way to define temp thresholds for each sensor
const WARN = 10;
const DANGER = 20;

interface SensorCardProps {
  sensor?: FragmentType<typeof SENSOR_FRAGMENT>;
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
      </SensorCardHeader>
      <MeasurementContainer>
        <TempContainer temp={temp}>
          <strong>
            {temp} {unitMap.get(sensor?.latestMeasurement.unit.toLowerCase())}
          </strong>
        </TempContainer>
      </MeasurementContainer>
    </SensorCardContainer>
  );
};

export default SensorCard;

const SensorCardContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  padding: "1rem",
  background: colors.bg3,
  color: colors.white,
  border: `0.10rem solid ${colors.darkGray}`,
  borderRadius: "0.5rem",
  alignItems: "center",
  gap: "1rem",
  minWidth: "20rem",
  maxWidth: "30rem",
  alignSelf: "flex-start",
});

const SensorCardHeader = styled.div({
  "& h1": {
    margin: 0,
    padding: 0,
  },
});
// <{ noMargin?: boolean}>(
//   ({noMargin}) => ({
const MeasurementContainer = styled.div({
  display: "flex",
  background: colors.bg4,
  borderRadius: "0.3rem",
  padding: "1rem",
  minHeight: "15rem",
  minWidth: "15rem",
  alignItems: "center",
  justifyContent: "center",
  border: `0.10rem solid ${colors.darkGray}`,
});

const TempContainer = styled.div<{ temp?: number }>(({ temp }) => ({
  display: "flex",
  borderRadius: "0.3rem",
  padding: "1rem",
  minWidth: "10rem",
  minHeight: "10rem",
  color: colors.bg3,
  background:
    temp && temp >= DANGER
      ? colors.status.danger
      : temp && temp >= WARN
        ? colors.status.warning
        : colors.status.okay,
  alignItems: "center",
  justifyContent: "center",
}));
