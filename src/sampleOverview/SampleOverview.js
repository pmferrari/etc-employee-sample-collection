// @flow
import autobind from "autobind-decorator";
import moment from "moment";
import * as React from "react";
import {StyleSheet, View, Text, Platform, Alert, TouchableOpacity} from "react-native";
import {Tab, Tabs, TabHeading, H1, Fab, Form, Item, Label, Icon, Footer, Button, Input, Picker, Grid, Col, Row, Content, ListItem, CheckBox, Body} from "native-base";
import {observable, action, computed} from "mobx";
import {observer} from "mobx-react/native";
import {syncSampleUpdate, deleteSample} from '../helpers/etcAPI';
import {possibleColors, possibleSizes} from '../helpers/config';

import {Styles, BaseContainer} from "../components";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

import variables from "../../native-base-theme/variables/commonColor";

import type {ScreenProps} from "../components/Types";

@observer
export default class SampleOverview extends React.Component<ScreenProps<>> {

    @observable sample = this.props.navigation.state.params.sample;
    update = this.props.navigation.state.params.updateSample;

    @autobind
    async removeSample() {
        console.log('deleting the sample!');
        await deleteSample(this.sample.id, this.sample.materialId, this.sample.jobId);
        console.log('successfully deleted the sample');
        this.update();
        this.props.navigation.goBack();
    }

    @autobind
    toggleBackDelete() {
        if (this.sample.sampleLocation === "") {
            this.removeSample();
        } else {
            this.props.navigation.goBack();
        }
    }

    @autobind
    verifyDelete() {
        Alert.alert(
          'Deleting ' + String(this.sample.sampleLocation),
          'Are you sure you want to permanently delete this sample?',
          [
            {text: 'Yes, delete this sample', onPress: () => this.removeSample(), style: 'destructive'},
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          ],
          { cancelable: false }
        );
    }

    @autobind @action
    async updateSample() {
        console.log('updateSample: beginning function');
        syncSampleUpdate(this.sample, this.sample.materialId, this.sample.jobId);
        this.update();
    }

    @autobind @action
    updateForm(key: String, value: any, editable: Boolean) {
        // Only reason we have this separate function is because if we wrote
        // a change every time we changed a letter it would be really slow
        console.log('updateForm: updating "' + key + '" to: ' + String(value));
        if (editable === false) {
            return;
        }
        this.sample[key] = value;
    }

    @observer
    render(): React.Node {

        const {editable} = this.sample;
        const tabStyle = editable ? {backgroundColor: variables.white} : {backgroundColor: variables.mediumGray};
        console.log('in sample overview now');
        console.log(this.sample);
        // console.log(this.props.navigation.state.params);
        return <BaseContainer
          title="Sample Overview"
          navigation={this.props.navigation}
          deleteBtn={this.verifyDelete}
          backFunction={this.toggleBackDelete}
          backBtn
          >
            <View style={[Styles.flexGrow, tabStyle]}>
                <Content enableResetScrollToCoords={false} keyboardShouldPersistTaps={'always'}>
                  <Form style={[style.tab, Styles.center]}>
                    <Item floatingLabel style={[style.detailsForm, { marginBottom: moderateScale(10)}]}>
                      <Label><Text style={[Styles.label, Styles.input]}>Location</Text></Label>
                      <Input
                        style={Styles.input}
                        value={this.sample.sampleLocation}
                        ref="sampleLocation"
                        editable={editable}
                        onChangeText={sampleLocation => this.updateForm("sampleLocation", sampleLocation)}
                        onEndEditing={() => this.updateSample()}
                      />
                    </Item>
                    {/* <Item floatingLabel style={style.detailsForm}>
                      <Label><Text style={[Styles.label, Styles.input]}>Picture Number(s)</Text></Label>
                      <Input
                        style={Styles.input}
                        value={this.sample.pictureNumbers}
                        ref="pictureNumbers"
                        editable={editable}
                        onChangeText={pictureNumbers => this.updateForm("pictureNumbers", pictureNumbers)}
                        onEndEditing={() => this.updateSample()}
                      />
                    </Item> */}
                  </Form>
                </Content>
            </View>
            {
              editable && <Footer style={{backgroundColor: variables.white}}>
                <Button
                  full
                  large
                  style={[Styles.largeBtn, {flex:1, marginTop: 0}]}
                  onPress={() => this.updateSample() && this.props.navigation.goBack()}
                  >
                  <Text style={[Styles.largeBtnText, {marginBottom: moderateScale(5)}]}>SAVE SAMPLE</Text>
                </Button>
              </Footer>
            }
        </BaseContainer>;
    }
}


const style = StyleSheet.create({
    tabHeading: {
        color: variables.gray
    },
    tab: {
        // backgroundColor: "#f8f8f8",
        padding: moderateScale(variables.contentPadding * 3)
    },
    detailsForm: {
        marginLeft: 0,
        borderBottomColor: 'rgba(82, 98, 163, 0.3)'
    },
    checkboxItem: {
        paddingLeft: moderateScale(5),
        fontSize: moderateScale(14),
        lineHeight: moderateScale(18),
        paddingTop: moderateScale(5)
    },
    pickerStyle: {
        paddingTop: moderateScale(15),
    },
    plmInstructions: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
        alignSelf: "stretch",
        paddingBottom: moderateScale(15),
        marginLeft: 0,
        paddingLeft: 0
    },
    pickerWrapper: {
        marginLeft: 0,
        marginTop: moderateScale(15)
    }
});
