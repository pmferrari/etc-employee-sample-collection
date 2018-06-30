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

type MaterialProps = {
    materialNumber: Number,
    name: String,
    classification: String,
    materialSub: String,
    clientMaterialId: String,
    size: String,
    color: String,
    friable: String,
    note1: String,
    note2: String,
    samples: Array,
    rooms: Array,
    quantity: Number,
    editable: Boolean,
    assumed: Boolean,
    jobId: String,
    materialUpdate: Function,
    navigation: Function
};

// need to get a map of material name to its #, sub categories, friable, etc.

@observer
export default class Material extends React.Component<MaterialProps> {

    @observable material = this.props;

    goToMaterialOverview() {
        console.log('traveling to material overview!');
        this.props.navigation.navigate("MaterialOverview", {
            material: this.props,
            editable: this.props.editable,
            jobId: this.props.jobId,
            materialUpdate: this.props.materialUpdate
        });
    }

    @observer
    render(): React.Node {
        const {name, samples, materialSub, timeline, editable, samplesNeeded, assumed,
               clientMaterialId} = this.props;
        const displayMaterialSub = _.startCase(_.toLower(materialSub));
        const backgroundColor = editable ? variables.white : variables.mediumGray;
        const height = moderateScale(100);
        return <ListItem style={[Styles.listItem, { height, backgroundColor }]} button onPress={() => {this.goToMaterialOverview()}}>
            {
                timeline && <MaterialStatus {...{ timeline, samples, height }} />
            }
            <View style={style.time}>
                <Text style={[style.gray, style.monthPrefix]}>Material Id</Text>
                <H3 style={style.days}>{String(clientMaterialId)}</H3>
            </View>
            <View style={style.title}>
                <H3 style={style.name}>{name}</H3>
                <Text style={[style.gray, style.materialSub]}>{displayMaterialSub}, {String(samples.length)} Samples</Text>
            </View>
            {
                !timeline && <MaterialStatus {...{ samples, height, assumed, samplesNeeded }} />
            }
      </ListItem>
    }
}

type MaterialStatusProps = {
    timeline?: boolean,
    samples: array,
    samplesNeeded: number,
    height: number,
    assumed: boolean
};

@observer
class MaterialStatus extends React.Component<MaterialStatusProps> {

    @observer
    determineColor() {
      if (this.props.assumed) {
          return variables.jobCompleted;
      } else if (this.props.samples.length < this.props.samplesNeeded)
          return variables.jobSubmitted;
      else { // if (this.props.samples.length >= samplesNeeded)
          return variables.jobCompleted;
      }
    }

    @observer
    render(): React.Node {
        const {timeline, height} = this.props;
        return <View style={[style.doublePadding, Styles.center]}>
            {
                timeline && <View style={[{ height }, style.verticalLine]}></View>
            }
            <Circle size={moderateScale(10)} color={ this.determineColor() }/>
        </View>;
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
