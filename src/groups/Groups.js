// @flow
import * as React from "react";
import {StyleSheet, View, Image, Dimensions} from "react-native";
import {H1} from "native-base";

import {BaseContainer, Images, Small, Styles} from "../components";

import type {ScreenProps} from "../components/Types";

import variables from "../../native-base-theme/variables/commonColor";

export default class Groups extends React.Component<ScreenProps<>> {
    render(): React.Node {
        return <BaseContainer title="Groups" navigation={this.props.navigation} scrollable>
            <Group title="Food" description="Need to Buy" picture={Images.foodGroup} />
            <Group title="Work" description="Freelance Projects" picture={Images.workGroup} />
            <Group title="Vacation" description="Favorite Places" picture={Images.vacationGroup} />
            <Group title="Cities" description="Want to Visit" picture={Images.citiesGroup} />
        </BaseContainer>;
    }
}

type GroupProps = {
    title: string,
    description: string,
    picture: number
};

class Group extends React.Component<GroupProps> {
    render(): React.Node {
        const {title, description, picture} = this.props;
        return <View style={[Styles.listItem, style.group]} last>
            <View style={style.text}>
                <H1>{title}</H1>
                <Small>{description.toUpperCase()}</Small>
            </View>
            <Image source={picture} style={style.img} />
        </View>;
    }
}

const {width} = Dimensions.get("window");
const style = StyleSheet.create({
    group: {
        backgroundColor: variables.lightGray,
        justifyContent: "space-between"
    },
    text: {
        paddingLeft: variables.contentPadding * 2,
        justifyContent: "center"
    },
    img: {
        width: width * .32,
        height: width * .32 * 302 / 240,
        resizeMode: "cover"
    }
});
