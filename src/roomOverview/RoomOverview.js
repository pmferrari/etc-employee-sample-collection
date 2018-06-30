// @flow
import autobind from "autobind-decorator";
import moment from "moment";
import * as React from "react";
import {StyleSheet, View, Text, Platform, Alert, TouchableOpacity} from "react-native";
import {Tab, Tabs, TabHeading, H1, Fab, Form, Item,
  Label, Icon, Footer, Button, Input, Picker, Grid, Col, Row,
  Content, ListItem, CheckBox, Body, Left, Right} from "native-base";
import {observable, action, computed, runInAction} from "mobx";
import {observer} from "mobx-react/native";
import {syncRoomUpdate, deleteRoom, clientJobs} from '../helpers/etcAPI';
import {possibleColors, possibleSizes} from '../helpers/config';

import {Styles, BaseContainer, ETCTextInput, ETCPicker, ETCSpinner} from "../components";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

import variables from "../../native-base-theme/variables/commonColor";

import type {ScreenProps} from "../components/Types";

@observer
export default class RoomOverview extends React.Component<ScreenProps<>> {

    @observable room = this.props.navigation.state.params.room;
    @observable prefill = "Select...";
    @observable loading = false;
    update = this.props.navigation.state.params.updateRoom;
    editable = this.props.navigation.state.params.editable;
    roomIndex = this.props.navigation.state.params.index;
    materialId = this.props.navigation.state.params.materialId;
    jobId = this.props.navigation.state.params.jobId;
    materialIndex = clientJobs[this.jobId].materials.map(function(x) {return x.id; }).indexOf(this.materialId);
    checkboxInputs = [ "hangers", "end", "puncture", "vibration", "water", "air",
                       "delimination", "slowDeterioration", "useWear" ];

    @autobind
    async removeRoom() {
        console.log('deleting the room!');
        await deleteRoom(this.room.id, this.materialId, this.jobId);
        console.log('successfully deleted the room');
        this.update();
        this.props.navigation.goBack();
    }

    @autobind
    toggleBackDelete() {
        if (this.room.room === "") {
            this.removeRoom();
        } else {
            this.props.navigation.goBack();
        }
    }

    @autobind
    verifyDelete() {
        Alert.alert(
          'Deleting Room ' + String(this.room.room),
          'Are you sure you want to permanently delete this room?',
          [
            {text: 'Yes, delete this room', onPress: () => this.removeRoom(), style: 'destructive'},
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          ],
          { cancelable: false }
        );
    }

    @autobind @action
    async updateRoom() {
        console.log('updateRoom: beginning function');
        syncRoomUpdate(this.room, this.room.id, this.materialId, this.jobId);
        this.update();
    }

    @autobind @action
    async updateForm(key: String, value: any, editable: Boolean) {
        // Only reason we have this separate function is because if we wrote
        // a change every time we changed a letter it would be really slow
        console.log('updateForm: updating "' + key + '" to: ' + String(value));
        if (editable === false || value === "Select...") {
            return;
        }

        if (this.checkboxInputs.indexOf(key) >= 0) {
            console.log(this.room[key]);
            this.room[key] = !this.room[key];
            this.updateRoom();
        } else if (key === "feetDamaged" || key === "quantity") {
            if (value === "") {
                this.room[key] = value;
            } else {
                this.room[key] = parseInt(value);
            }
        } else if (key === "damageExtent") {
            this.room[key] = value;
            this.updateRoom();
        } else if (key === "prefill") {
            // this.loading = true;
            this.prefill = value;
            if (value !== "Select...") {
                let roomIndex = clientJobs[this.jobId].materials[this.materialIndex].rooms.map(function(x) {return x.id; }).indexOf(value);
                const roomCopy = clientJobs[this.jobId].materials[this.materialIndex].rooms[roomIndex];
                for (field in roomCopy) {
                    if (field !== "floor" && field !== "room" && field !== "id") {
                        this.room[field] = roomCopy[field];
                    }
                }
                this.updateRoom();
            }
            // setTimeout(() => {
            //   runInAction("Updating Loading", () => {
            //     this.loading = false;
            //   });
            // }, 500);
        } else {
            this.room[key] = value;
        }
    }

    @observer
    @computed get getAssessmentOptions() {
        let options = {
            "Select...": "Select...",
            "1 - Damaged or Sig Damaged TSI": "1 - Damaged or Sig Damaged TSI",
            "2 - Damaged Friable Surfacing": "2 - Damaged Friable Surfacing",
            "3 - Significantly Damaged Friable Surfacing": "3 - Significantly Damaged Friable Surfacing",
            "4 - Damaged or Sig Damaged Miscellaneous": "4 - Damaged or Sig Damaged Miscellaneous",
            "5 - ACBM with Potential for Significant Damage": "5 - ACBM with Potential for Significant Damage",
            "6 - ACBM with Potential for Damage": "5 - ACBM with Potential for Damage",
            "7 - Any Remaining ACBM": "7 - Any Remaining ACBM"
        }
        return JSON.parse(JSON.stringify(options));
    }

    @observer
    @computed get getResponseOptions() {
        let options = {
            "Select...": "Select...",
            "1 - Isolate and Remove": "1 - Isolate and Remove",
            "2 - Schedule Removal": "2 - Schedule Removal",
            "3 - Encase ACBM": "3 - Encase ACBM",
            "4 - Encapsulate ACBM": "4 - Encapsulate ACBM",
            "5 - Patch and Repair / O&M": "5 - Patch and Repair / O&M",
            "6 - O&M / Monitor": "6 - O&M / Monitor"
        }
        return JSON.parse(JSON.stringify(options));
    }

    @computed get prefillOptions() {
        let options = { "Select...": "Select..." };
        for (room of clientJobs[this.jobId].materials[this.materialIndex].rooms) {
            if (room["id"] !== this.room["id"]) {
                let key = "Floor " + String(room["floor"]) + ", Room " + String(room["room"]);
                options[key] = room["id"];
            }
        }
        return options;
    }

    @observer
    render(): React.Node {
        const units = clientJobs[this.jobId].materials[this.materialIndex].units;
        const editable = this.editable;
        const tabStyle = editable ? {backgroundColor: variables.white} : {backgroundColor: variables.mediumGray};
        console.log('in room overview now');
        return <BaseContainer
          title="Room Overview"
          navigation={this.props.navigation}
          deleteBtn={this.verifyDelete}
          backFunction={this.toggleBackDelete}
          backBtn
          >
            <ETCSpinner visible={this.loading} />
            <View style={[Styles.flexGrow, tabStyle]}>
                <Content enableResetScrollToCoords={false} keyboardShouldPersistTaps={'always'}>
                  <Form style={[style.tab, Styles.center, {paddingBottom: 0}]}>
                    <ETCPicker
                      displayName="(Opt) Prefill..."
                      name="prefill"
                      value={this.prefill}
                      editable={editable}
                      options={this.prefillOptions}
                      updateForm={this.updateForm}
                    />
                    <ETCTextInput
                      displayName="Floor"
                      name="floor"
                      value={this.room.floor}
                      editable={editable}
                      updateObj={this.updateRoom}
                      updateForm={this.updateForm}
                      // autoFocus
                    />
                    <ETCTextInput
                      displayName="Room"
                      name="room"
                      value={this.room.room}
                      editable={editable}
                      updateObj={this.updateRoom}
                      updateForm={this.updateForm}
                    />
                    <Row>
                      <Left>
                        <ETCTextInput
                          displayName="Quantity"
                          name="quantity"
                          value={this.room.quantity}
                          editable={editable}
                          keyboardType={'numeric'}
                          updateObj={this.updateRoom}
                          updateForm={this.updateForm}
                        />
                      </Left>
                      <Right>
                        <Text style={style.checkboxItem}>{units}</Text>
                      </Right>
                    </Row>
                    <Item last stackedLabel style={style.plmInstructions}>
                      <Row>
                        <Left>
                          <ListItem last
                            onPress={value => this.updateForm("hangers", value, editable)}>
                            <CheckBox
                              checked={this.room.hangers}
                              color={variables.brandSecondary}
                              onPress={value => this.updateForm("hangers", value, editable)}
                             />
                            <Text style={style.checkboxItem}>Hangers{" "}</Text>
                          </ListItem>
                        </Left>
                        <Right>
                          <ListItem last
                            onPress={value => this.updateForm("end", value, editable)}>
                            <CheckBox
                              checked={this.room.end}
                              color={variables.brandSecondary}
                              onPress={value => this.updateForm("end", value, editable)}
                             />
                            <Text style={style.checkboxItem}>End{" "}</Text>
                          </ListItem>
                        </Right>
                      </Row>
                    </Item>
                    <ETCPicker
                      displayName="Damage Extent"
                      name="damageExtent"
                      value={this.room.damageExtent}
                      editable={editable}
                      options={{
                        "Select...": "Select...",
                        "Distributed": "Distributed",
                        "Localized": "Localized"
                      }}
                      updateForm={this.updateForm}
                    />
                    <ETCTextInput
                      displayName="Feet Damaged"
                      name="feetDamaged"
                      value={this.room.feetDamaged}
                      editable={editable}
                      updateObj={this.updateRoom}
                      updateForm={this.updateForm}
                    />
                    <ETCPicker
                      displayName="Access"
                      name="access"
                      value={this.room.access}
                      editable={editable}
                      options={{
                        "Select...": "Select...",
                        "Inaccessible": "Inaccessible...",
                        "Maintenance": "Maintenance",
                        "Staff": "Staff",
                        "Unrestricted": "Unrestricted"
                      }}
                      updateForm={this.updateForm}
                    />
                    <ETCPicker
                      displayName="Frequency of Access"
                      name="frequencyOfAccess"
                      value={this.room.frequencyOfAccess}
                      editable={editable}
                      options={{
                        "Select...": "Select...",
                        "High": "High",
                        "Medium": "Medium",
                        "Seldom": "Seldom"
                      }}
                      updateForm={this.updateForm}
                    />
                    <ETCPicker
                      displayName="Vibration Level"
                      name="vibrationLevel"
                      value={this.room.vibrationLevel}
                      editable={editable}
                      options={{
                        "Select...": "Select...",
                        "High": "High",
                        "Medium": "Medium",
                        "Seldom": "Seldom"
                      }}
                      updateForm={this.updateForm}
                    />
                    <ETCPicker
                      displayName="Air Movement"
                      name="airMovement"
                      value={this.room.airMovement}
                      editable={editable}
                      options={{
                        "Select...": "Select...",
                        "High": "High",
                        "Medium": "Medium",
                        "Seldom": "Seldom"
                      }}
                      updateForm={this.updateForm}
                    />
                    <ETCPicker
                      displayName="Disturbance Potential"
                      name="disturbancePotential"
                      value={this.room.disturbancePotential}
                      editable={editable}
                      options={{
                        "Select...": "Select...",
                        "High": "High",
                        "Medium": "Medium",
                        "Seldom": "Seldom"
                      }}
                      updateForm={this.updateForm}
                    />
                    <ETCPicker
                      displayName="ACM Condition"
                      name="acmCondition"
                      value={this.room.acmCondition}
                      editable={editable}
                      options={{
                        "Select...": "Select...",
                        "Good": "Good",
                        "Fair": "Fair",
                        "Bad": "Bad"
                      }}
                      updateForm={this.updateForm}
                    />
                    <ETCTextInput
                      displayName="Height of ACM"
                      name="heightOfACM"
                      value={this.room.heightOfACM}
                      editable={editable}
                      updateObj={this.updateRoom}
                      updateForm={this.updateForm}
                    />
                    <ETCPicker
                      displayName="Assessment"
                      name="assessment"
                      value={this.room.assessment}
                      editable={editable}
                      options={this.getAssessmentOptions}
                      updateForm={this.updateForm}
                    />
                    <ETCPicker
                      displayName="Response"
                      name="response"
                      value={this.room.response}
                      editable={editable}
                      options={this.getResponseOptions}
                      updateForm={this.updateForm}
                    />

                  </Form>

                  <ListItem itemDivider>
                    <Text style={Styles.dividerText}>CHECK IF PRESENT</Text>
                  </ListItem>

                  <Form style={[style.tab, Styles.center, {paddingTop: moderateScale(5) }]}>
                    <Item last stackedLabel style={style.plmInstructions}>
                      <ListItem last
                        onPress={value => this.updateForm("puncture", value, editable)}>
                        <CheckBox
                          checked={this.room.puncture}
                          color={variables.brandSecondary}
                          onPress={value => this.updateForm("puncture", value, editable)}
                         />
                        <Text style={style.checkboxItem}>Puncture{" "}</Text>
                      </ListItem>
                      <ListItem last
                        onPress={value => this.updateForm("vibration", value, editable)}>
                        <CheckBox
                          checked={this.room.vibration}
                          color={variables.brandSecondary}
                          onPress={value => this.updateForm("vibration", value, editable)}
                         />
                        <Text style={style.checkboxItem}>Vibration{" "}</Text>
                      </ListItem>
                      <ListItem last
                        onPress={value => this.updateForm("water", value, editable)}>
                        <CheckBox
                          checked={this.room.water}
                          color={variables.brandSecondary}
                          onPress={value => this.updateForm("water", value, editable)}
                         />
                        <Text style={style.checkboxItem}>Water{" "}</Text>
                      </ListItem>
                      <ListItem last
                        onPress={value => this.updateForm("air", value, editable)}>
                        <CheckBox
                          checked={this.room.air}
                          color={variables.brandSecondary}
                          onPress={value => this.updateForm("air", value, editable)}
                         />
                        <Text style={style.checkboxItem}>Air{" "}</Text>
                      </ListItem>
                      <ListItem last
                        onPress={value => this.updateForm("delimination", value, editable)}>
                        <CheckBox
                          checked={this.room.delimination}
                          color={variables.brandSecondary}
                          onPress={value => this.updateForm("delimination", value, editable)}
                         />
                        <Text style={style.checkboxItem}>Delimination{" "}</Text>
                      </ListItem>
                      <ListItem last
                        onPress={value => this.updateForm("slowDeterioration", value, editable)}>
                        <CheckBox
                          checked={this.room.slowDeterioration}
                          color={variables.brandSecondary}
                          onPress={value => this.updateForm("slowDeterioration", value, editable)}
                         />
                        <Text style={style.checkboxItem}>Slow Deterioration{" "}</Text>
                      </ListItem>
                      <ListItem last
                        onPress={value => this.updateForm("useWear", value, editable)}>
                        <CheckBox
                          checked={this.room.useWear}
                          color={variables.brandSecondary}
                          onPress={value => this.updateForm("useWear", value, editable)}
                         />
                        <Text style={style.checkboxItem}>Use / Wear{" "}</Text>
                      </ListItem>
                    </Item>
                  </Form>

                </Content>
            </View>
            {
              editable && <Footer style={{backgroundColor: variables.white}}>
                <Button
                  full
                  large
                  style={[Styles.largeBtn, {flex:1, marginTop: 0}]}
                  onPress={() => this.update() && this.props.navigation.goBack()}
                  >
                  <Text style={[Styles.largeBtnText, {marginBottom: moderateScale(5)}]}>SAVE ROOM</Text>
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
