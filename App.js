import React from "react";
import Navigation from "./App/component/Navigation";
import { enableScreens } from "react-native-screens";

enableScreens();
export default class App extends React.Component {
  //props 값들 초기화
  constructor(props) {
    super(props);
    this.state = {};
    //this.setState({color : nextProps.color});
  }

  componentDidMount() {
    //#region firebase init
    const firebase = require("firebase");
    try {
      const firebaseConfig = {
        apiKey: "AIzaSyAUiJslfRwp0zPIOpu1I-4Xnls7xW-aKnM",
        authDomain: "campustaxi-b0e6c.firebaseapp.com",
        databaseURL: "https://campustaxi-b0e6c.firebaseio.com",
        projectId: "campustaxi-b0e6c",
        storageBucket: "campustaxi-b0e6c.appspot.com",
        messagingSenderId: "1054249413075",
        appId: "1:1054249413075:web:21f8f04c9933fe4cde2726",
        measurementId: "G-LH1WFX6SNM",
      };
      firebase.initializeApp(firebaseConfig);
    } catch (error) {
      console.log(error);
    }
    //#endregion
  }

  render() {
    //#region ERROR Solution: Setting a timer for a long period of time, i.e. multiple minutes,
    const _setTimeout = global.setTimeout;
    const _clearTimeout = global.clearTimeout;
    const MAX_TIMER_DURATION_MS = 60 * 1000;
    if (Platform.OS === "android") {
      // Work around issue `Setting a timer for long time`
      // see: https://github.com/firebase/firebase-js-sdk/issues/97
      const timerFix = {};
      const runTask = (id, fn, ttl, args) => {
        const waitingTime = ttl - Date.now();
        if (waitingTime <= 1) {
          InteractionManager.runAfterInteractions(() => {
            if (!timerFix[id]) {
              return;
            }
            delete timerFix[id];
            fn(...args);
          });
          return;
        }

        const afterTime = Math.min(waitingTime, MAX_TIMER_DURATION_MS);
        timerFix[id] = _setTimeout(() => runTask(id, fn, ttl, args), afterTime);
      };

      global.setTimeout = (fn, time, ...args) => {
        if (MAX_TIMER_DURATION_MS < time) {
          const ttl = Date.now() + time;
          const id = "_lt_" + Object.keys(timerFix).length;
          runTask(id, fn, ttl, args);
          return id;
        }
        return _setTimeout(fn, time, ...args);
      };

      global.clearTimeout = (id) => {
        if (typeof id === "string" && id.startsWith("_lt_")) {
          _clearTimeout(timerFix[id]);
          delete timerFix[id];
          return;
        }
        _clearTimeout(id);
      };
    }
    //#endregion
    return <Navigation />;
  }
}
