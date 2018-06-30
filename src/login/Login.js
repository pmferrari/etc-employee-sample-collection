// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, Image, StyleSheet, SafeAreaView} from "react-native";
import {H1, Button, Text, Input, Content} from "native-base";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import {observable, action, runInAction} from "mobx";
import { observer } from "mobx-react/native";

import {Constants} from "expo";

import Mark from "./Mark";

import {Small, Styles, Images, Field, NavigationHelpers, WindowDimensions, ETCSpinner} from "../components";
import {AnimatedView} from "../components/Animations";

import variables from "../../native-base-theme/variables/commonColor";
import { login, loggedIn, seenWalkthrough } from '../helpers/etcAPI';

import type {ScreenProps} from "../components/Types";

export default class Login extends React.Component<ScreenProps<>> {

    password: Input;
    client_id: Input;
    @observable loading = false;

    @autobind
    setPasswordRef(input: Input) {
        this.password = input._root;
    }

    @autobind
    setClientIdRef(input: Input) {
        this.client_id = input._root;
    }

    @autobind
    goToPassword() {
        this.password.focus();
    }

    @autobind
    async signIn() {
        await runInAction("Updating Loading", async () => {
            this.loading = true;
        });
        const successful = await login(this.client_id.props.value, this.password.props.value);
        await runInAction("Updating Loading", async () => {
            this.loading = false;
            if (successful && seenWalkthrough) {
                NavigationHelpers.reset(this.props.navigation, "Main");
            } else if (successful && !seenWalkthrough) {
                NavigationHelpers.reset(this.props.navigation, "Walkthrough");
            }
        });

    }

    @autobind
    signUp() {
        this.props.navigation.navigate("SignUp");
    }

    componentWillMount() {
        console.log('logged in: ' + String(loggedIn));
        if (loggedIn) {
            NavigationHelpers.reset(this.props.navigation, "Main");
        }
    }

    @observer
    render(): React.Node {

        return (
            <View style={Styles.flexGrow}>
                <ETCSpinner visible={this.loading} />
                <Image source={Images.login} style={[StyleSheet.absoluteFill, style.img]} />
                <View source={Images.login} style={[StyleSheet.absoluteFill, Styles.imgMask]} />
                    <SafeAreaView style={StyleSheet.absoluteFill}>
                        <Content style={[StyleSheet.absoluteFill, style.content]}>
                            <AnimatedView
                                style={{ height: height - Constants.statusBarHeight, justifyContent: "center" }}
                            >
                            <View style={style.logo}>
                                <View style={style.centeredHorizontal}>
                                    <Image source={Images.etlLogo} />
                                    <H1 style={style.title}>Welcome to ETL's {"\n"} Sample Submission App</H1>
                                </View>
                            </View>
                            <View style={style.loginFields}>
                                <Field
                                    label="User Id"
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    keyboardType="numeric"
                                    textInputRef={this.setClientIdRef}
                                    onSubmitEditing={this.goToPassword}
                                    inverse
                                />
                                <Field
                                    label="PIN"
                                    secureTextEntry
                                    autoCapitalize="none"
                                    returnKeyType="go"
                                    keyboardType="numeric"
                                    textInputRef={this.setPasswordRef}
                                    onSubmitEditing={this.signIn}
                                    inverse
                                />
                                <View>
                                    <View>
                                        <Button full large onPress={this.signIn} style={style.loginBtn}>
                                            <Text style={style.loginText}>Sign In</Text>
                                        </Button>
                                    </View>
                                    {/* <View>
                                        <Button transparent full onPress={this.signUp}>
                                            <Small style={{color: "white"}}>{"Don't have an account? Sign Up"}</Small>
                                        </Button>
                                    </View> */}
                                </View>
                            </View>
                        </AnimatedView>
                    </Content>
                </SafeAreaView>
            </View>
        );
    }
}

const {height, width} = WindowDimensions;
const style = StyleSheet.create({
    img: {
        height,
        width
    },
    content: {
        flex: 1
    },
    logo: {
        alignSelf: "center",
        marginBottom: variables.contentPadding,
        marginTop: variables.contentPadding
    },
    title: {
        marginTop: moderateScale(variables.contentPadding),
        color: "white",
        textAlign: "center",
        fontSize: moderateScale(32),
        lineHeight: moderateScale(37),
        fontWeight: 'bold'
    },
    blur: {
        backgroundColor: "rgba(255, 255, 255, .2)"
    },
    centeredHorizontal: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    loginFields: {
        marginLeft: moderateScale(15),
        marginRight: moderateScale(15)
    },
    loginBtn: {
        marginTop: moderateScale(10),
        backgroundColor: variables.brandSecondary,
        height: moderateScale(60)
    },
    loginText: {
        fontSize: moderateScale(22),
        lineHeight: moderateScale(32)
    }
});
