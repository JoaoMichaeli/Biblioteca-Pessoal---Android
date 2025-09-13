import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Authentication from "screens/unauthorized/Authentication";
import Login from "screens/unauthorized/Login";
import Register from "screens/unauthorized/Register";
import ForgotPassword from "screens/unauthorized/ForgotPassword";

const { Navigator, Screen } = createNativeStackNavigator();

export default function UnsafeRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Screen name="Authentication" component={Authentication} />
      <Screen name="Login" component={Login} />
      <Screen name="Register" component={Register} />
      <Screen name="ForgotPassword" component={ForgotPassword} />
    </Navigator>
  );
}