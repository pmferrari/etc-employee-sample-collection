// @flow
import * as React from "react";
import {View, StyleSheet} from "react-native";
import {LinearGradient} from "expo";

import commonColor from "../../native-base-theme/variables/commonColor";

const getStyle = (size: number)  => {
    return {
        width: size,
        height: size,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: size / 2
    }
}

export default class Mark extends React.Component<{}> {

    render(): React.Node {
        return <View style={[getStyle(230), {borderColor: "rgba(255, 255, 255, .3)", borderWidth: 2 }]}>
            <View style={[getStyle(210), { borderColor: "rgba(255, 255, 255, .5)", borderWidth: 2 }]}>
                <View style={[getStyle(180), { borderColor: "white", borderWidth: 2 }]}>
                    <View style={[getStyle(150), { backgroundColor: commonColor.white }]}>
                        <View style={styles.checkmark}>
                            <LinearGradient
                                colors={["rgba(0, 0, 0, 0.5)", "rgba(255, 255, 255, 0)"]}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.leftPart}
                            />
                            <View style={styles.rightPart} />
                        </View>
                    </View>
                </View>
            </View>
        </View>;
    }
}

const width = 13;
const height = 45;
const styles = StyleSheet.create({
    checkmark: {
        transform: [
            { translateY: -width / Math.sqrt(2) * 0.5 },
            { translateX: -width / Math.sqrt(2) * 0.5 },
            { rotate: "-135deg" }
        ]
    },
    leftPart: {
        backgroundColor: commonColor.brandPrimary,
        borderRadius: 3,
        width: height,
        height: width,
        transform: [{ translateY: width }]
    },
    rightPart: {
        backgroundColor: commonColor.brandPrimary,
        borderRadius: 3,
        width: width,
        height: height * 1.59,
        transform: [],
        borderTopRightRadius: 0
    }
});
