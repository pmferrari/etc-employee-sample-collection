// @flow
import moment from "moment";
import * as React from "react";
import {View, Text, StyleSheet} from "react-native";
import {H3} from "native-base";
import Spinner from 'react-native-loading-spinner-overlay';

import {Avatar, Styles} from "../components";

import variables from "../../native-base-theme/variables/commonColor";
import Circle from "../components/Circle";

type ETCSpinnerProps = {
    visible: Boolean,
    text: String
};

export default class ETCSpinner extends React.Component<ETCSpinnerProps> {
    render(): React.Node {
        const {text, visible} = this.props;
        return <Spinner
          overlayColor={variables.modalOverlay}
          color={variables.brandSecondary}
          animation={"fade"}
          textContent={text}
          textStyle={Styles.modalText}
          visible={visible}/>
    }
}
