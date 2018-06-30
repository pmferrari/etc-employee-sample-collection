// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, Image, View, Text} from "react-native";
import {H1, Button, Icon} from "native-base";
import {observable, action} from "mobx";
import { observer } from "mobx-react/native";

import {BaseContainer, Styles, Images, Small} from "../components";

import variables from "../../native-base-theme/variables/commonColor";

import type {ScreenProps} from "../components/Types";

export default class Lists extends React.Component<ScreenProps<>> {
    render(): React.Node {
        return <BaseContainer title="Lists" navigation={this.props.navigation} scrollable>
            <View style={[Styles.center, Styles.header]}>
                <Image source={Images.lists} style={[StyleSheet.absoluteFill, Styles.header]} />
                <View style={[StyleSheet.absoluteFill, style.mask]} />
                <H1 style={{ color: "white" }}>Work</H1>
                <Small>FREELANCE PROJECTS</Small>
            </View>
            <Item title="Design new icon" done />
            <Item title="Work on UI Kit" />
            <Item title='React article: "Designing for Mobile"' />
            <Item title="Revise wireframes" done />
            <Item title="Catch up with Mary" />
            <Item title="Design explorations for new project" />
        </BaseContainer>;
    }
}

type ItemProps = {
    title: string,
    done?: boolean
};

@observer
class Item extends React.Component<ItemProps> {
    @observable done: boolean;

    componentWillMount() {
        const {done} = this.props;
        this.done = !!done;
    }

    @autobind @action
    toggle() {
        this.done = !this.done;
    }

    render(): React.Node  {
        const {title} = this.props;
        const btnStyle ={ backgroundColor: this.done ? variables.brandInfo : variables.lightGray };
        return <View style={Styles.listItem}>
            <Button transparent
                    onPress={this.toggle}
                    style={[Styles.center, style.button, btnStyle]}>
                {this.done ? <Icon name="md-checkmark" style={{ color: "white" }} /> : undefined}
            </Button>
            <View style={[Styles.center, style.title]}>
                <Text style={{ color: this.done ? variables.gray : variables.black }}>{title}</Text>
            </View>
        </View>;
    }
}

const style = StyleSheet.create({
    mask: {
        backgroundColor: "rgba(0, 0, 0, .5)"
    },
    button: {
        height: 75, width: 75, borderRadius: 0
    },
    title: {
        paddingLeft: variables.contentPadding
    }
});
