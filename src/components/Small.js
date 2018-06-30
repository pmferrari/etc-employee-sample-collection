// @flow
import * as React from "react";
import {Text} from "react-native";
import variables from "../../native-base-theme/variables/commonColor";

import type {BaseProps} from "./Types";

type SmallProps = BaseProps & {
    children: string
};

export default class Small extends React.Component<SmallProps> {
    render(): React.Node {
        const style = [{ fontSize: 12, color: variables.gray, backgroundColor: "transparent" }, this.props.style];
        return <Text {...{style}}>{this.props.children}</Text>;
    }
}
