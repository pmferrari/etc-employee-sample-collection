// @flow
import autobind from "autobind-decorator";
import moment from "moment";
import * as React from "react";
import {View, Text, StyleSheet} from "react-native";
import {H3, ListItem} from "native-base";
import {observable, action, computed} from "mobx";
import {observer} from "mobx-react/native";

import {Avatar, Styles} from "../components";

import variables from "../../native-base-theme/variables/commonColor";
import Circle from "../components/Circle";
import { moderateScale } from 'react-native-size-matters';
import { toastHelper, dropdownConfig, etcUser } from '../helpers/etcAPI';



type JobProps = {
    key: string,
    jobId: string,
    clientId: string,
    facilityName: string,
    facilityAddress: string,
    resultsPreference: string,
    turnAroundTime: string,
    editedOn: string,
    PLMInstructions: array,
    materials: array,
    editable: boolean,
    statusId: number,
    clientProjectId: string,
    clientName: string,
    dateSampled: string,
    syncUpdates: Function
};

@observer
export default class Job extends React.Component<JobProps> {

    @observable job = this.props;

    static defaultProps = {
        collaborators: []
    }

    goToOverview() {
        this.props.navigation.navigate("Overview", { job: this.props });
    }

    render(): React.Node {
        const {facilityName, statusId, collaborators, timeline, editable, clientProjectId} = this.props;
        const date = moment(this.props.dateSampled);
        const displayStatus = dropdownConfig.statusList[statusId];
        const backgroundColor = editable ? variables.white : variables.mediumGray;
        const height = collaborators.length > 1 ? moderateScale(150) : moderateScale(100);
        return <ListItem style={[Styles.listItem, { height, backgroundColor }]} button onPress={() => {this.goToOverview()}}>
            {
                timeline && <JobStatus {...{ timeline, statusId, height }} />
            }
            <View style={style.time}>
                <Text style={[style.gray, style.monthPrefix]}>{_.toUpper(date.format("MMM"))}</Text>
                <H3 style={style.days}>{date.format("DD")}</H3>
            </View>
            <View style={style.title}>
                <H3 style={style.facilityName}>{facilityName}</H3>
                <Text style={[style.gray, style.status]}>
                  {displayStatus}
                  {etcUser() && ", " + String(clientProjectId)}
                </Text>
                <View style={style.row}>
                {
                    collaborators.map((id, key) => <Avatar {...{ id, key }} style={style.avatar} />)
                }
                </View>
            </View>
            {
                !timeline && <JobStatus {...{ statusId, height }} />
            }
      </ListItem>
    }
}

type JobStatusProps = {
    timeline?: boolean,
    statusId: number,
    height: number
};

class JobStatus extends React.Component<JobStatusProps> {

    determineColor() {
      if (this.props.statusId === 2)
        return variables.jobSubmitted;
      else if (this.props.statusId === 3)
        return variables.jobReceived;
      else if (this.props.statusId === 4) {
        return variables.jobCompleted;
      }
    }

    render(): React.Node {
        const {timeline, height} = this.props;
        return <View style={[style.doublePadding, Styles.center]}>
            {
                timeline && <View style={[{ height }, style.verticalLine]}></View>
            }
            {
              this.statusId !== 1 && <Circle size={moderateScale(10)} color={ this.determineColor() }/>
            }
        </View>;
    }
}

const style = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center"
    },
    doublePadding: {
        padding: variables.contentPadding * 2
    },
    gray: {
        color: variables.gray
    },
    avatar: {
        marginTop: variables.contentPadding,
        marginRight: variables.contentPadding
    },
    verticalLine: {
        borderLeftWidth: variables.borderWidth,
        borderColor: variables.listBorderColor,
        position: "absolute"
    },
    time: {
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        padding: moderateScale(variables.contentPadding)
    },
    title: {
        justifyContent: "center",
        flex: 1,
        padding: moderateScale(variables.contentPadding)
    },
    monthPrefix: {
        fontSize: moderateScale(14),
        lineHeight: moderateScale(18, 0.4)
    },
    days: {
        fontSize: moderateScale(21),
        lineHeight: moderateScale(33)
    },
    facilityName: {
        fontSize: moderateScale(21),
        lineHeight: moderateScale(33)
    },
    status: {
        fontSize: moderateScale(14),
        lineHeight: moderateScale(18)
    }
});
