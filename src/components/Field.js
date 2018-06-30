// @flow
import * as _ from "lodash";
import autobind from "autobind-decorator";
import * as React from "react";
import TextInput from "native-base";
import {ListItem, Item, Label, Input, Body, Right} from "native-base";
import {observable, action} from "mobx";
import { observer } from "mobx-react/native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import {Styles} from "../components";

interface FieldProps {
    label: string,
    defaultValue?: string,
    last?: boolean,
    inverse?: boolean,
    right?: () => React.Node,
    textInputRef?: TextInput => void
}

@observer
export default class Field extends React.Component<FieldProps> {
    @observable value: string;

    componentWillMount() {
        this.setValue(this.props.defaultValue || "");
    }

    @autobind @action
    setValue(value: string) {
        this.value = value;
    }

    render(): React.Node {
        const {label, last, inverse, defaultValue, right, textInputRef} = this.props;
        const style = {
            fontSize: moderateScale(18),
            height: moderateScale(60),
            lineHeight: moderateScale(30),
            top: scale(5),
            marginLeft: 0
        }
        style.color = inverse ? "white" : null;
        const itemStyle = inverse ? { borderColor: "white" } : {};
        const keysToFilter = ["right", "defaultValue", "inverse", "label", "last"];
        const props = _.pickBy(this.props, (value, key) => keysToFilter.indexOf(key) === -1);
        const {value} = this;
        return <ListItem {...{ last }} style={itemStyle}>
            <Body>
                <Item
                    style={{ borderBottomWidth: 0 }}
                    floatingLabel={!defaultValue}
                    stackedLabel={!!defaultValue}>
                    <Label {...{ style }}>{label}</Label>
                    <Input
                      onChangeText={this.setValue}
                      getRef={textInputRef} {...{ value, style }} {...props} />
                </Item>
            </Body>
            {
                right && <Right>{right()}</Right>
            }
        </ListItem>;
    }
}
