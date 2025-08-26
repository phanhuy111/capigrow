import Header, { HeaderElements } from "@/screens/common/Header";
import React from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types";

export default function HeaderProfile() {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "Notifications">>();

  return (
    <Header
      left={[
        {
          component: HeaderElements.iconButton("arrow-left"),
          onPress: () => navigation.goBack(),
        },
      ]}
      center={{
        component: HeaderElements.title("Profile"),
      }}
    />
  );
}
