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
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          component={Home}
          options={{ title: "Issues List" }}
        />
        <Stack.Screen
          name="IssueDetail"
          component={IssueDetail}
          options={{ title: "Issue Detail" }}
        />

        <Stack.Screen
          name="IssueAdd"
          component={IssueAdd}
          options={{ title: "Add New Issue" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
