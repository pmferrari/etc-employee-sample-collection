// @flow
import autobind from "autobind-decorator";
import moment from "moment";
import * as React from "react";
import {View, Text, StyleSheet} from "react-native";
import {H3, ListItem, Item, Input, Label, CheckBox} from "native-base";
import {observable, action, computed} from "mobx";
import {observer} from "mobx-react/native";

import {Avatar, Styles} from "../components";

import variables from "../../native-base-theme/variables/commonColor";
import Circle from "../components/Circle";
import { moderateScale } from 'react-native-size-matters';
import { toastHelper } from '../helpers/etcAPI';

type ETCTextInputProps = {
    displayName: String,
    name: String,
    value: Any,
    editable: Boolean,
    updateForm: Function
};

@observer
export default class ETCCheckbox extends React.Component<ETCCheckboxProps> {
    render(): React.Node {
        const {name, displayName, value, editable} = this.props;
        return <Item last stackedLabel style={Styles.plmInstructions}>
          <ListItem last
            onPress={inputVal => this.props.updateForm(name, inputVal, editable)}>
            <CheckBox
              checked={value}
              color={variables.brandSecondary}
              onPress={inputVal => this.props.updateForm(name, inputVal, editable)}
             />
            <Text style={style.checkboxItem}>{displayName}{" "}</Text>
          </ListItem>
        </Item>
    }
}

const style = StyleSheet.create({
    checkboxItem: {
        paddingLeft: moderateScale(5),
        fontSize: moderateScale(14),
        lineHeight: moderateScale(18),
        paddingTop: moderateScale(5)
    }
});
