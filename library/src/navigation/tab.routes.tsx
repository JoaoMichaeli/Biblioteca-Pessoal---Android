import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import CreateBook from "screens/authorized/CreateBook";
import BookList from "screens/authorized/BookList";
import Home from "screens/authorized/Home";
import Profile from "screens/authorized/Profile";
import Favorites from "screens/authorized/BookFavorite";

const { Navigator, Screen } = createBottomTabNavigator();

export default function TabRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 5,
          paddingHorizontal: 10,
          backgroundColor: '#6A5ACD',
        },
        tabBarItemStyle: {
          marginHorizontal: 5,
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#ccc',
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      }}
    >
      <Screen
        name="Home"
        component={Home}
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => <AntDesign size={size} color={color} name="home" />,
        }}
      />
      <Screen
        name="BookList"
        component={BookList}
        options={{
          title: "Meus Livros",
          tabBarIcon: ({ color, size }) => <AntDesign size={size} color={color} name="book" />,
        }}
      />
      <Screen
        name="CreateBook"
        component={CreateBook}
        options={{
          title: "Adicionar",
          tabBarIcon: ({ color, size }) => <AntDesign size={size} color={color} name="pluscircleo" />,
        }}
      />
      <Screen
        name="Favoritos"
        component={Favorites}
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color, size }) => <AntDesign size={size} color={color} name="star" />,
        }}
      />
      <Screen
        name="Perfil"
        component={Profile}
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
        }}
      />
    </Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
