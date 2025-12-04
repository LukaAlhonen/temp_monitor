import styled from "@emotion/styled";
import { colors } from "../../colors";
import { useQuery } from "@apollo/client/react";
import type {
  GetSensorQuery,
  GetSensorQueryVariables,
} from "../../__generated__/graphql";
import { GET_SENSOR } from "./sensor.graphql";
import { useParams } from "react-router-dom";
import { SensorCard } from "../../containers/SensorCard";
import { MeasurementsInfo } from "../../containers/MeasurementsInfo";
import { Layout } from "../../components/Layout";
import HeaderLink from "../../components/HeaderLink/header-link";

const Sensor = () => {
  const { sensorId = "", locationId = "" } = useParams<{
    sensorId: string;
    locationId: string;
  }>();
  const { data, loading, error } = useQuery<
    GetSensorQuery,
    GetSensorQueryVariables
  >(GET_SENSOR, {
    variables: {
      sensorId,
      locationId,
    },
  });

  console.log(sensorId);
  console.log(locationId);

  if (loading) return "Loading...";
  if (error) return error.message;

  return (
    <Layout
      headerLeft={
        <>
          <HeaderLink text="Locations" path="/" icon="arrow-left" />
          <LinkSeparator>/</LinkSeparator>
          <HeaderLink text={locationId} path={`/location/${locationId}`} />
        </>
      }
      headerTitle={`${locationId} / ${sensorId}`}
    >
      <SensorContainer>
        <SensorCard sensor={data?.sensor} />
        <MeasurementsContainer>
          <MeasurementsInfo
            sensorId={sensorId}
            locationId={locationId}
            interval={{ hours: 1 }}
          />
          <MeasurementsInfo
            sensorId={sensorId}
            locationId={locationId}
            interval={{ days: 1 }}
          />
          <MeasurementsInfo
            sensorId={sensorId}
            locationId={locationId}
            interval={{ days: 7 }}
          />
        </MeasurementsContainer>
      </SensorContainer>
    </Layout>
  );
};

export default Sensor;

const SensorContainer = styled.div({
  display: "flex",
  padding: "1.5rem",
  margin: "1.5rem",
  border: `0.10rem solid ${colors.darkGray}`,
  borderRadius: "0.5rem",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "1rem",
  "@media(max-width: 690px)": {
    padding: "1rem",
    margin: 0,
    border: "none",
  },
});

const MeasurementsContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  color: colors.white,
  gap: "1rem",
  justifyContent: "space-between",
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: 0,
  minWidth: "20rem",
  maxWidth: "100%",
});

const LinkSeparator = styled.div({
  display: "inline",
  marginLeft: "0.2rem",
  marginRight: "0.2rem",
  color: colors.dBlue,
  fontSize: "1.3rem",
});
