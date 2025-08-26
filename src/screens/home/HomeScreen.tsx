import type React from "react";
import Screen from "@/components/common/Screen";
import ListDeal from "./components/ListDeal";
import HeaderHome from "./components/Header";

const HomeScreen: React.FC = () => {
  return (
    <Screen paddingHorizontal>
      <HeaderHome />
      <ListDeal />
    </Screen>
  );
};

export default HomeScreen;
