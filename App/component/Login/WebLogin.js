import React, { Component } from "react";
import {
  View,
  Text,
  Platform,
  StyleSheet,
  Button,
  BackHandler,
} from "react-native";
import WebView from "react-native-webview";
import { bbsStore, userStore } from "store";

////////////////////
import axios from "axios";
///////////////////
export default class WebLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: this.props.route.params.uri,
      api: this.props.route.params.api, //"kakao", "naver",
    };
  }
  //region 뒤로가기막기
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    userStore.asyncUser();
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }
  handleBackButton() {
    //ToastAndroid.show("Back button is pressed", ToastAndroid.SHORT);
    return true;
  }
  //endregion 뒤로가기막기
  webViewEnd = async (event, props) => {
    //console.log(this.props.route.params.uri);
    const result = JSON.parse(event.nativeEvent.data);
    if (result.status === "success") {
      // 성공적 네이버 로그인 완료
      //네이버 고유아이디번호로 토큰을 전달
      if (this.state.api == "naver") {
        const config = {
          headers: { Authorization: `Bearer ${result.token}` },
        };
        const { data } = await axios.get(
          "https://openapi.naver.com/v1/nid/me",
          config
        );
        //유저가없을 경우 회원가입페이지로 감
        userStore.getUser(data.response.id).then(async (isUser) => {
          if (isUser == null) {
            alert("회원가입으로 넘어갑니다.");
            this.props.navigation.navigate("이용동의", {
              token: data.response.id,
            });
          } else {
            this.props.navigation.navigate("loading");
            userStore.loginToken(data.response.id);
          }
        });
      } else if (this.state.api == "kakao") {
        //카카오 고유아이디번호로 토큰을 전달
        const config = {
          headers: { Authorization: `Bearer ${result.token}` },
        };
        const { data } = await axios.get(
          "https://kapi.kakao.com/v2/user/me",
          config
        );
        //유저가없을 경우 회원가입페이지로 감
        userStore.getUser(data.id).then(async (isUser) => {
          if (isUser == null) {
            alert("회원가입으로 넘어갑니다.");
            this.props.navigation.navigate("이용동의", {
              token: data.id,
            });
          } else {
            this.props.navigation.navigate("loading");
            userStore.loginToken(data.id);
          }
        });
      }
    } else {
      props.route.params.loginFail();
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <WebView
          ref={(ref) => (this.webview = ref)}
          source={{ uri: this.state.url }}
          useWebKit={true}
          onMessage={(event) => this.webViewEnd(event, this.props)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
