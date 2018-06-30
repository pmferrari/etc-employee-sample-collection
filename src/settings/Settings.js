// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, Text, StyleSheet} from "react-native";
import {Switch, List, ListItem, Body, Right, Form, Icon, Item, Col, Picker, Content, Label, Input, Footer, Button} from "native-base";
import {observable, action, runInAction} from "mobx";
import { observer } from "mobx-react/native";
import { syncProfileUpdate, userProfile, updateUser } from '../helpers/etcAPI';

import {BaseContainer, Styles, Avatar, Field, ETCSpinner} from "../components";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

import variables from "../../native-base-theme/variables/commonColor";

import type {ScreenProps} from "../components/Types";

@observer
export default class Settings extends React.Component<ScreenProps<>> {

    @observable userSettings = userProfile;
    @observable loading = false;

    @autobind
    async sendUserUpdates() {
        console.log('sending user updates');
        await runInAction("Updating Screen", async () => {
            this.loading = true;
        });
        await updateUser();
        await runInAction("Updating Screen", async () => {
            this.loading = false;
        });
        this.props.navigation.navigate("DrawerOpen");
    }

    @autobind @action
    updateProfile() {
        console.log('updateProfile: beginning function');
        syncProfileUpdate(this.userSettings);
    }

    @autobind @action
    updateForm(key: String, value: any) {
        console.log('updateForm: updating "' + key + '" to: ' + String(value));

        if (key === "companyName") {
            this.userSettings.client.name = value;
        } else if (key === "fax") {
            this.userSettings.client.fax = value;
        } else {
            this.userSettings[key] = value;
        }

        if (key === "resultsPreference") {
            this.updateProfile();
        }
    }

    @observer
    render(): React.Node {
        return <BaseContainer title="Settings" navigation={this.props.navigation}>

            <ETCSpinner visible={this.loading} />
            <Content enableResetScrollToCoords={false}>
              <View style={[Styles.settingsHeader, Styles.center, Styles.whiteBg]}>
                  <Icon name="ios-options-outline" style={style.headerIcon} />
              </View>
              <List>
                  {/* <ListItem itemDivider>
                      <Text>PREFERENCES</Text>
                  </ListItem> */}

                  <Form style={style.updateFields}>
                    <Item floatingLabel style={style.detailsForm}>
                      <Label><Text style={[Styles.label, Styles.input]}>Contact Name</Text></Label>
                      <Input
                        style={Styles.input}
                        value={this.userSettings.name}
                        ref="name"
                        onChangeText={name => this.updateForm("name", name)}
                        onEndEditing={() => this.updateProfile()}
                      />
                    </Item>
                    <Item style={style.pickerWrapper}>
                      <Col>
                        <Label><Text style={[Styles.label, Styles.input]}>Results Preference</Text></Label>
                      </Col>
                      <Col>
                        <Picker
                          mode="dropdown"
                          style={Styles.picker}
                          placeholder="Select Preference"
                          ref="resultsPreference"
                          selectedValue={this.userSettings.resultsPreference}
                          onValueChange={resultsPreference => this.updateForm("resultsPreference", resultsPreference)}
                        >
                          <Item label={"Email"} value={"Email"} />
                          <Item label={"Phone"} value={"Phone"} />
                          <Item label={"Fax"} value={"Fax"} />
                        </Picker>
                      </Col>
                    </Item>
                    <Item floatingLabel style={style.detailsForm}>
                      <Label><Text style={[Styles.label, Styles.input]}>Phone</Text></Label>
                      <Input
                        style={Styles.input}
                        value={this.userSettings.cell}
                        ref="cell"
                        keyboardType={'phone-pad'}
                        onChangeText={cell => this.updateForm("cell", cell)}
                        onEndEditing={() => this.updateProfile()}
                      />
                    </Item>
                    <Item floatingLabel style={style.detailsForm}>
                      <Label><Text style={[Styles.label, Styles.input]}>Email</Text></Label>
                      <Input
                        style={Styles.input}
                        value={this.userSettings.email}
                        ref="email"
                        keyboardType={'email-address'}
                        onChangeText={email => this.updateForm("email", email)}
                        onEndEditing={() => this.updateProfile()}
                      />
                    </Item>
                    <Item floatingLabel style={style.detailsForm}>
                      <Label><Text style={[Styles.label, Styles.input]}>Fax (opt.)</Text></Label>
                      <Input
                        style={Styles.input}
                        value={this.userSettings.client.fax}
                        ref="fax"
                        keyboardType={'phone-pad'}
                        onChangeText={fax => this.updateForm("fax", fax)}
                        onEndEditing={() => this.updateProfile()}
                      />
                    </Item>
                    <Item floatingLabel style={style.detailsForm}>
                      <Label><Text style={[Styles.label, Styles.input]}>Company Name</Text></Label>
                      <Input
                        style={Styles.input}
                        value={this.userSettings.client.name}
                        ref="name"
                        editable={false}
                        onChangeText={companyName => this.updateForm("companyName", companyName)}
                        onEndEditing={() => this.updateProfile()}
                      />
                    </Item>
                  </Form>
              </List>
            </Content>
            <Footer style={{backgroundColor: variables.white}}>
              <Button full large
                onPress={() => this.sendUserUpdates()}
                style={[Styles.largeBtn, {flex:1, marginTop: 0}]}>
                <Text style={[Styles.largeBtnText, {marginBottom: moderateScale(5)}]}>SAVE PREFERENCES</Text>
              </Button>
            </Footer>

        </BaseContainer>;
    }
}

@observer
class SettingsSwitch extends React.Component<{}> {

    @observable value: boolean = true;

    @autobind @action
    toggle() {
        this.value = !this.value;
    }

    render(): React.Node {
        return <Switch
            value={this.value}
            onValueChange={this.toggle}
            onTintColor="rgba(80, 210, 194, .5)"
            thumbTintColor={this.value ? variables.brandInfo : "#BEBEC1"}
        />;
    }
}

const style = StyleSheet.create({
    detailsForm: {
        marginLeft: 0,
        marginTop: moderateScale(15),
        marginBottom: moderateScale(15),
        borderBottomColor: 'rgba(82, 98, 163, 0.3)'
    },
    pickerWrapper: {
        marginLeft: 0,
        marginTop: moderateScale(15),
        marginBottom: moderateScale(15),
    },
    updateFields: {
        padding: moderateScale(variables.contentPadding * 3)
    },
    headerIcon: {
        fontSize: moderateScale(60),
        color: variables.brandSecondary
    }
});
