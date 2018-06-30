// @flow
import autobind from "autobind-decorator";
import moment from "moment";
import * as React from "react";
import {View, Text, StyleSheet} from "react-native";
import {H3, ListItem, Item, Input, Label, Picker, Col} from "native-base";
import {observable, action, computed} from "mobx";
import {observer} from "mobx-react/native";

import {Avatar, Styles} from "../components";

import variables from "../../native-base-theme/variables/commonColor";
import Circle from "../components/Circle";
import { moderateScale } from 'react-native-size-matters';
import { toastHelper } from '../helpers/etcAPI';

type ETCPickerProps = {
    displayName: String,
    name: String,
    value: Any,
    editable: Boolean,
    options: Object,
    other: Boolean,
    otherName: String, // required if doing an "other.." field
    otherKey: String, // required if doing an "other.." field
    updateForm: Function,
    updateObj: Function // required if doing an "other.." field
};

@observer
export default class ETCPicker extends React.Component<ETCPickerProps> {

    render(): React.Node {
        const {name, displayName, editable, value, options, other, otherName} = this.props;
        const pickerVal = other ? "" : value;
        const optionNames = Object.keys(options);
        return <Item style={Styles.ETCPicker}>
          <Col>
            <Label><Text style={[Styles.label, Styles.input]}>{displayName}</Text></Label>
          </Col>
          <Col>
            <Picker
              mode="dropdown"
              style={Styles.picker}
              placeholder="Select..."
              ref={name}
              enabled={editable}
              selectedValue={pickerVal}
              onValueChange={value => this.props.updateForm(name, value, editable)}
            >
              {
                optionNames.map((option, i) => {
                    return(
                        <Item key={i} label={option} value={options[option]} />
                    );
                })
              }
            </Picker>
          </Col>
          {
              otherName && <Col>
                <Item style={style.detailsForm}>
                  <Input
                    style={Styles.input}
                    value={other ? value : ""}
                    ref={otherName}
                    placeholder={"Other.."}
                    editable={editable}
                    onChangeText={inputVal => this.props.updateForm(otherName, inputVal)}
                    onEndEditing={() => this.props.updateObj()}
                  />
                </Item>
              </Col>
          }
        </Item>
    }
}

const style = StyleSheet.create({
    detailsForm: {
        marginLeft: 0,
        borderBottomColor: 'rgba(82, 98, 163, 0.3)'
    }
});
