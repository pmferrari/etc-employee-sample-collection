// @flow
import * as React from "react";
import {View} from "react-native";
import {H1} from "native-base";

import {BaseContainer, Avatar, TaskOverview, Small, Styles, Task} from "../components";

import variables from "../../native-base-theme/variables/commonColor";

import type {ScreenProps} from "../components/Types";

export default class Profile extends React.Component<ScreenProps<>> {
    render(): React.Node {
        return <BaseContainer title="Profile" navigation={this.props.navigation} scrollable>
            <View style={[Styles.header, Styles.whiteBg, Styles.center]}>
                <Avatar size={100} />
                <H1 style={{ marginTop: variables.contentPadding * 2 }}>Good Job, Marie!</H1>
                <Small>{"You haven't missed any tasks this week."}</Small>
            </View>
            <TaskOverview completed={16} overdue={0} />
            <Task date="2015-05-08 08:30" title="New Icons" subtitle="Mobile App" completed={true} />
            <Task date="2015-05-08 14:00" title="Finish Home Screen" subtitle="Home App" completed={true} />
            <Task date="2015-05-08 16:45" title="Revise Wireframe" subtitle="Company Website" completed={true} />
        </BaseContainer>;
    }
}
