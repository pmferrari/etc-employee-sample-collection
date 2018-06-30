// @flow
import autobind from "autobind-decorator";
import moment from "moment";
import * as React from "react";
import {StyleSheet, View, Text, Platform, Alert, TouchableOpacity} from "react-native";
import {Tab, Tabs, TabHeading, H1, Fab, Form, Item, Label, Icon, Footer,
  Button, Input, Picker, Grid, Col, Row, Content, ListItem, CheckBox, Body} from "native-base";
import {observable, action, computed, runInAction} from "mobx";
import {observer} from "mobx-react/native";
import { completeJob, syncJobUpdate, deleteJob, createNewMaterial,
  clientJobs, syncWithETC , etcUser, dropdownConfig} from '../helpers/etcAPI';

import {Styles, BaseContainer, Material, RequirementsOverview, ETCCheckbox,
        ETCSpinner, ETCPicker, ETCTextInput, BuildingInfo} from "../components";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

import variables from "../../native-base-theme/variables/commonColor";

import type {ScreenProps} from "../components/Types";

const DETAILS = 1;
const MATERIALS = 2;
// const MONTH = 3;

@observer
export default class Overview extends React.Component<ScreenProps<>> {

    @observable job = clientJobs[this.props.navigation.state.params.job.jobId];
    @observable loading = false;
    syncUpdates = this.props.navigation.state.params.job.syncUpdates;

    @autobind
    async removeJob() {
        // lets add a popup as well to make sure they want to do this
        console.log('deleting the job!');
        await deleteJob(this.job.jobId);
        console.log('successfully deleted the job');
        this.syncUpdates();
        this.props.navigation.goBack();
    }

    @autobind
    verifyDelete() {
        Alert.alert(
          'Deleting ' + String(this.job.facilityName),
          'Are you sure you want to permanently delete this job?',
          [
            {text: 'Yes, delete this job', onPress: () => this.removeJob(), style: 'destructive'},
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          ],
          { cancelable: false }
        );
    }

    @autobind
    getSamplesNeeded(classification: String) {
        if (classification === "S") {
            return this.job.minSurfacing;
        } else if (classification === "T") {
            return this.job.minThermal;
        } else if (classification === "M") {
            return this.job.minMisc;
        }
    }

    @autobind
    async update() {
        await runInAction("Updating Job Materials", async () => {
            for (key in clientJobs[this.job.jobId]) {
                this.job[key] = clientJobs[this.job.jobId][key];
            }
        });
        this.forceUpdate();
    }

    @observer
    @computed get generateMaterials() {
        return this.job.materials.map((material, i) => {
            const samplesNeeded = this.getSamplesNeeded(material.classification);
            return(<Material {...material}
                      key={i}
                      editable={this.job.editable}
                      jobId={this.job.jobId}
                      samplesNeeded={samplesNeeded}
                      navigation={this.props.navigation}
                      materialUpdate={this.update}
                     />);
        })
    }

    @autobind
    async createMaterial() {
        const newMaterial = await createNewMaterial(this.job.jobId);
        await this.update();
        this.props.navigation.navigate("MaterialOverview", {
          material: newMaterial,
          jobId: this.job.jobId,
          editable: true,
          materialUpdate: this.update
        });
    }

    @autobind @action
    async completeJob() {
        await runInAction("Updating Loading", async () => {
            this.loading = true;
        });
        completeJob(this.job.jobId).then(async () => {
            await runInAction("Updating Loading", async () => {
                this.loading = false;
            });
            console.log('successfully submitted job');
            this.syncUpdates();
            this.props.navigation.goBack();
        })
        .catch(async (error) => {
            await runInAction("Updating Loading", async () => {
                this.loading = false;
            });
            console.log('job submit error: ' + String(error));
        });
    }

    @autobind
    async dbUpdate() {
        console.log('db update!');
        await runInAction("Updating Loading", async () => {
            this.loading = true;
        });
        await syncWithETC(this.job.jobId);
        await this.syncUpdates();
        await runInAction("Updating Loading", async () => {
            this.loading = false;
        });
        this.props.navigation.goBack();
    }

    @observer
    render(): React.Node {
        console.log('in overview now');
        const tabStyle = this.job.editable ? undefined : {backgroundColor: variables.mediumGray};
        const syncUpdates = this.props.navigation.state.params.job.syncUpdates;
        const deleteFunc = this.job.editable ? this.verifyDelete : null;

        console.log(this.job);
        console.log(this.props.navigation.state.params.job.jobId);

        // console.log(syncUpdates);
        // console.log(this.props.navigation.state.params);
        return <BaseContainer
          title="Overview"
          navigation={this.props.navigation}
          deleteBtn={this.job.editable && deleteFunc}
          add={this.createNewMaterial}
          backFunction={syncUpdates}
          backBtn
          >
            <ETCSpinner visible={this.loading} />
            <Tabs tabBarUnderlineStyle={Styles.tabUnderline}>
                <Tab
                  heading="Details"
                  textStyle={Styles.tabTextStyle}
                  activeTextStyle={Styles.activeTabTextStyle}
                  style={tabStyle}>
                    <OverviewTab period={DETAILS} job={this.job} />

                </Tab>
                <Tab
                  heading="Building"
                  textStyle={Styles.tabTextStyle}
                  activeTextStyle={Styles.activeTabTextStyle}
                  style={tabStyle}>
                    <BuildingInfo
                      job={this.job}
                    />
                </Tab>
                <Tab
                  heading="Materials"
                  textStyle={Styles.tabTextStyle}
                  activeTextStyle={Styles.activeTabTextStyle}
                  style={[tabStyle, {flex:1}]}>
                  <RequirementsOverview job={this.job} />
                  <Content>
                    {
                      this.generateMaterials
                    }
                  </Content>
                  {
                    this.job.editable && <Fab
                      containerStyle={{ marginRight: Platform.OS === 'ios' ? undefined: moderateScale(5) }}
                      style={{
                          backgroundColor: variables.brandSecondary,
                          height: moderateScale(56),
                          width: moderateScale(56),
                          elevation: moderateScale(4),
                          borderRadius: moderateScale(28),
                          shadowRadius: moderateScale(2)
                     }}
                      position="bottomRight"
                      onPress={() => this.createMaterial()}>
                      <Icon
                        name="add"
                        style={{
                            fontSize: moderateScale(45),
                            lineHeight: moderateScale(50),
                            paddingTop: Platform.OS === 'ios' ? moderateScale(5) : undefined
                        }} />
                    </Fab>
                  }
                </Tab>
            </Tabs>
            {
              this.job.editable && <Footer style={{backgroundColor: variables.white}}>
                <Col>
                  <Button full large
                    onPress={() => this.dbUpdate()}
                    style={[Styles.largeBtn, {flex:1, marginTop: 0 }]}>
                    <Text style={[Styles.largeBtnText, {marginBottom: moderateScale(3)}]}>SAVE</Text>
                  </Button>
                </Col>
                <Col>
                  <Button full large
                    onPress={() => this.completeJob()}
                    style={[Styles.largeBtn, {flex:1, marginTop: 0, backgroundColor: variables.brandInfo}]}>
                    <Text style={[Styles.largeBtnText, {marginBottom: moderateScale(3)}]}>SUBMIT</Text>
                  </Button>
                </Col>
              </Footer>
            }
        </BaseContainer>;
    }
}

type OverviewTabProps = {
    period: 1 | 2,
    job: Object
};

@observer
class OverviewTab extends React.Component<OverviewTabProps> {

    @observable job: Object = this.props.job;

    @autobind @action
    updateJob() {
        syncJobUpdate(this.job);
    }

    @autobind @action
    updateForm(key: String, value: any, editable: Boolean) {
        // Only reason we have this separate function is because if we wrote
        // a change every time we changed a letter it would be really slow

        // console.log('updateForm: updating "' + key + '" to: ' + String(value));
        if (editable === false){
            return;
        }

        // exceptions for datesampledMonth and day since they're split up
        if (key === "dateSampledDay" || key === "dateSampledMonth") {
            console.log(this.job.dateSampled);
            if (key === "dateSampledMonth") {
                value = moment(this.job.dateSampled).month(value);
            } else if (key === "dateSampledDay") {
                value = moment(this.job.dateSampled).date(value);
            }
            console.log(value);
            this.job.dateSampled = value;
            this.updateJob();
        } else if (key === "plmInstructions") {
            let index = this.job.plmInstructions.indexOf(value);
            if (index >= 0) {
                this.job.plmInstructions.splice(index, 1);
            } else {
                this.job.plmInstructions.push(value);
            }
            this.updateJob();
        } else if (key === "isVerbal") {
            this.job[key] = !this.job[key];
            this.updateJob();
        } else if (key === "resultsPreference" || key === "surveyType") {
            this.job[key] = value;
            this.updateJob();
        } else if (key === "minSurfacing" || key === "minThermal" || (key === "minMisc")) {
            if (value === "") {
              this.job[key] = ""; // 0, but causes weird UI issue
            } else {
              this.job[key] = parseInt(value);
            }
        } else if (key === "turnAroundTime") {
            this.job[key] = parseInt(value);
            this.updateJob();
        } else {
            this.job[key] = value;
        }
    }

    @computed get daysInMonth() {
        const days = Array(moment(this.job.dateSampled).daysInMonth()).fill(null);
        return days.map((month, i) => {
          return(<Item label={String(i+1)} value={String(i+1)} key={String(i+1)} />);
        })
    }

    @computed get surveyOptions() {
        let options = {
            "Bulk Sample": "Bulk Sample",
            "OSHA": "OSHA",
            "AHERA": "AHERA"
        };
        if (!etcUser()) {
            delete options["OSHA"], delete options["AHERA"];
        }
        return options;
    }

    @computed get turnaroundOptions() {
        const options = {};
        for (key in dropdownConfig.turnaroundList) {
            value = dropdownConfig.turnaroundList[key];
            options[value] = key;
        }
        return options;
    }

    @observer
    render(): React.Node {

        const {period} = this.props;
        const editable = this.props.job.editable;
        const PLMOptions = [ "PLM EPA600/R-93/116, 1993 (Standard)",
                             "Point Counting: 400 Points",
                             "PLM Non-Building Material (Dust, Wipe, Tape)",
                             "Stop at 1st Positive",
                             "Soil or Vermiculite Analysis" ];

        console.log('rendering overview tab');

        return <View style={Styles.flexGrow}>

            <Content enableResetScrollToCoords={false}>
              <Form style={[style.tab, Styles.center, { paddingBottom: 0 }]}>
                <ETCTextInput
                  displayName="Facility Name"
                  name="facilityName"
                  value={this.job.facilityName}
                  editable={editable}
                  updateObj={this.updateJob}
                  updateForm={this.updateForm}
                />
                <Item floatingLabel style={style.detailsForm}>
                  <Label><Text style={[Styles.label, Styles.input]}>Facility Address</Text></Label>
                  <Input
                    style={Styles.input}
                    value={this.job.facilityAddress}
                    ref="facilityAddress"
                    editable={this.job.editable}
                    onChangeText={facilityAddress => this.updateForm("facilityAddress", facilityAddress)}
                    onEndEditing={() => this.updateJob()}
                  />
                </Item>
                <Item floatingLabel style={style.detailsForm}>
                  <Label><Text style={[Styles.label, Styles.input]}>Client Project Id #</Text></Label>
                  <Input
                    style={Styles.input}
                    value={this.job.clientProjectId}
                    ref="clientProjectId"
                    editable={this.job.editable}
                    onChangeText={clientProjectId => this.updateForm("clientProjectId", clientProjectId)}
                    onEndEditing={() => this.updateJob()}
                  />
                </Item>
                {/* <ETCPicker
                  displayName="Survey Type"
                  name="surveyType"
                  value={this.job.surveyType}
                  editable={editable}
                  options={this.surveyOptions}
                  updateForm={this.updateForm}
                /> */}
                <ETCPicker
                  displayName="Turnaround Time"
                  name="turnAroundTime"
                  value={String(this.job.turnAroundTime)}
                  editable={editable}
                  options={this.turnaroundOptions}
                  updateForm={this.updateForm}
                  updateObj={this.updateJob}
                />
                <Item last stackedLabel style={style.plmInstructions}>
                  <Label><Text style={[Styles.label, Styles.input]}>PLM Instructions</Text></Label>
                  {
                    PLMOptions.map((option, i) => {
                      return(<ListItem key={i} onPress={value => this.updateForm("plmInstructions", option, editable)}>
                        <CheckBox
                          checked={this.job.plmInstructions && this.job.plmInstructions.indexOf(option) >= 0}
                          color={variables.brandSecondary}
                          onPress={value => this.updateForm("plmInstructions", option, editable)}
                         />
                        <Text style={style.checkboxItem}>{option}</Text>
                      </ListItem>);
                    })
                  }
                </Item>
                {/* <Row style={style.pickerWrapper}>
                  <Col>
                    <Item last style={[Styles.center, {flex:1, flexDirection: 'column'}]}>
                      <Label><Text style={[Styles.label, Styles.textCentered, Styles.input]}>Month Sampled</Text></Label>
                        <Picker
                          mode="dropdown"
                          style={[Styles.picker, {alignSelf: 'center'}]}
                          placeholder="Select Month"
                          ref="dateSampledMonth"
                          enabled={editable}
                          selectedValue={String(moment(this.job.dateSampled).format("MMMM"))}
                          onValueChange={dateSampledMonth => this.updateForm("dateSampledMonth", dateSampledMonth, editable)}
                        >
                          {
                            moment.months().map((month, i) => {
                              return(<Item label={month} value={month} key={i} />);
                            })
                          }
                        </Picker>
                    </Item>
                  </Col>
                  <Col>
                    <Item last style={[Styles.center, {flex: 1, flexDirection: 'column'}]}>
                      <Label><Text style={[Styles.label, Styles.textCentered, Styles.input]}>Day Sampled</Text></Label>
                        <Picker
                          mode="dropdown"
                          placeholder="Select Day"
                          style={[Styles.picker, {alignSelf: 'center'}]}
                          ref="dateSampledDay"
                          enabled={editable}
                          selectedValue={moment(this.job.dateSampled).format("D")}
                          onValueChange={dateSampledDay => this.updateForm("dateSampledDay", dateSampledDay, editable)}
                        >
                          {
                            this.daysInMonth
                          }
                        </Picker>
                    </Item>
                  </Col>
                </Row> */}
              </Form>

              <ListItem itemDivider>
                <Text style={Styles.dividerText}>MINIMUM # OF SAMPLES FOR...</Text>
              </ListItem>

              <Form style={[style.tab, Styles.center, {paddingTop: moderateScale(5), paddingBottom: 0 }]}>
                <Row style={style.pickerWrapper}>
                  <Col>
                    <Item floatingLabel last style={style.detailsForm}>
                      <Label><Text style={[Styles.label, Styles.center, Styles.input]}>Surfacing</Text></Label>
                      <Input
                        style={[Styles.input, , {textAlign: 'center'}]}
                        value={String(this.job.minSurfacing)}
                        ref="minSurfacing"
                        keyboardType = 'numeric'
                        editable={this.job.editable}
                        onChangeText={minSurfacing => this.updateForm("minSurfacing", minSurfacing)}
                        onEndEditing={() => this.updateJob()}
                      />
                    </Item>
                  </Col>
                  <Col>
                    <Item floatingLabel last style={style.detailsForm}>
                      <Label><Text style={[Styles.label, Styles.center, Styles.input]}>Thermal</Text></Label>
                      <Input
                        style={[Styles.input, {textAlign: 'center'}]}
                        value={String(this.job.minThermal)}
                        ref="minThermal"
                        keyboardType = 'numeric'
                        editable={this.job.editable}
                        onChangeText={minThermal => this.updateForm("minThermal", minThermal)}
                        onEndEditing={() => this.updateJob()}
                      />
                    </Item>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Item floatingLabel last style={style.detailsForm}>
                      <Label><Text style={[Styles.label, Styles.textCentered, Styles.input]}>Misc</Text></Label>
                      <Input
                        style={[Styles.input, {textAlign: 'center'}]}
                        value={String(this.job.minMisc)}
                        ref="minMisc"
                        keyboardType = 'numeric'
                        editable={this.job.editable}
                        onChangeText={minMisc => this.updateForm("minMisc", minMisc)}
                        onEndEditing={() => this.updateJob()}
                      />
                    </Item>
                  </Col>
                  <Col></Col>
                </Row>

              </Form>

              <ListItem itemDivider>
                <Text style={Styles.dividerText}>PREFERENCES</Text>
              </ListItem>

              <Form style={[style.tab, Styles.center, {paddingTop: moderateScale(5) }]}>

                <ETCCheckbox
                  displayName="Call you with results?"
                  name="isVerbal"
                  editable={editable}
                  updateForm={this.updateForm}
                  value={this.job.isVerbal}
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
        padding: moderateScale(variables.contentPadding * 3)
    },
    detailsForm: {
        marginLeft: 0,
        marginTop: moderateScale(15),
        marginBottom: moderateScale(15),
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
        marginTop: moderateScale(15),
        marginBottom: moderateScale(15),
    }
});
