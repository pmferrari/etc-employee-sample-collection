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
import {syncJobUpdate, clientJobs, dropdownConfig} from '../helpers/etcAPI';
import {possibleBuildingTypes} from '../helpers/config';

import {Styles, BaseContainer, ETCTextInput, ETCPicker, ETCSpinner, ETCCheckbox} from "../components";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

import variables from "../../native-base-theme/variables/commonColor";

import type {ScreenProps} from "../components/Types";

type BuildingInfoProps = {
    job: Object
};

@observer
export default class BuildingInfo extends React.Component<BuildingInfoProps> {

    @observable job = this.props.job;
    @observable prefill = "Select...";
    @observable loading = false;
    // @observable facilityTypeOther: Boolean = dropdownConfig.facilityTypeList[this.job.facilityType] === undefined;

    // @autobind @action
    // setFacilityTypeOther(value: Boolean) {
    //     this.facilityTypeOther = value;
    // }

    @autobind @action
    updateJob() {
        console.log('updateJob: building info');
        syncJobUpdate(this.job);
    }

    @autobind @action
    async updateForm(key: String, value: any, editable: Boolean) {
        // Only reason we have this separate function is because if we wrote
        // a change every time we changed a letter it would be really slow
        console.log('updateForm: updating "' + key + '" to: ' + String(value));
        if (editable === false || value === "Select...") {
            return;
        }
        if (key === "facilityType") {
            this.job[key] = parseInt(value);
            this.updateJob();
        } else if (key === "occupied") {
            this.job[key] = !this.job[key];
            this.updateJob();
        } else if (key === "managementPlannerId" || key === "inspectorId") {
            this.job[key] = parseInt(value);
        }
        // else if (key === "facilityTypeOther") {
        //     this.job.facilityType = value;
        //     this.setFacilityTypeOther(true);
        // } else if (key === "facilityTypeDropdown") {
        //     this.job.facilityType = value;
        //     this.setFacilityTypeOther(false);
        //     this.updateJob();
        // }
        else {
            this.job[key] = value;
        }
    }

    getDropdownOptions(dropdown: String) {
        const options = {};
        for (key in dropdownConfig[dropdown]) {
            value = dropdownConfig[dropdown][key];
            options[value] = key;
        }
        return options;
    }

    @observer
    render(): React.Node {
        const editable = this.editable;
        console.log('in building info');
        console.log(this.job.inspectorId);
        return <View style={Styles.flexGrow}>
                <Content enableResetScrollToCoords={false} keyboardShouldPersistTaps={'always'}>
                  <Form style={[style.tab, Styles.center, {paddingBottom: 0}]}>

                    <ETCPicker
                      displayName="Inspector"
                      name="inspectorId"
                      value={String(this.job.inspectorId)}
                      editable={editable}
                      options={dropdownConfig.inspectorsList}
                      updateForm={this.updateForm}
                      updateObj={this.updateJob}
                    />
                    <ETCPicker
                      displayName="Mgmt Planner"
                      name="managementPlannerId"
                      value={String(this.job.managementPlannerId)}
                      editable={editable}
                      options={dropdownConfig.plannersList}
                      updateForm={this.updateForm}
                      updateObj={this.updateJob}
                    />
                    {/* <ETCTextInput
                      displayName="Mgmt Planner Cert #"
                      name="mgmtPlannerCert"
                      keyboardType="numeric"
                      value={this.job.building.mgmtPlannerCert}
                      editable={editable}
                      updateObj={this.updateJob}
                      updateForm={this.updateForm}
                    /> */}
                  </Form>
                  <ListItem itemDivider>
                    <Text style={Styles.dividerText}>BUILDING</Text>
                  </ListItem>
                  <Form style={[style.tab, Styles.center, {marginTop: moderateScale(3)}]}>
                    <ETCPicker
                      displayName="Type"
                      name="facilityType"
                      value={String(this.job.facilityType)}
                      editable={editable}
                      options={this.getDropdownOptions("facilityTypeList")}
                      updateForm={this.updateForm}
                      updateObj={this.updateJob}
                      // other={this.facilityTypeOther}
                      // otherName="facilityTypeOther"
                    />
                    {/* <ETCTextInput
                      displayName="Owner"
                      name="buildingOwner"
                      value={this.job.building.buildingOwner}
                      editable={editable}
                      updateObj={this.updateJob}
                      updateForm={this.updateForm}
                    /> */}
                    <ETCTextInput
                      displayName="On Site Person"
                      name="onSitePerson"
                      value={this.job.onSitePerson}
                      editable={editable}
                      updateObj={this.updateJob}
                      updateForm={this.updateForm}
                    />
                    <ETCTextInput
                      displayName="On Site Phone"
                      name="onSitePhone"
                      value={this.job.onSitePhone}
                      editable={editable}
                      updateObj={this.updateJob}
                      updateForm={this.updateForm}
                    />
                    <ETCCheckbox
                      displayName="Occupied"
                      name="occupied"
                      editable={editable}
                      updateForm={this.updateForm}
                      value={this.job.occupied}
                    />
                  </Form>
                </Content>
            </View>
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
