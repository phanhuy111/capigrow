import Header, { HeaderElements } from "@/screens/common/Header";
import React from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types";

export default function HeaderHome() {
  const navigation = useNavigation<NavigationProp<RootStackParamList, "Notifications">>();

  return (
    <Header
      left={[
        {
          component: HeaderElements.logo("large"),
        },
      ]}
      right={[
        {
          component: HeaderElements.iconButton("search"),
          onPress: () => {},
        },
        {
          component: HeaderElements.notificationButton("bell", 5),
          onPress: () => navigation.navigate("Notifications"),
        },
      ]}
    />
  );
}
