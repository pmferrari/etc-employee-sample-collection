// @flow
import autobind from "autobind-decorator";
import { observable, action, computed, runInAction, autorun } from "mobx";
import { observer } from "mobx-react/native";
import * as React from "react";
import {View, StyleSheet, ScrollView} from "react-native";
import {H1, Button, Text, Tabs, Tab, ScrollableTab, List, Footer} from "native-base";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Modal from 'react-native-modalbox';

import {BaseContainer, Avatar, JobOverview, Small, Styles, Job, ETCSpinner} from "../components";
import variables from "../../native-base-theme/variables/commonColor";
import type {ScreenProps} from "../components/Types";
import { grabClientJobs, clientJobs, createNewJob, toastHelper, etcUser } from '../helpers/etcAPI';

@observer
export default class Jobs extends React.Component<ScreenProps<>> {

    @observable jobs = clientJobs;
    @observable loading = false;

    // @observer
    @computed get renderInProgressJobs() {
        inProgressJobs = [];
        for (key in this.jobs) {
            if (this.jobs[key].statusId === 1) {
                inProgressJobs.push(this.jobs[key]);
            }
        }
        return this.renderJobComponents(inProgressJobs);
    }

    // @observer
    @computed get renderSubmittedJobs() {
        submittedJobs = [];
        for (key in this.jobs) {
            if (this.jobs[key].statusId !== 1) {
                submittedJobs.push(this.jobs[key]);
            }
        }
        return this.renderJobComponents(submittedJobs);
    }

    @autobind
    async syncUpdates() {
      console.log('running job updates');
        jobs = await grabClientJobs();
        runInAction("Updating Jobs", async () => {
            this.jobs = clientJobs;
            this.forceUpdate();
        });
    }

    @observer
    renderJobComponents(inProgress: Boolean) {
      jobList = [];
      for (key in this.jobs) {
          if (inProgress && this.jobs[key].statusId === 1) { // 1 == "In Progress"
              jobList.push(this.jobs[key]);
          } else if (!inProgress && this.jobs[key].statusId !== 1) {
              jobList.push(this.jobs[key]);
          }
      }
      return jobList.map((jobInfo, key) => {
        return (
          <Job
            key={key}
            jobId={jobInfo.jobId}
            clientId={jobInfo.clientId}
            facilityName={jobInfo.facilityName}
            facilityAddress={jobInfo.facilityAddress}
            resultsPreference={jobInfo.resultsPreference}
            turnAroundTime={jobInfo.turnAroundTime}
            editedOn={jobInfo.editedOn}
            PLMInstructions={jobInfo.PLMInstructions}
            materials={jobInfo.materials}
            editable={jobInfo.editable}
            statusId={jobInfo.statusId}
            clientProjectId={jobInfo.clientProjectId}
            clientName={jobInfo.clientName}
            dateSampled={jobInfo.dateSampled}
            minSurfacing={jobInfo.minSurfacing}
            minThermal={jobInfo.minThermal}
            minMisc={jobInfo.minMisc}
            navigation={this.props.navigation}
            syncUpdates={this.syncUpdates}
          />
        );
      });
    }

    @autobind
    async createJob() {
        this.refs.jobTypeModal.close();
        if (etcUser()) {
            toastHelper("ETC Users Can't Create New Jobs");
        } else {
            const newJob = await createNewJob();
            newJob.syncUpdates = this.syncUpdates;
            // await this.syncUpdates();
            setTimeout(() => {
                this.props.navigation.navigate("Overview", { job: newJob });
            }, 500);
        }
    }

    @autobind
    async refreshJobs() {
        console.log('refreshing baby');
        jobs = await grabClientJobs(refresh=true);
        await runInAction("Updating Jobs", async () => {
            this.jobs = clientJobs;
            this.forceUpdate();
        });
    }

    @observer
    async componentWillMount() {
        await runInAction("Updating Loading", async () => {
            this.loading = true;
        });
        jobs = await grabClientJobs();
        await runInAction("Updating Jobs", async () => {
            this.jobs = clientJobs;
            this.loading = false;
        });
    }

    @observer
    render(): React.Node {
        return <BaseContainer
                  title="Jobs"
                  navigation={this.props.navigation}
                  add={() => this.refs.jobTypeModal.open()}
                  refresh={this.refreshJobs}>
            <ETCSpinner visible={this.loading}/>
            <Modal style={[Styles.center, {height: moderateScale(450) }]} position={"bottom"} ref={"jobTypeModal"}>
              <Text style={style.jobTypeText}>What type of samples are you collecting?</Text>
              <View>
                <Button full large style={[Styles.modalBtn]} onPress={() => this.createJob()}>
                  <Text style={[Styles.modalBtnText]}>ASBESTOS</Text>
                </Button>
                <Button full large style={[Styles.modalBtn, {backgroundColor: variables.darkGray}]} onPress={() => toastHelper("Coming Soon!")}>
                  <Text style={[Styles.modalBtnText, {color: variables.gray}]}>LEAD</Text>
                </Button>
                <Button full large style={[Styles.modalBtn, {backgroundColor: variables.darkGray}]} onPress={() => toastHelper("Coming Soon!")}>
                  <Text style={[Styles.modalBtnText, {color: variables.gray}]}>MOLD</Text>
                </Button>
                <Button full large style={[Styles.modalBtn, {backgroundColor: variables.darkGray}]} onPress={() => toastHelper("Coming Soon!")}>
                  <Text style={[Styles.modalBtnText, {color: variables.gray}]}>OTHER</Text>
                </Button>
              </View>
              {/* <Slider style={{width: 200}} value={this.state.sliderValue} onValueChange={(value) => this.setState({sliderValue: value})} /> */}
            </Modal>

            <Tabs tabBarUnderlineStyle={Styles.tabUnderline}>
             <Tab
               heading="In Progress"
               textStyle={Styles.tabTextStyle}
               activeTextStyle={Styles.activeTabTextStyle}>
               <ScrollView>
                 <List>
                   { this.renderJobComponents(true) }
                 </List>
               </ScrollView>
               <Footer style={{backgroundColor: variables.white}}>
                 <Button full large style={[Styles.largeBtn, {flex:1, marginTop: 0}]} onPress={() => this.refs.jobTypeModal.open()}>
                   <Text style={[Styles.largeBtnText, {marginBottom: moderateScale(5)}]}>CREATE NEW JOB</Text>
                 </Button>
               </Footer>
             </Tab>
             <Tab heading="Submitted" textStyle={Styles.tabTextStyle} activeTextStyle={Styles.activeTabTextStyle}>
               <ScrollView>
                 <List>
                   { this.renderJobComponents(false) }
                 </List>
               </ScrollView>
             </Tab>
           </Tabs>
        </BaseContainer>;
    }
}

const style = StyleSheet.create({
    jobTypeText: {
        fontSize: moderateScale(20),
        lineHeight: moderateScale(24),
        textAlign: 'center',
        paddingTop: 0,
        marginBottom: moderateScale(15)
    }
});
