import styled from "@emotion/styled";
import { colors } from "../../colors";

interface PageHeaderProps {
  left?: React.ReactNode;
  title?: string;
  right?: React.ReactNode;
}

const PageHeader = (props: PageHeaderProps) => {
  return (
    <PageHeaderContainer>
      <Left>{props.left}</Left>
      <h1>{props.title}</h1>
      <Right>{props.right}</Right>
    </PageHeaderContainer>
  );
};

export default PageHeader;

const PageHeaderContainer = styled.div({
  display: "flex",
  padding: "1.5rem",
  height: "4rem",
  background: colors.bg4,
  borderBottom: `0.10rem solid ${colors.darkGray}`,
  alignItems: "center",
  color: colors.white,
  "& h1": {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    textTransform: "uppercase",
    padding: 0,
    margin: 0,
  },
});

const Left = styled.div({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
});

const Right = styled.div({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
});
