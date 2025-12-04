import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { colors } from "../../colors";

import ArrowLeftSVG from "../../assets/icons/angle-left.svg?react";
import ArrowRightSVG from "../../assets/icons/angle-right.svg?react";

type IconType = "arrow-left" | "arrow-right";

interface HeaderLinkProps {
  text: string;
  path?: string;
  icon?: IconType;
}

const HeaderLink = (props: HeaderLinkProps) => {
  return (
    <LocationsLink to={props.path ?? "#"}>
      {props.icon === "arrow-left" && <ArrowLeftIcon />} {props.text}{" "}
      {props.icon === "arrow-right" && <ArrowRightIcon />}
    </LocationsLink>
  );
};

export default HeaderLink;

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

const arrowStyles = {
  height: "1rem",
  width: "1rem",
  "& path": {
    fill: colors.blue,
  },
};

const ArrowLeftIcon = styled(ArrowLeftSVG)({
  ...arrowStyles,
});

const ArrowRightIcon = styled(ArrowRightSVG)({
  ...arrowStyles,
});
