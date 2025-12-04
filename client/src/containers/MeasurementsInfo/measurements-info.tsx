import { useQuery } from "@apollo/client/react";
import type {
  GetMeasurementsQuery,
  GetMeasurementsQueryVariables,
} from "../../__generated__/graphql";
import { GET_MEASUREMENTS } from "./measurements-info.graphql";
import styled from "@emotion/styled";
import { colors } from "../../colors";

interface MeasurementsInfoProps {
  locationId: string;
  sensorId: string;
  interval?: {
    hours?: number;
    days?: number;
  };
}

const MeasurementsInfo = (props: MeasurementsInfoProps) => {
  const { data, loading, error } = useQuery<
    GetMeasurementsQuery,
    GetMeasurementsQueryVariables
  >(GET_MEASUREMENTS, {
    variables: {
      sensorId: props.sensorId,
      locationId: props.locationId,
      interval: props.interval,
    },
  });

  const title = props.interval
    ? props.interval.hours
      ? `Last ${props.interval.hours} hour(s)`
      : props.interval.days
        ? `Last ${props.interval.days} day(s)`
        : ""
    : "";

  if (loading) return "Loading...";
  if (error) return error.message;

  return (
    <MeasurementsInfoContainer>
      <MeasurementsInfoHeader>
        <h4>{title}</h4>
      </MeasurementsInfoHeader>

      <MeasurementsContainer>
        <MeasurementContainer>
          AVG <TempContainer>{data?.measurements.avg}</TempContainer>
        </MeasurementContainer>

        <MeasurementContainer>
          MAX <TempContainer>{data?.measurements.max}</TempContainer>
        </MeasurementContainer>

        <MeasurementContainer>
          MIN <TempContainer>{data?.measurements.min}</TempContainer>
        </MeasurementContainer>
      </MeasurementsContainer>
    </MeasurementsInfoContainer>
  );
};

export default MeasurementsInfo;

const MeasurementsInfoContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  border: `0.10rem solid ${colors.darkGray}`,
  borderRadius: "0.5rem",
  padding: "0.7rem",
  gap: "0.5rem",
  background: colors.bg4,
});

const MeasurementsInfoHeader = styled.div({
  "& h4": {
    margin: 0,
    padding: 0,
  },
});

const MeasurementsContainer = styled.div({
  display: "flex",
  color: colors.blue,
  gap: "0.5rem",
  justifyContent: "space-between",
  width: "100%",
  flexWrap: "wrap",
  minWidth: 0,
});

const MeasurementContainer = styled.div({
  color: colors.blue,
  display: "flex",
  padding: "1rem",
  background: colors.bg5,
  borderRadius: "0.3rem",
  gap: "0.7rem",
});

const TempContainer = styled.div({
  color: colors.white,
});
