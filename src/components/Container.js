// @flow
import * as React from "react";
import {View, SafeAreaView} from "react-native";
import {Constants} from "expo";

import Styles from "./Styles";
import type {BaseProps} from "./Types";

import variables from "../../native-base-theme/variables/commonColor";

type ContainerProps = BaseProps & {
    safe?: boolean,
    children: React.Node,
    bottomColor?: string
};

export default class Container extends React.Component<ContainerProps> {
    render(): React.Node {
        const {children, style, bottomColor, safe} = this.props;
        const containerStyle = [{
            flex: 1
        }];
        const bottomStyle = {
            backgroundColor: bottomColor ? bottomColor : variables.brandPrimary
        };
        if (!safe) {
            containerStyle.push({ paddingTop: Constants.statusBarHeight });
        }
        return (
            <View style={Styles.flexGrow}>
                {
                    // $FlowFixMe
                    safe && <SafeAreaView />
                }
                <View style={[containerStyle, style]}>{children}</View>
                {
                    // $FlowFixMe
                    safe && <SafeAreaView style={bottomStyle} />
                }
            </View>
        );
    }
}
