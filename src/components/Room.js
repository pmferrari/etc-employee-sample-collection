// @flow
import autobind from "autobind-decorator";
import moment from "moment";
import * as React from "react";
import {View, Text, StyleSheet} from "react-native";
import {H3, ListItem} from "native-base";
import {observable, action, computed} from "mobx";
import {observer} from "mobx-react/native";

import {Avatar, Styles} from "../components";

import variables from "../../native-base-theme/variables/commonColor";
import Circle from "../components/Circle";
import { moderateScale } from 'react-native-size-matters';
import { toastHelper } from '../helpers/etcAPI';

type RoomProps = {
    jobId: String,
    materialId: String,
    editable: Boolean,
    updateRoom: Function,
    room: Object,
    navigation: Object,
    index: Number
};

// need to get a map of material name to its #, sub categories, friable, etc.

@observer
export default class Room extends React.Component<RoomProps> {

    @observable room = this.props.room;

    @autobind
    goToRoomOverview() {
        console.log('traveling to room overview!');
        this.props.navigation.navigate("RoomOverview", {
          room: this.props.room,
          updateRoom: this.props.updateRoom,
          editable: this.props.editable,
          index: this.props.index,
          materialId: this.props.materialId,
          jobId: this.props.jobId
        });
    }

    @observer
    render(): React.Node {
        const {editable} = this.props;
        const backgroundColor = editable ? variables.white : variables.mediumGray;
        const height = moderateScale(100);
        return <ListItem
                  style={[Styles.listItem, { height, backgroundColor }]}
                  button
                  onPress={() => {this.goToRoomOverview()}}>
            <View style={style.time}>
                <Text style={[style.gray, style.monthPrefix]}>FLOOR</Text>
                <H3 style={style.days}>{this.props.room.floor}</H3>
            </View>
            <View style={style.title}>
                <H3 style={style.name}>Room {String(this.props.room.room)}</H3>
            </View>
      </ListItem>
    }
}

const style = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center"
    },
    doublePadding: {
        padding: variables.contentPadding * 2
    },
    gray: {
        color: variables.gray
    },
    avatar: {
        marginTop: variables.contentPadding,
        marginRight: variables.contentPadding
    },
    verticalLine: {
        borderLeftWidth: variables.borderWidth,
        borderColor: variables.listBorderColor,
        position: "absolute"
    },
    time: {
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        padding: moderateScale(variables.contentPadding)
    },
    title: {
        justifyContent: "center",
        flex: 1,
        padding: moderateScale(variables.contentPadding)
    },
    monthPrefix: {
        fontSize: moderateScale(14),
        lineHeight: moderateScale(18, 0.4)
    },
    days: {
        fontSize: moderateScale(21),
        lineHeight: moderateScale(33)
    },
    name: {
        fontSize: moderateScale(21),
        lineHeight: moderateScale(33)
    },
    materialSub: {
        fontSize: moderateScale(14),
        lineHeight: moderateScale(18),
        color: variables.gray
    }
});
