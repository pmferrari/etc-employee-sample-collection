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

type SampleProps = {
    sampleId: String,
    clientSampleId: String,
    sampleLocation: Number,
    // pictureNumbers: String,
    jobId: String,
    materialId: String,
    editable: Boolean,
    updateSample: Function
};

// need to get a map of material name to its #, sub categories, friable, etc.

@observer
export default class Sample extends React.Component<SampleProps> {

    @observable sample = this.props;

    goToSampleOverview() {
        console.log('traveling to sample overview!');
        this.props.navigation.navigate("SampleOverview", { sample: this.props, updateSample: this.props.updateSample });
    }

    @observer
    render(): React.Node {
        const {sampleLocation, clientSampleId, editable} = this.props;
        // console.log(this.props);
        const displaySampleLocation = _.startCase(_.toLower(sampleLocation));
        const backgroundColor = editable ? variables.white : variables.mediumGray;
        const height = moderateScale(100);
        return <ListItem
                  style={[Styles.listItem, { height, backgroundColor }]}
                  button
                  onPress={() => {this.goToSampleOverview()}}>
            <View style={style.time}>
                <Text style={[style.gray, style.monthPrefix]}>SAMPLE</Text>
                <H3 style={style.days}>{clientSampleId}</H3>
            </View>
            <View style={style.title}>
                <H3 style={style.name}>{displaySampleLocation}</H3>
                {/* <Text style={[style.gray, style.materialSub]}>Picture Numbers: {pictureNumbers}</Text> */}
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
