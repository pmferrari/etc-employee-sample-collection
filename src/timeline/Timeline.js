// @flow
import moment from "moment";
import * as React from "react";
import {StyleSheet, Image, View, Text} from "react-native";
import {H1} from "native-base";

import {BaseContainer, Styles, Images, Avatar, Task} from "../components";

import variables from "../../native-base-theme/variables/commonColor";

import type {ScreenProps} from "../components/Types";

export default class Timeline extends React.Component<ScreenProps<>> {

    render(): React.Node {
        const {navigation} = this.props;
        return <BaseContainer title="Timeline" {...{navigation}} scrollable>
            <View style={[Styles.imgMask, Styles.center, Styles.flexGrow]}>
                <Image source={Images.timeline} style={Styles.header} />
                <View style={[StyleSheet.absoluteFill, Styles.imgMask]} />
                <View style={[StyleSheet.absoluteFill, Styles.center]}>
                    <Avatar size={50} />
                    <H1 style={style.heading}>{moment().format("MMMM")}</H1>
                    <Text style={Styles.whiteText}>69 EVENTS</Text>
                </View>
            </View>
            <Task date="2015-05-08 09:30" title="New Icons" subtitle="Mobile App" completed timeline />
            <Task
                date="2015-05-08 11:00"
                title="Design Stand Up"
                subtitle="Hangouts"
                collaborators={[1, 2, 3]}
                timeline
            />
            <Task date="2015-05-08 14:00" title="New Icons" subtitle="Home App" completed timeline />
            <Task date="2015-05-08 16:00" title="Revise Wireframes" subtitle="Company Website" completed timeline />
        </BaseContainer>;
    }
}

const style = StyleSheet.create({
    heading: {
        marginTop: variables.contentPadding * 2,
        color: "white"
    }
});
