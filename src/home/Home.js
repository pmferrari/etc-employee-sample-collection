// @flow
import moment from "moment";
import * as React from "react";
import {Text, Image, StyleSheet, View} from "react-native";
import {H1} from "native-base";

import {BaseContainer, Circle, Styles, Images, WindowDimensions} from "../components";

import type {ScreenProps} from "../components/Types";

import variables from "../../native-base-theme/variables/commonColor";

export default class Home extends React.Component<ScreenProps<>> {

    go(key: string) {
        this.props.navigation.navigate(key);
    }

    render(): React.Node {
        const today = moment();
        const month = today.format("MMMM Y").toUpperCase();
        const dayOfMonth = today.format("D");
        const dayOfWeek = today.format("dddd").toUpperCase();
        const {navigation} = this.props;
        //
        return <BaseContainer title="" {...{ navigation }}>
            <View style={[Styles.flexGrow, Styles.center]}>
                <Image source={Images.home} style={[StyleSheet.absoluteFill, style.img]} />
                <H1>Good Morning!</H1>
                <Circle color={variables.brandInfo} size={150} style={style.circle}>
                    <Circle color={variables.brandPrimary} size={30} style={style.badge}>
                        <Text style={style.text}>8</Text>
                    </Circle>
                    <Text style={[style.text, { fontSize: 48 }]}>{dayOfMonth}</Text>
                    <Text style={style.text}>{dayOfWeek}</Text>
                </Circle>
                <Text>{month}</Text>
            </View>
        </BaseContainer>;
    }
}

const style = StyleSheet.create({
    img: {
        ...WindowDimensions
    },
    circle: {
        marginVertical: variables.contentPadding * 4
    },
    badge: {
        position: "absolute",
        right: 10,
        top: 10
    },
    text: {
        fontFamily: variables.titleFontfamily,
        color: "white"
    }
});
