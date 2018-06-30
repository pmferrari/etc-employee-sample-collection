// @flow
import autobind from "autobind-decorator";
import moment from "moment";
import * as React from "react";
import {StyleSheet, View, Text, Platform, Alert, TouchableOpacity} from "react-native";
import {Tab, Tabs, TabHeading, H1, Fab, Form, Item, Label,
  Icon, Footer, Button, Input, Picker, Grid, Col, Row,
  Content, ListItem, CheckBox, Body, Left, Right} from "native-base";
import {observable, action, computed, runInAction} from "mobx";
import {observer} from "mobx-react/native";
import {syncMaterialUpdate, deleteMaterial, createNewSample, clientJobs, materialsConfig, etcUser,
        createNewRoom} from '../helpers/etcAPI';
import {possibleColors, possibleSizes, possibleNotes1} from '../helpers/config';

import {Styles, BaseContainer, Material, Sample, ETCSpinner, Room,
        ETCTextInput, ETCPicker, ETCCheckbox} from "../components";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

import variables from "../../native-base-theme/variables/commonColor";

import type {ScreenProps} from "../components/Types";

const DETAILS = 1;
const SAMPLES = 2;
// const MONTH = 3;

@observer
export default class MaterialOverview extends React.Component<ScreenProps<>> {

    @observable material = this.props.navigation.state.params.material;
    jobId = this.props.navigation.state.params.jobId;
    materialUpdate = this.props.navigation.state.params.materialUpdate;
    editable = this.props.navigation.state.params.editable;

    @autobind
    async updateSampleOrRoom() {
        let materialIndex = clientJobs[this.jobId].materials.map(function(x) {return x.id; }).indexOf(this.material.id);
        await runInAction("Updating Material Samples", async () => {
            for (key in clientJobs[this.jobId].materials[materialIndex]) {
                this.material[key] = clientJobs[this.jobId].materials[materialIndex][key];
            }
        });
        this.materialUpdate();
        this.forceUpdate();
    }

    // @autobind
    // async updateRoom() {
    //     console.log("UPDATE ROOM WAS CALLED");
    //     let materialIndex = clientJobs[this.jobId].materials.map(function(x) {return x.id; }).indexOf(this.material.id);
    //     await runInAction("Updating Material Rooms", async () => {
    //         for (key in clientJobs[this.jobId].materials[materialIndex]) {
    //             this.material[key] = clientJobs[this.jobId].materials[materialIndex][key];
    //         }
    //     });
    //     console.log("FORCE UPDATED THE ROOM");
    //     this.materialUpdate();
    //     this.forceUpdate();
    // }

    @autobind
    async removeMaterial() {
        const {jobId} = this.props.navigation.state.params;
        console.log('deleting the material!');
        await deleteMaterial(this.material.id, jobId);
        this.materialUpdate();
        console.log('successfully deleted the material');
        this.props.navigation.goBack();
    }

    @autobind
    toggleBackDelete() {
        if (this.material.name === "") {
            this.removeMaterial();
        } else {
            this.props.navigation.goBack();
        }
    }

    @autobind
    verifyDelete() {
        Alert.alert(
          'Deleting ' + String(this.material.name),
          'Are you sure you want to permanently delete this material?',
          [
            {text: 'Yes, delete this material', onPress: () => this.removeMaterial(), style: 'destructive'},
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          ],
          { cancelable: false }
        );
    }

    @autobind
    async createSample() {
        const newSample = await createNewSample(this.material.id, this.jobId);
        newSample.materialId = this.material.id;
        newSample.jobId = this.jobId;
        newSample.editable = true;
        this.updateSampleOrRoom();
        console.log('newSample is');
        this.props.navigation.navigate("SampleOverview", {
            sample: newSample,
            updateSample: this.updateSampleOrRoom
        });
    }

    @autobind
    async createRoom() {
        const newRoom = await createNewRoom(this.material.id, this.jobId);
        this.updateSampleOrRoom();
        this.props.navigation.navigate("RoomOverview", {
            room: newRoom,
            updateRoom: this.updateSampleOrRoom,
            editable: this.editable,
            materialId: this.material.id,
            jobId: this.jobId
        });
    }

    @observer
    @computed get generateRooms() {
        return this.material.rooms.map((room, i) => {
          console.log(room.floor);
          return(<Room
            room={room}
            key={i}
            index={i}
            editable={this.editable}
            jobId={this.jobId}
            materialId={this.material.id}
            navigation={this.props.navigation}
            updateRoom={this.updateSampleOrRoom}
           />);
        })
    }

    @observer
    @computed get generateSamples() {
        return this.material.samples.map((sample, i) => {
          const {jobId} = this.props.navigation.state.params;
          console.log(sample.sampleLocation);
          return(<Sample
            {...sample}
            key={i}
            editable={this.editable}
            jobId={jobId}
            materialId={this.material.id}
            navigation={this.props.navigation}
            updateSample={this.updateSampleOrRoom}
           />);
        })
    }

    @observer
    render(): React.Node {
        const {editable, jobId, materialUpdate} = this.props.navigation.state.params;
        const tabStyle = editable ? undefined : {backgroundColor: variables.mediumGray};
        const addBtn = etcUser() && clientJobs[jobId].surveyType === "AHERA" ? false : true;
        console.log('in material overview now');
        return <BaseContainer
          title="Material Overview"
          navigation={this.props.navigation}
          deleteBtn={this.verifyDelete}
          add={addBtn}
          backBtn
          backFunction={this.toggleBackDelete}
          >
            <Tabs tabBarUnderlineStyle={Styles.tabUnderline}>
                <Tab
                  heading="Details"
                  textStyle={Styles.tabTextStyle}
                  activeTextStyle={Styles.activeTabTextStyle}
                  style={tabStyle}>
                    <MaterialOverviewTab period={DETAILS} material={this.material} jobId={jobId} update={materialUpdate} />
                </Tab>
                {
                    etcUser() && clientJobs[jobId].surveyType === "AHERA" && <Tab
                      heading={"Rooms"}
                      textStyle={Styles.tabTextStyle}
                      activeTextStyle={Styles.activeTabTextStyle}
                      style={[tabStyle, {flex:1}]}>
                      <Content>
                        {this.generateRooms}
                      </Content>
                      {
                        editable && <Fab
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
                          onPress={() => this.createRoom()}>
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
                }

                <Tab
                  heading="Samples"
                  textStyle={Styles.tabTextStyle}
                  activeTextStyle={Styles.activeTabTextStyle}
                  style={[tabStyle, {flex:1}]}>
                  <Content>
                    {this.generateSamples}
                  </Content>
                  {
                    editable && <Fab
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
                      onPress={() => this.createSample()}>
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
              editable && <Footer style={{backgroundColor: variables.white}}>
                <Button full large
                  style={[Styles.largeBtn, {flex:1, marginTop: 0}]}
                  onPress={() => this.props.navigation.goBack()}
                  >
                  <Text style={[Styles.largeBtnText, {marginBottom: moderateScale(5)}]}>SAVE MATERIAL</Text>
                </Button>
              </Footer>
            }
        </BaseContainer>;
    }
}

type MaterialOverviewTabProps = {
    period: 1 | 2,
    material: Object,
    jobId: String,
    update: Function
};

@observer
class MaterialOverviewTab extends React.Component<MaterialOverviewTabProps> {

    @observable material: Object = this.props.material;
    @observable sizeOther: Boolean = possibleSizes.indexOf(this.props.material.size) < 0;
    @observable noteOther: Boolean = possibleNotes1.indexOf(this.props.material.note1) < 0;
    @observable materialNameOther: Boolean = Object.keys(materialsConfig).indexOf(this.props.material.name) < 0;
    @observable loading: Boolean = false;
    @observable oharaVisible: Boolean = false;
    originalMaterial = JSON.parse(JSON.stringify(this.props.material));

    @autobind @action
    setMaterialNameOther(value: Boolean) {
        this.materialNameOther = value;
    }

    @autobind @action
    setSizeOther(value: Boolean) {
        this.sizeOther = value;
    }

    @autobind @action
    setNoteOther(value: Boolean) {
        this.noteOther = value;
    }

    @autobind @action
    updateMaterial() {
        console.log('updateMaterial: beginning function');
        syncMaterialUpdate(this.material, this.originalMaterial, this.props.jobId);
        this.props.update();
        // console.log(value);
        // exceptions for datesampledMonth and day since they're split up
    }

    @autobind @action
    async updateForm(key: String, value: any, editable: Boolean) {
        // Only reason we have this separate function is because if we wrote
        // a change every time we changed a letter it would be really slow
        console.log('updateForm: updating "' + key + '" to: ' + String(value));
        if (editable === false || value === "Select...") {
            console.log('not editing nothing');
            return;
        }

        if (key === "materialNameDropdown") {
            this.loading = true;
            this.material["name"] = value;
            // this.material.clientMaterialId = materialsConfig[value].materialNumber;
            this.material.materialSub = "";
            this.material.classification = "";
            this.material.friable = "";
            this.material.units = "";
            this.updateMaterial();
            this.loading = false;
            this.setMaterialNameOther(false);
        } else if (key === "materialNameOther") {
            this.material["name"] = value;
            this.material.materialSub = "";
            this.material.classification = "";
            this.material.friable = "";
            this.material.units = "";
            this.updateMaterial();
            this.setMaterialNameOther(true);
        } else if (key === "materialSub") {
            config = materialsConfig[this.material.name].materialSubs[value];

            this.loading = true;
            this.material[key] = value;
            this.material["friable"] = config.friable;
            this.material["classification"] = config.classification;
            this.material["units"] = config.units;
            this.updateMaterial();
            // setTimeout(() => {
            //     runInAction("Loading", async () => {
            //         this.loading = false;
            //     });
            // }, 250);
            this.loading = false;
        } else if (key === "quantity") {
            if (value === "") {
                this.material[key] = value;
            } else {
                this.material[key] = parseFloat(value);
            }
        } else if (key === "sizeOther") {
            this.material["size"] = value;
            this.setSizeOther(true);
        } else if (key === "sizeDropdown") {
            this.material["size"] = value;
            this.setSizeOther(false);
            this.updateMaterial();
        } else if (key === "noteOther") {
            this.setNoteOther(true);
            this.material.note1 = value;
        } else if (key === "noteDropdown") {
            this.setNoteOther(false);
            this.material.note1 = value;
            this.updateMaterial();
        } else if (key === "location" || key === "note2") {
            this.material[key] = value;
        } else if (key === "assumed" || key === "positive") {
            this.material[key] = !this.material[key];
            this.updateMaterial();
        } else {
            this.material[key] = value;
            this.updateMaterial();
        }
    }

    @computed get materialNameOptions() {
        let options = { "Select...": "Select..." };
        for (key of Object.keys(materialsConfig)) {
            options[key] = key;
        }
        return options;
    }

    @computed get materialSubOptions() {
        if (this.material.name === "" || this.materialNameOther) {
            return;
        } else {
            const options = Object.keys(materialsConfig[this.material.name].materialSubs);
            options.unshift("Select...");
            return options.map((option, i) => {
              return(<Item label={option} value={option} key={i} />);
            })
        }
    }

    @autobind @action
    toggleOhara() {
        this.oharaVisible = !this.oharaVisible;
    }

    componentWillMount() {
        const oharaFields = [ 'damageType', 'floor' ];
        for (field of oharaFields) {
            if (this.props.material[field] !== "") {
                this.oharaVisible = true;
                break;
            }
        }
    }

    @observer
    render(): React.Node {
        const {period} = this.props;
        const editable = this.props.material.editable;
        const oharaDisplay = this.oharaVisible ? undefined : 'none';
        const oharaIcon = this.oharaVisible ? 'ios-arrow-down' : 'ios-arrow-forward';
        console.log('rendering material overview tab');
        // console.log(this.material);
        return <View style={Styles.flexGrow}>
            <ETCSpinner visible={this.loading} />
            <Content enableResetScrollToCoords={false} keyboardShouldPersistTaps={'always'}>
              <Form style={[style.tab, Styles.center]}>

                <ETCPicker
                  displayName="Material Name"
                  name="materialNameDropdown"
                  value={this.material.name}
                  editable={editable}
                  options={this.materialNameOptions}
                  updateForm={this.updateForm}
                  updateObj={this.updateMaterial}
                  other={this.materialNameOther}
                  otherName="materialNameOther"
                />

                <Item style={style.pickerWrapper}>
                  <Col>
                    <Label><Text style={[Styles.label, Styles.input]}>Material Sub</Text></Label>
                  </Col>
                  <Col>
                    <Picker
                      mode="dropdown"
                      style={Styles.picker}
                      placeholder="Select Material Sub"
                      ref="materialSub"
                      enabled={editable}
                      selectedValue={this.material.materialSub}
                      onValueChange={materialSub => this.updateForm("materialSub", materialSub, editable)}
                    >
                      { this.materialSubOptions }
                    </Picker>
                  </Col>
                </Item>
                <Item style={style.pickerWrapper}>
                  <Col>
                    <Label><Text style={[Styles.label, Styles.input]}>Classification</Text></Label>
                  </Col>
                  <Col>
                    <Picker
                      mode="dropdown"
                      style={Styles.picker}
                      placeholder="Select Classification"
                      ref="classification"
                      enabled={editable}
                      selectedValue={this.material.classification}
                      onValueChange={classification => this.updateForm("classification", classification, editable)}
                    >
                      <Item label={"Select..."} value={"Select..."} />
                      <Item label={"Surfacing"} value={"S"} />
                      <Item label={"Thermal"} value={"T"} />
                      <Item label={"Misc"} value={"M"} />
                    </Picker>
                  </Col>
                </Item>
                <ETCTextInput
                  displayName="Location"
                  name="location"
                  value={this.material.location}
                  editable={editable}
                  updateObj={this.updateMaterial}
                  updateForm={this.updateForm}
                />
                <Item style={style.pickerWrapper}>
                  <Col>
                    <Label><Text style={[Styles.label, Styles.input]}>Friable</Text></Label>
                  </Col>
                  <Col>
                    <Picker
                      mode="dropdown"
                      style={Styles.picker}
                      placeholder="Select Friability"
                      ref="friable"
                      enabled={editable}
                      selectedValue={this.material.friable}
                      onValueChange={friable => this.updateForm("friable", friable, editable)}
                    >
                      <Item label={"Select..."} value={"Select..."} />
                      <Item label={"Friable"} value={"F"} />
                      <Item label={"Cat 1-NF"} value={"Cat 1-NF"} />
                      <Item label={"Cat 2-NF"} value={"Cat 2-NF"} />
                    </Picker>
                  </Col>
                </Item>
                <Item style={style.pickerWrapper}>
                  <Col>
                    <Label><Text style={[Styles.label, Styles.input]}>Color</Text></Label>
                  </Col>
                  <Col>
                    <Picker
                      mode="dialog"
                      style={Styles.picker}
                      placeholder="Select Color"
                      ref="color"
                      enabled={editable}
                      selectedValue={this.material.color}
                      onValueChange={color => this.updateForm("color", color, editable)}
                    >
                      {
                        possibleColors.map((color, i) => {
                          return(<Item label={color} value={color} key={i} />)
                        })
                      }
                    </Picker>
                  </Col>
                </Item>

                <ETCTextInput
                  displayName="Quantity"
                  name="quantity"
                  value={this.material.quantity}
                  editable={editable}
                  updateObj={this.updateMaterial}
                  updateForm={this.updateForm}
                />
                <ETCPicker
                  displayName="Units"
                  name="units"
                  value={this.material.units}
                  editable={editable}
                  options={{
                    "Select...": "Select...",
                    "Sq Ft": "SF",
                    "Linear Feet": "LF",
                    "Cubic Yards": "CY",
                    "Units": "Units"
                  }}
                  updateForm={this.updateForm}
                />

                <Item last style={style.pickerWrapper}>
                  <Col>
                    <Label><Text style={[Styles.label, Styles.input]}>Size</Text></Label>
                  </Col>
                  <Col style= {{marginLeft: 0, paddingLeft: 0, marginRight: 10}}>
                    <Picker
                      mode="dialog"
                      style={[Styles.picker, {flex:1, paddingLeft:0, marginLeft: 0}]}
                      placeholder="Select Size"
                      ref="size"
                      enabled={editable}
                      selectedValue={this.sizeOther ? "" : this.material.size}
                      onValueChange={size => this.updateForm("sizeDropdown", size, editable)}
                    >
                      {
                        possibleSizes.map((size, i) => {
                          return(<Item label={size} value={size} key={i} />)
                        })
                      }
                    </Picker>
                  </Col>
                  <Col>
                    <Item style={[style.detailsForm]}>
                      <Input
                        style={Styles.input}
                        value={this.sizeOther ? this.material.size : ""}
                        ref="size"
                        placeholder={"Other.."}
                        editable={editable}
                        onChangeText={size => this.updateForm("sizeOther", size)}
                        onEndEditing={() => this.updateMaterial()}
                      />
                    </Item>
                  </Col>
                </Item>

                <Item last style={style.pickerWrapper}>
                  <Col>
                    <Label><Text style={[Styles.label, Styles.input]}>Note 1</Text></Label>
                  </Col>
                  <Col style= {{marginLeft: 0, paddingLeft: 0, marginRight: 10}}>
                    <Picker
                      mode="dialog"
                      style={[Styles.picker, {flex:1, paddingLeft:0, marginLeft: 0}]}
                      placeholder="Select Note"
                      ref="note1"
                      enabled={editable}
                      selectedValue={this.noteOther ? "" : this.material.note1}
                      onValueChange={note1 => this.updateForm("noteDropdown", note1, editable)}
                    >
                      {
                        possibleNotes1.map((note, i) => {
                          return(<Item label={note} value={note} key={i} />)
                        })
                      }
                    </Picker>
                  </Col>
                  <Col>
                    <Item style={[style.detailsForm]}>
                      <Input
                        style={Styles.input}
                        value={this.noteOther ? this.material.note1 : ""}
                        ref="note1"
                        placeholder={"Other.."}
                        editable={editable}
                        onChangeText={note1 => this.updateForm("noteOther", note1)}
                        onEndEditing={() => this.updateMaterial()}
                      />
                    </Item>
                  </Col>
                </Item>

                <Item floatingLabel style={[style.detailsForm, { marginBottom: moderateScale(10)}]}>
                  <Label><Text style={[Styles.label, Styles.input]}>Notes 2</Text></Label>
                  <Input
                    style={Styles.input}
                    value={this.material.note2}
                    ref="note2"
                    editable={editable}
                    onChangeText={note2 => this.updateForm("note2", note2)}
                    onEndEditing={() => this.updateMaterial()}
                  />
                </Item>

                <Item last stackedLabel style={style.plmInstructions}>
                  <ListItem last
                    onPress={value => this.updateForm("assumed", value, editable)}>
                    <CheckBox
                      checked={this.material.assumed}
                      color={variables.brandSecondary}
                      onPress={value => this.updateForm("assumed", value, editable)}
                     />
                    <Text style={style.checkboxItem}>Assumed{" "}</Text>
                  </ListItem>
                </Item>

                <ETCCheckbox
                  displayName="Positive"
                  name="positive"
                  editable={editable}
                  updateForm={this.updateForm}
                  value={this.material.positive}
                />

              </Form>


              {
                clientJobs[this.props.jobId].surveyType === "OSHA" && <View>
                  <ListItem itemDivider>
                    <Text style={Styles.dividerText}>OSHA DETAILS</Text>
                  </ListItem>
                  <Form style={[style.tab, Styles.center, {marginTop: moderateScale(10) }]}>
                    <ETCTextInput
                      displayName="Location"
                      name="location"
                      value={this.material.location}
                      editable={editable}
                      updateObj={this.updateMaterial}
                      updateForm={this.updateForm}
                    />
                    <ETCTextInput
                      displayName="Quantity"
                      name="quantity"
                      value={this.material.quantity}
                      editable={editable}
                      updateObj={this.updateMaterial}
                      updateForm={this.updateForm}
                    />
                    <ETCPicker
                      displayName="Units"
                      name="units"
                      value={this.material.units}
                      editable={editable}
                      options={{
                        "Select...": "Select...",
                        "Sq Ft": "SF",
                        "Linear Feet": "LF",
                        "Cubic Yards": "CY",
                        "Units": "Units"
                      }}
                      updateForm={this.updateForm}
                    />
                  </Form>
                </View>
              }

              <View style={{marginTop: moderateScale(50)}}></View>
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
    },
    oharaIcon: {
      fontSize: moderateScale(30),
      marginRight: moderateScale(15)
    }
});
