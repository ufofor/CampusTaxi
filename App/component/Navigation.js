import * as React from "react";
import { Component, useState } from "react";
import { Button, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import MychatScreen from "./MychatScreen";
import AlramScreen from "./AlramScreen";
import SettingScreen from "./SettingScreen";
import TempScreen from "./TempScreen";
import chatScreen from "./MainScreen/chatScreen.js";
import chatroomScreen from "./MainScreen/chatroomScreen.js";
import MainScreen from "./MainScreen/MainScreen.js";

const Tab = createBottomTabNavigator();
export default class Navigation extends Component {
  constructor(props) {
    super(props);
    //See what props our StarWarsCard renders with
    // alert(JSON.stringify(props));
  }
  render() {
    const defaultNavOption = {
      headerShown: false,
      ...TransitionPresets.ModalSlideFromBottomIOS,
    };
    const HomeStack = createStackNavigator();
    const MychatStack = createStackNavigator();
    const AlramStack = createStackNavigator();
    const SettingStack = createStackNavigator();

    function HomeStackScreen() {
      return (
        <HomeStack.Navigator initialRouteName="홈">
          <HomeStack.Screen name="temp" component={TempScreen} />
          <HomeStack.Screen
            options={defaultNavOption}
            name="홈"
            component={MainScreen}
          />
          <HomeStack.Screen
            name="모든 채팅방 목록"
            options={defaultNavOption}
            component={chatScreen}
          />
          <HomeStack.Screen
            name="채팅방"
            options={defaultNavOption}
            component={chatroomScreen}
          />
        </HomeStack.Navigator>
      );
    }

    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              //아이콘 설정
              let iconName;
              if (route.name === "홈") {
                iconName = focused ? "ios-airplane" : "ios-airplane";
              } else if (route.name === "내 채팅") {
                iconName = focused ? "ios-airplane" : "ios-airplane";
              } else if (route.name === "알림") {
                iconName = focused ? "ios-airplane" : "ios-airplane";
              } else if (route.name === "설정") {
                iconName = focused ? "ios-airplane" : "ios-airplane";
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            //아이콘 색상 설정
            activeTintColor: "tomato",
            inactiveTintColor: "gray",
          }}
        >
          <Tab.Screen name="홈" component={HomeStackScreen} />
          <Tab.Screen name="내 채팅" component={MychatScreen} />
          <Tab.Screen name="알림" component={AlramScreen} />
          <Tab.Screen name="설정" component={SettingScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
