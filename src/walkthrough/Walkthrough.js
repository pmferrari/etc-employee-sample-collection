// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, Text, SafeAreaView} from "react-native";
import {Header, Body, Left, Right, Title, Button} from "native-base";
import CarouselCard from "react-native-card-carousel";

import IntroCard from "./IntroCard";

import {Styles, NavigationHelpers} from "../components";

import variables from "../../native-base-theme/variables/commonColor";
import { syncWalkthroughUpdate } from '../helpers/etcAPI';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

import type {ScreenProps} from "../components/Types";

type Card = { color: string, label: string};
type Cards = Card[];

export default class Walkthrough extends React.Component<ScreenProps<>> {
    cards: Cards = [
        {
            step: 1,
            color: variables.brandPrimary,
            label: "Create Jobs for yourself or your clients",
            icon: "ios-create-outline" // Ionicon
        },
        {
            step: 2,
            color: variables.brandSecondary,
            label: "Add Materials to your job, and see how many samples you need for each",
            icon: "playlist-add" // MaterialIcon
        },
        {
            step: 3,
            color: variables.brandInfo,
            label: "Add Samples for each Material, then submit your job!",
            icon: "ios-send-outline" //Ionicon
        }
    ];

    @autobind
    async home() {
        await syncWalkthroughUpdate(true);
        NavigationHelpers.reset(this.props.navigation, "Main");
    }

    render(): React.Node {
        return <SafeAreaView style={Styles.flexGrow}>
            <Header noShadow>
                <Left />
                <Body>
                    <Title>Walkthrough</Title>
                </Body>
                <Right />
            </Header>
            <View style={[Styles.bg, Styles.center, Styles.flexGrow]}>
                <CarouselCard
                    data={this.cards}
                    onPress={() => true}
                    contentRender = {(card: Card) => <IntroCard {...card} />}
                />
                <View style={[{marginTop: variables.contentPadding}, Styles.center]}>
                    <Button onPress={this.home} light style={{marginTop: moderateScale(10)}}>
                        <Text style={Styles.pickerLabel}>Got it</Text>
                    </Button>
                </View>
            </View>
        </SafeAreaView>;
    }
}
