// @flow
import * as React from "react";
import {View, Text, StyleSheet} from "react-native";
import {Icon, Card, MaterialIcon} from "native-base";

import {Styles} from "../components";

import variables from "../../native-base-theme/variables/commonColor";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

class Row extends React.Component<{}> {

    render(): React.Node {
        return <View style={styles.row}>
            <Icon name="ios-checkmark-circle-outline" style={{ color: variables.white, fontSize: moderateScale(30) }} />
            <View style={styles.rowContainer}>
                <View style={styles.rowTopLine} />
                <View style={styles.rowBottomLine} />
            </View>
        </View>;
    }
}

type IntroCardProps = {
    color: string,
    label: string,
    icon: string,
    step: number
};

export default class IntroCard extends React.Component<IntroCardProps> {

    render(): React.Node {
        const {color, label, icon, step} = this.props;
        return <Card style={{ flex: 1 }}>
            <View style={[{ backgroundColor: color, flex: 0.75}, Styles.center]}>
                <View>
                {
                    step === 2 && [1, 2, 3].map(key => <Row key={key} />)
                }
                {
                    step !== 2 && <Icon name={icon} style={styles.iconStyle} />
                }
                </View>
            </View>
            <View style={[{ flex: 0.25 }, Styles.center]}>
                <Text style={[Styles.textCentered, styles.walkthroughLabel]}>{label}</Text>
            </View>
        </Card>;
    }
}

const styles = StyleSheet.create(
    {
        row: {
            flexDirection: "row",
            marginBottom: moderateScale(variables.contentPadding)
        },
        rowContainer: {
            marginLeft: moderateScale(variables.contentPadding)
        },
        rowTopLine: {
            borderTopWidth: moderateScale(1),
            borderColor: "white",
            marginBottom: moderateScale(10),
            marginTop: moderateScale(10),
            width: moderateScale(150)
        },
        rowBottomLine: {
            borderTopWidth: moderateScale(1),
            borderColor: "white",
            width: moderateScale(100)
        },
        walkthroughLabel: {
            padding: variables.contentPadding,
            fontSize: moderateScale(16),
            lineHeight: moderateScale(20)
        },
        iconStyle: {
            color: variables.white,
            fontSize: moderateScale(80)
        }
    }
);
