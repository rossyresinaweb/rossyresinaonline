import React, { ReactElement } from "react";
import Header from "./header/Header";
import BottomHeader from "./header/BottomHeader";
import Footer from "./Footer";
import Benefits from "./Benefits";
import TopBar from "./header/TopBar";

interface Props {
  children: ReactElement;
}

const RootLayout = ({ children }: Props) => {
  return (
    <>
      <TopBar />
      <Header />
      <BottomHeader />
      {children}
      <Benefits />
      <Footer />
    </>
  );
};

export default RootLayout;
