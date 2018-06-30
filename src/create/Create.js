// @flow
import moment from "moment";
import * as React from "react";
import {StyleSheet, View, Text} from "react-native";
import {H1, ListItem, Body, Right, Icon} from "native-base";

import {BaseContainer, Styles, Avatar, Field, Small} from "../components";

import type {ScreenProps} from "../components/Types";

import variables from "../../native-base-theme/variables/commonColor";

export default class Create extends React.Component<ScreenProps<>> {

    render(): React.Node {
        const now = moment();
        return <BaseContainer title="Create New" navigation={this.props.navigation} scrollable>
            <View style={[Styles.header, Styles.center, style.header]}>
                <H1>Add Title</H1>
                <Small>ADD DESCRIPTION</Small>
            </View>
            <Field
                label="Date"
                defaultValue={now.format("dddd, MMMM Do YYYY")}
                right={() => <Icon name="ios-add-outline" style={style.icon} />}
            />
            <Field
                label="Time"
                defaultValue={now.format("h:mm a")}
                right={() => <Icon name="ios-add-outline" style={style.icon} />}
            />
            <Field
                label="Location"
                defaultValue="Starbucks"
                right={() => <Icon name="ios-pin-outline" style={style.icon}  />}
            />
            <ListItem last>
                <Body>
                    <Text style={{ fontSize: variables.inputFontSize }}>Add People</Text>
                </Body>
                <Right style={style.avatars}>
                    <Avatar id={2} size={30} style={style.avatar} />
                    <Avatar id={3} size={30} />
                </Right>
            </ListItem>
        </BaseContainer>;
    }
}

const style = StyleSheet.create({
    header: {
        backgroundColor: variables.lightGray
    },
    icon: {
        color: variables.brandInfo,
        fontSize: 30
    },
    avatars: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    avatar: {
        marginRight: variables.contentPadding / 2
    }
});
