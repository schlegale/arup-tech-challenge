import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./pages/Home";
import IssueAdd from "./pages/IssueAdd";
import IssueDetail from "./pages/IssueDetail";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Home" }}
        />
        <Stack.Screen
          name="Details"
          component={IssueDetail}
          options={{ title: "Details" }}
        />

        <Stack.Screen
          name="Add"
          component={IssueAdd}
          options={{ title: "Add" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
