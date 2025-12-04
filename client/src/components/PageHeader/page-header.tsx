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
      <Title>
        <h1>{props.title}</h1>
      </Title>
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
  justifyContent: "space-between",
});

const Left = styled.div({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
});

const Title = styled.div({
  overflow: "hidden",
  maxWidth: "40rem",
  "@media(max-width: 769px)": {
    display: "none",
  },
  "& h1": {
    textTransform: "uppercase",
    padding: 0,
    margin: 0,
    textOverflow: "ellipsis",
    textWrap: "nowrap",
    overflow: "hidden",
  },
});

const Right = styled.div({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  "@media(max-width: 1000px)": {
    display: "none",
  },
});
