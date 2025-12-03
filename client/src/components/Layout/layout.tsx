import styled from "@emotion/styled";
import { PageHeader } from "../PageHeader";

interface LayoutProps {
  children?: React.ReactNode;
  headerLeft?: React.ReactNode;
  headerTitle?: string;
  headerRight?: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
  return (
    <LayoutContainer>
      <PageHeader
        left={props.headerLeft}
        title={props.headerTitle}
        right={props.headerRight}
      />
      {props.children}
    </LayoutContainer>
  );
};

export default Layout;

const LayoutContainer = styled.div({
  width: "100%",
  height: "100%",
  overFlowY: "hidden",
});
