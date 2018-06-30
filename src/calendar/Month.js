// @flow
import moment, {Moment} from "moment";
import _ from "lodash";
import * as React from "react";
import {View, StyleSheet, Text} from "react-native";
import {Button} from "native-base";

import {Styles} from "../components";

import type {BaseProps, ChildrenProps} from "../components/Types";

import variables from "../../native-base-theme/variables/commonColor";

export interface Date {
    month: number,
    day: number
}

interface CalendarEntry extends Date {
    outside: boolean
}

type Calendar = CalendarEntry[][];

interface MonthProps {
    month: number,
    date: Date,
    onPress?: (Date) => void
}

export default class Month extends React.Component<MonthProps> {
    render(): React.Node {
        const {month, date, onPress} = this.props;
        return <View style={style.bg}>
            <Header />
            {
                _.chunk(calendar[month], 7).map((entries, index) =>
                    <Week style={style.border} key={index} {...{entries, month, date, onPress}} />
                )
            }
        </View>;
    }
}

type WeekProps = {
    entries: CalendarEntry[],
    month: number,
    date: Date,
    onPress?: (Date) => void
};

class Week extends React.Component<WeekProps> {
    render(): React.Node {
        const {entries, date, onPress} = this.props;
        return <Row>
        {
            entries.map((entry, key) =>
                <Cell
                    key={key}
                    date={{ month: entry.month, day: entry.day }}
                    active={!entry.outside}
                    selected={entry.day === date.day && entry.month === date.month}
                    onPress={onPress}
                />
            )
        }
        </Row>;
    }
}

class Header extends React.Component<{}> {
    render(): React.Node {
        return <Row>
        {
            ["M", "T", "W", "T", "F", "S", "S"]
                .map((day, key) => <View key={key} style={[Styles.flexGrow, Styles.center]}>
                    <Text style={{ color: "white" }}>{day}</Text>
                </View>)
        }
        </Row>;
    }
}

type RowProps = BaseProps & ChildrenProps;

class Row extends React.Component<RowProps> {

    render(): React.Node {
        return <View style={[{ flexDirection: "row" }, this.props.style]}>{this.props.children}</View>
    }
}

type CellProps = {
    date: Date,
    active?: boolean,
    selected?: boolean,
    onPress?: (Date) => void
};

class Cell extends React.Component<CellProps> {
    render(): React.Node {
        const {date, active, selected, onPress} = this.props;
        const cellStyle = [
            Styles.flexGrow,
            Styles.center,
            {
                backgroundColor: selected ? variables.brandInfo : undefined,
                borderRadius: 0
            }
        ];
        return <Button
            style={cellStyle}
            onPress={() => onPress ? onPress(date) : undefined}
            transparent>
            <Text style={active ? style.activeText : style.inactiveText}>{`${date.day}`}</Text>
        </Button>;
    }
}

const style = StyleSheet.create({
    bg: {
        backgroundColor: variables.brandPrimary,
        paddingTop: variables.contentPadding
    },
    activeText: {
        color: "white",
        fontSize: 10
    },
    inactiveText: {
        color: "rgba(255, 255, 255, .3)",
        fontSize: 10
    },
    bordered: {
        borderTopWidth: 1,
        borderColor: "rgba(255, 255, 255, .3)"
    },
    border: {
        borderTopWidth: 1,
        borderColor: "rgba(255, 255, 255, .3)"
    }
});

const calendar: Calendar = [[], [], [], [], [], [], [], [], [], [], [], []];
const addCalendarEntry = (month: number, outside: boolean, date: Moment) => {
    calendar[month].push({
        outside,
        day: date.date(),
        month: date.month()
    });
};

calendar.forEach((entries, month) => {
    const firstOf = () => moment({ year: 2017, month: month });
    const daysInMonth = firstOf().daysInMonth();
    const dayOnFirst = firstOf().isoWeekday();
    const dayOnLast = firstOf().date(daysInMonth).isoWeekday();
    // Start
    for(let i = 1; i < dayOnFirst; i++) {
        const date = firstOf().date(i - dayOnFirst + 1);
        addCalendarEntry(month, true, date);
    }
    // Middle
    for(let i = 1; i <= daysInMonth; i++) {
        const date  = firstOf().date(i);
        addCalendarEntry(month, false, date);
    }
    // End
    for(let i = 1; i <= 7 - dayOnLast; i++) {
        const date = firstOf().date(daysInMonth + i);
        addCalendarEntry(month, true, date);
    }
});
