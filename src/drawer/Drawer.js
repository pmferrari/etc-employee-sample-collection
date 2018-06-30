// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, StyleSheet, Image, TouchableOpacity, SafeAreaView} from "react-native";
import {Button, H1, Icon, Text} from "native-base";
import { moderateScale } from 'react-native-size-matters';
import { logoutUser } from '../helpers/etcAPI';

import {Avatar, Images, NavigationHelpers, WindowDimensions, Styles} from "../components";

import type {NavigationProps} from "../components/Types";

import variables from "../../native-base-theme/variables/commonColor";

export default class Drawer extends React.Component<NavigationProps<>> {

    go(key: string) {
        this.props.navigation.navigate(key);
    }

    @autobind
    logout() {
        logoutUser().then(() => {
            NavigationHelpers.reset(this.props.navigation, "Login");
        });
    }

    @autobind
    close() {
        this.go("DrawerClose");
    }

    @autobind
    profile() {
        this.go("Profile");
    }

    render(): React.Node {
        const navState = this.props.navigation.state;
        const currentIndex = navState.index;
        const items = navState.routes
            .filter(route => ["Settings", "Create"].indexOf(route.key) === -1)
            .map((route, i) => {
                if (route.key !== "Jobs") {
                    return(<DrawerItem key={i} label={route.key} active={currentIndex === i} />)
                } else {
                    return(<DrawerItem key={i} onPress={() => this.go(route.key)} label={route.key} active={currentIndex === i} />)
                }
            });
        //
        return (
            <View style={Styles.flexGrow}>
                <Image source={Images.drawer} style={[StyleSheet.absoluteFill, style.img]} />
                <View style={[StyleSheet.absoluteFill, style.background]} />
                <SafeAreaView style={StyleSheet.absoluteFill}>
                    <View style={style.container}>
                        <View style={style.header} >
                            <Button transparent onPress={this.close} style={style.closeBtn}>
                                <Icon name="ios-close-outline" style={style.closeIcon} />
                            </Button>
                            {/* <Button transparent onPress={this.profile} style={{ height: 60 }}>
                                <Avatar size={50} style={{ marginTop: 12 }} />
                            </Button> */}
                        </View>
                        <View style={style.drawerItemsContainer}>
                            <View style={style.drawerItems}>{items}</View>
                        </View>
                        <View style={style.row}>
                            <DrawerIcon label="settings" icon="ios-settings-outline" onPress={() => this.go("Settings")} />
                            <DrawerIcon label="log out" icon="ios-log-out-outline" onPress={this.logout} />
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        );
    }
}

type DrawerItemProps = {
    label: string,
    onPress: () => void,
    active?: boolean
};

class DrawerItem extends React.Component<DrawerItemProps> {
    render(): React.Element<React.ComponentType<Button>> {
        const {label, onPress, active} = this.props;
        return <Button onPress={onPress} full transparent>
            <H1 style={[{color: active ? "white" : "rgba(255, 255, 255, .5)"}, style.drawerItemTitle]}>{label}</H1>
        </Button>;
    }
}

type DrawerIconProps = {
    label: string,
    icon: string,
    onPress: () => void
};

class DrawerIcon extends React.Component<DrawerIconProps> {
    render(): React.Element<React.ComponentType<Button>> {
        const {label, icon, onPress} = this.props;
        return <TouchableOpacity style={style.drawerIconWrapper} onPress={onPress}>
            <Icon name={icon} style={style.drawerIcon} />
            <Text style={style.iconText}>{label.toUpperCase()}</Text>
        </TouchableOpacity>;
    }
}

const style = StyleSheet.create({
    img: {
        ...WindowDimensions
    },
    container: {
        flexGrow: 1,
        justifyContent: "space-between"
    },
    header: {
        backgroundColor: "transparent",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    background: {
        backgroundColor: "rgba(101, 99, 164, .9)"
    },
    mask: {
        color: "rgba(255, 255, 255, .5)"
    },
    closeIcon: {
        fontSize: moderateScale(50),
        color: "rgba(255, 255, 255, .5)"
    },
    closeBtn: {
        height: moderateScale(45),
        paddingTop: moderateScale(6),
        paddingBottom: moderateScale(6),
        paddingLeft: moderateScale(16),
        paddingRight: moderateScale(16),
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: variables.contentPadding * 2
    },
    drawerItemsContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: variables.contentPadding * 6
    },
    drawerItems: {
        flex: 1,
        justifyContent: "space-between"
    },
    drawerItemTitle: {
        fontSize: moderateScale(27),
        lineHeight: moderateScale(37)
    },
    drawerIconWrapper: {
        justifyContent: "center",
        alignItems: "center"
    },
    drawerIcon: {
        color: "rgba(255, 255, 255, .5)",
        padding: variables.contentPadding,
        fontSize: moderateScale(30)
    },
    iconText: {
        color: "white",
        fontSize: moderateScale(12)
    }
});
