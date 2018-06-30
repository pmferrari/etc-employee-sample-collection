// @flow
import * as React from "react";
import {Dimensions, AsyncStorage} from "react-native";
import {StyleProvider, Root} from "native-base";
import {StackNavigator, DrawerNavigator} from "react-navigation";
import {Font, AppLoading} from "expo";
import {useStrict} from "mobx";

import {Images} from "./src/components";
import {Login} from "./src/login";
import {SignUp} from "./src/sign-up";
import {Walkthrough} from "./src/walkthrough";
import {Drawer} from "./src/drawer";
import {Home} from "./src/home";
import {Calendar} from "./src/calendar";
import {Overview} from "./src/overview";
import {MaterialOverview} from "./src/materialOverview";
import {SampleOverview} from "./src/sampleOverview";
import {RoomOverview} from "./src/roomOverview";
import {Groups} from "./src/groups";
import {Lists} from "./src/lists";
import {Profile} from "./src/profile";
import {Jobs} from "./src/jobs";
import {Timeline} from "./src/timeline";
import {Settings} from "./src/settings";
import {Create} from "./src/create";

import getTheme from "./native-base-theme/components";
import variables from "./native-base-theme/variables/commonColor";
import {parseLocalData, generateDropdownConfig} from "./src/helpers/etcAPI";

type AppState = { ready: boolean };

export default class App extends React.Component<{}, AppState> {
    componentWillMount() {
        this.setState({ ready: false });
        const promises = [];
        const localData = ['clientJobs', 'lastAPICallTimestamp', 'loggedIn',
                           'userProfile', 'seenWalkthrough', 'materialsConfig',
                           'dropdownConfig'];
        promises.push(
            Font.loadAsync({
                "Avenir-Book": require("./fonts/Avenir-Book.ttf"),
                "Avenir-Light": require("./fonts/Avenir-Light.ttf")
            }),
            AsyncStorage.multiGet(localData, parseLocalData)
        );
        Promise.all(promises.concat(Images.downloadAsync()))
            .then(() => {
                generateDropdownConfig().then(() => {
                    this.setState({ ready: true })
                })
            })
            // eslint-disable-next-line
            .catch(error => console.error(error))
        ;
    }

    render(): React.Node {
        const {ready} = this.state;
        return <StyleProvider style={getTheme(variables)}>
          <Root>
            {
                ready ?
                    <AppNavigator onNavigationStateChange={() => undefined} />
                :
                    <AppLoading startAsync={null} onError={null} onFinish={null} />
            }
          </Root>
        </StyleProvider>;
    }
}

useStrict(true);

const StackNavigatorOptions = {
    headerMode: "none",
    cardStyle: {
        backgroundColor: "white"
    }
};

const JobNavigator = StackNavigator({
    Jobs: { screen: Jobs },
    Overview: { screen: (props) => <Overview {...props} propName={"job"} /> },
    MaterialOverview: { screen: (props) => <MaterialOverview {...props} propName={"material"} /> },
    RoomOverview: { screen: (props) => <RoomOverview {...props} propName={"room"} /> },
    SampleOverview: { screen: (props) => <SampleOverview {...props} propName={"sample"} /> }
    // Main: { screen: MainNavigator }
}, { headerMode: 'none' } );

const MainNavigator = DrawerNavigator({
    // Home: { screen: Home },
    Jobs: { screen: JobNavigator },
    // "Asbestos Survey": { screen: Calendar },
    // "Lead Sampling": { screen: Groups },
    // Lists: { screen: Lists },
    // Profile: { screen: Profile },
    // Timeline: { screen: Timeline },
    Settings: { screen: Settings },
    // Create: { screen: Create }
}, {
    drawerWidth: Dimensions.get("window").width,
    contentComponent: Drawer
});

const AppNavigator = StackNavigator({
    Login: { screen: Login },
    // SignUp: { screen: SignUp },
    Walkthrough: { screen: Walkthrough },
    Main: { screen: MainNavigator }
}, StackNavigatorOptions);

export {AppNavigator};
