import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabRoutes from "./tab.routes";
import CreateBook from "screens/authorized/CreateBook";
import BookDetails from "screens/authorized/BookDetails";
import EditBook from "screens/authorized/EditBook";
import Favorites from "screens/authorized/BookFavorite";
import EditProfile from "screens/authorized/EditProfile";
import Profile from "screens/authorized/Profile";

const Stack = createNativeStackNavigator();

export default function SafeRoutes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Dashboard" component={TabRoutes} />
      <Stack.Screen name="CreateBook" component={CreateBook} />
      <Stack.Screen name="BookDetails" component={BookDetails} />
      <Stack.Screen name="EditBook" component={EditBook} />
      <Stack.Screen name="Favorites" component={Favorites} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}
