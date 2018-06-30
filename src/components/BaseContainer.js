// @flow
import * as React from "react";
import autobind from "autobind-decorator";
import {StyleSheet, Platform} from "react-native";
import {Button, Header as NBHeader, Left, Body, Title, Right, Icon, Content, Text} from "native-base";
import { EvilIcons } from "@expo/vector-icons";
import { grabClientJobs } from "../helpers/etcAPI";
import { moderateScale } from 'react-native-size-matters';


import Avatar from "./Avatar";

import Container from "./Container";
import type {NavigationProps, ChildrenProps} from "./Types";

import {Styles} from "../components";
import variables from "../../native-base-theme/variables/commonColor";

type BaseContainerProps = NavigationProps<> & ChildrenProps & {
    title: string | React.Node,
    scrollable?: boolean,
    safe?: boolean,
    bottomColor?: string,
    refresh?: Function,
    add?: Function,
    deleteBtn?: Function,
    backFunction: Function,
    backBtn?: boolean
};

export default class BaseContainer extends React.Component<BaseContainerProps> {

    @autobind
    renderTopLeft() {
        if (this.props.backBtn && this.props.backFunction) {
            return(<Button onPress={() => this.props.backFunction() && this.props.navigation.goBack()} transparent>
                <Icon name="ios-arrow-back" style={Styles.icon} />
            </Button>);
        } else if (this.props.backBtn) {
            return(<Button onPress={() => this.props.navigation.goBack()} transparent>
                <Icon name="ios-arrow-back" style={Styles.icon} />
            </Button>);
        } else {
            return(<Button onPress={() => this.props.navigation.navigate("DrawerOpen")} transparent>
                <EvilIcons name="navicon" size={moderateScale(32)} color={variables.gray} />
            </Button>);
        }
    }

    render(): React.Node {
        const {title, navigation, bottomColor, scrollable, safe, refresh, add, deleteBtn} = this.props;
        return <Container {...{safe, bottomColor}} style={{paddingTop: 0}}>
                <NBHeader noShadow>
                    <Left>
                        {this.renderTopLeft()}
                    </Left>
                    <Body>
                    {
                        typeof(title) === "string" ? <Title style={styles.title}>{title}</Title> : title
                    }
                    </Body>
                    <Right style={{ alignItems: "center" }}>
                        {
                          deleteBtn && <Button transparent onPress={() => deleteBtn()}>
                              <Icon name="trash" style={[Styles.icon, {fontSize: moderateScale(35)}]} />
                          </Button>
                        }
                        {
                          refresh && <Button onPress={() => refresh()} transparent>
                              <EvilIcons name="refresh" size={moderateScale(32)} color={variables.gray} />
                          </Button>
                        }
                        {
                          add && <Button transparent onPress={() => add()}>
                              <Icon name="ios-add-outline" style={Styles.icon} />
                          </Button>
                        }
                    </Right>
                </NBHeader>
                {
                    scrollable ? <Content style={styles.content}>
                            {this.props.children}
                        </Content>
                    :
                        this.props.children
                }
            </Container>;
    }
}

const styles = StyleSheet.create({
    content: {
        backgroundColor: "white"
    },
    title: {
        fontSize: moderateScale(variables.titleFontSize),
        lineHeight: moderateScale(21)
    }
})
