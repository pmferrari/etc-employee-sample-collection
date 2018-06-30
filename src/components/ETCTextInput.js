// @flow
import autobind from "autobind-decorator";
import moment from "moment";
import * as React from "react";
import {View, Text, StyleSheet} from "react-native";
import {H3, ListItem, Item, Input, Label} from "native-base";
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
    keyboardType: String,
    updateObj: Function,
    updateForm: Function,
    autoFocus: Boolean
};

@observer
export default class ETCTextInput extends React.Component<ETCTextInputProps> {

    render(): React.Node {
        const {name, displayName, value, editable, keyboardType, autoFocus} = this.props;
        return <Item floatingLabel style={[Styles.detailsForm, { marginBottom: moderateScale(10), marginTop: moderateScale(10)}]}>
          <Label><Text style={[Styles.label, Styles.input]}>{displayName}</Text></Label>
          <Input
            style={Styles.input}
            value={String(value)}
            ref={name}
            editable={editable}
            keyboardType={keyboardType}
            autoFocus={autoFocus}
            onChangeText={inputVal => this.props.updateForm(name, inputVal)}
            onBlur={() => this.props.updateObj()}
          />
        </Item>
    }
}
