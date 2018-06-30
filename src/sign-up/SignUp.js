// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, Image, StyleSheet, Dimensions} from "react-native";
import {Button, Header, Left, Right, Body, Icon, Title, Input, Content} from "native-base";

import {Styles, Images, Field, NavigationHelpers, Container} from "../components";

import variables from "../../native-base-theme/variables/commonColor";

import type {ScreenProps} from "../components/Types";

export default class SignUp extends React.Component<ScreenProps<>> {

    username: Input;
    password: Input;
    birthday: Input;

    @autobind
    setUsernameRef(username: Input) {
        this.username = username._root;
    }

    @autobind
    goToUsername() {
        this.username.focus();
    }

    @autobind
    setPasswordRef(password: Input) {
        this.password = password._root;
    }

    @autobind
    goToPassword() {
        this.password.focus();
    }

    @autobind
    setBirthdayRef(birthday: Input) {
        this.birthday = birthday._root;
    }

    @autobind
    goToBirthday() {
        this.birthday.focus();
    }

    @autobind
    back() {
        this.props.navigation.goBack();
    }

    @autobind
    signIn() {
        NavigationHelpers.reset(this.props.navigation, "Walkthrough");
    }

    render(): React.Node {
        return <Container safe={true}>
            <Header noShadow>
                <Left>
                    <Button onPress={this.back} transparent>
                        <Icon name='close' />
                    </Button>
                </Left>
                <Body>
                    <Title>Sign Up</Title>
                </Body>
                <Right />
            </Header>
            <Content style={style.content}>
                <View>
                    <Image source={Images.signUp} resizeMode="cover" style={style.img} />
                    <View style={[StyleSheet.absoluteFill, Styles.imgMask, Styles.center]}>
                        <View style={style.circle}>
                            <Icon name="ios-add-outline" style={{fontSize: 30, color: variables.brandInfo }} />
                        </View>
                    </View>
                </View>
                <Field
                    label="Name"
                    onSubmitEditing={this.goToUsername}
                    returnKeyType="next"
                />
                <Field
                    label="Username"
                    textInputRef={this.setUsernameRef}
                    onSubmitEditing={this.goToPassword}
                    returnKeyType="next"
                />
                <Field
                    label="Password"
                    textInputRef={this.setPasswordRef}
                    onSubmitEditing={this.goToBirthday}
                    returnKeyType="next"
                    secureTextEntry
                />
                <Field
                    label="Birthday"
                    textInputRef={this.setBirthdayRef}
                    onSubmitEditing={this.signIn}
                    returnKeyType="go"
                    last
                />
                <Button primary full onPress={this.signIn} style={{ height: variables.footerHeight }}>
                    <Icon name="md-checkmark" />
                </Button>
            </Content>
        </Container>;
    }
}

const {width} = Dimensions.get("window");
const style = StyleSheet.create({
    img: {
        height: width * 0.30
    },
    circle: {
        backgroundColor: "white",
        height: 60,
        width: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center"
    },
    content: {
        backgroundColor: "white",
    }
});
