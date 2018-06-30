// @flow
import * as React from "react";
import autobind from "autobind-decorator";
import {StyleSheet, View, Text} from "react-native";
import {H1} from "native-base";
import { observable, action, computed, runInAction, autorun } from "mobx";
import { observer } from "mobx-react/native";

import Styles from "./Styles";

import variables from "../../native-base-theme/variables/commonColor";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

type RequirementsOverviewProps = {
    job: object
};

@observer
export default class RequirementsOverview extends React.Component<RequirementsOverviewProps> {

    @autobind
    numberCollected(classification: String, minPerMaterial: Number) {
        const response = {};
        numCollected = 0;
        adjustedMin = 0;
        for (material of this.props.job.materials) {
            if (material.classification.toLowerCase() === classification.toLowerCase()
                && !material.assumed) {
                adjustedMin++;
                numCollected += material.samples !== undefined ? material.samples.length : 0;
            }
        }
        response.adjustedMin = String(adjustedMin * minPerMaterial);
        response.numCollected = String(numCollected);
        return response;
    }

    @autobind
    calculateColor(data: Object) {
        if (data.numCollected >= data.adjustedMin) {
            return variables.brandInfo;
        } else {
          return variables.brandSecondary;
        }
    }

    render(): React.Node {
        const {minSurfacing, minThermal, minMisc} = this.props.job;
        const surfacingData = this.numberCollected("S", minSurfacing);
        const thermalData = this.numberCollected("T", minThermal);
        const miscData = this.numberCollected("M", minMisc);
        const surfaceColor = this.calculateColor(surfacingData);
        const thermalColor = this.calculateColor(thermalData);
        const miscColor = this.calculateColor(miscData);
        return <View style={{ flexDirection: "row" }}>
            <View style={[style.count, Styles.center, { backgroundColor: surfaceColor }]}>
                <Text style={[Styles.whiteText, style.subtext]}>SURFACING</Text>
                <H1 style={style.heading}>{surfacingData.numCollected}</H1>
                <Text style={[Styles.whiteText, style.subtext]}>OUT OF {surfacingData.adjustedMin}</Text>
            </View>
            <View style={[style.count, Styles.center, { backgroundColor: thermalColor }]}>
                <Text style={[Styles.whiteText, style.subtext]}>THERMAL</Text>
                <H1 style={style.heading}>{thermalData.numCollected}</H1>
                <Text style={[Styles.whiteText, style.subtext]}>OUT OF {thermalData.adjustedMin}</Text>
            </View>
            <View style={[style.count, Styles.center, { backgroundColor: miscColor }]}>
                <Text style={[Styles.whiteText, style.subtext]}>MISC</Text>
                <H1 style={style.heading}>{miscData.numCollected}</H1>
                <Text style={[Styles.whiteText, style.subtext]}>OUT OF {miscData.adjustedMin}</Text>
            </View>
        </View>;
    }
}

const padding = variables.contentPadding * 2;
const style = StyleSheet.create({
    count: {
        flex: .5,
        padding: moderateScale(padding)
    },
    heading: {
        color: "white",
        paddingTop: moderateScale(5),
        paddingBottom: moderateScale(5),
        fontSize: moderateScale(27),
        lineHeight: moderateScale(37)
    },
    subtext: {
        fontSize: moderateScale(13),
        lineHeight: moderateScale(17)
    }
});
