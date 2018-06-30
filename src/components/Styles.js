// @flow
import {StyleSheet, Dimensions, Platform, PixelRatio} from "react-native";

import variables from "../../native-base-theme/variables/commonColor";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const Styles = StyleSheet.create({
  // 81, 97, 162,
    imgMask: {
        backgroundColor: "rgba(149, 195, 53, .5)",
    },
    header: {
        width,
        height: width * 440 / 750
    },
    settingsHeader: {
        width,
        marginTop: moderateScale(10),
        // marginBottom: moderateScale(20)
    },
    flexGrow: {
        flex: 1
    },
    center: {
        justifyContent: "center",
        alignItems: "center"
    },
    textCentered: {
        textAlign: "center"
    },
    bg: {
        backgroundColor: "white"
    },
    row: {
        flexDirection: "row"
    },
    whiteBg: {
        backgroundColor: "white"
    },
    whiteText: {
        color: "white"
    },
    grayText: {
        color: variables.gray
    },
    listItem: {
        flexDirection: "row",
        borderBottomWidth: variables.borderWidth,
        borderColor: variables.listBorderColor
    },
    tabUnderline: {
        backgroundColor: variables.brandSecondary
    },
    activeTabTextStyle: {
      fontSize: moderateScale(16),
      lineHeight: moderateScale(20),
      color: variables.brandSecondary
    },
    tabTextStyle: {
      fontSize: moderateScale(16),
      lineHeight: moderateScale(20),
      color: variables.brandSecondary,
      opacity: 0.6
    },
    label: {
        color: variables.brandSecondary
    },
    picker: {
        width:(Platform.OS === 'ios') ? undefined : moderateScale(120),
        // position: 'absolute',
        // right: 0
        alignSelf: 'flex-end',
        height: moderateScale(50)

    },
    pickerLabel: {
        fontSize: moderateScale(16.5),
        lineHeight: moderateScale(24)
    },
    loginInput: {
        fontSize: moderateScale(18),
        height: moderateScale(60),
        lineHeight: moderateScale(30),
        top: moderateScale(10)
    },
    input: {
        fontSize: moderateScale(18),
        height: moderateScale(60),
        lineHeight: moderateScale(30),
        top: scale(5),
        marginLeft: 0
    },
    largeBtn: {
        marginTop: 50,
        height: moderateScale(60),
        backgroundColor: variables.brandSecondary
    },
    modalBtn: {
        marginTop: moderateScale(10),
        height: moderateScale(60),
        width: 0.8 * variables.deviceWidth,
        backgroundColor: variables.brandSecondary
    },
    modalBtnText: {
        fontSize: moderateScale(22),
        lineHeight: moderateScale(32),
        color: variables.white
    },
    largeBtnText: {
        fontSize: moderateScale(22),
        lineHeight: moderateScale(32),
        color: variables.white
    },
    icon: {
        color: variables.gray,
        fontSize: moderateScale(40)
    },
    fabIcon: {
        fontSize: moderateScale(45),
        lineHeight: moderateScale(50),
        paddingTop: Platform.OS === 'ios' ? moderateScale(5) : undefined
    },
    fabWrapper: {
        backgroundColor: variables.brandSecondary,
        height: moderateScale(56),
        width: moderateScale(56),
        elevation: moderateScale(4),
        borderRadius: moderateScale(28),
        shadowRadius: moderateScale(2)
   },
   autocompleteContainer: {
      flex: 1,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
      zIndex: 3
  },
  dividerText: {
      fontSize: moderateScale(16),
      lineHeight: moderateScale(20),
      letterSpacing: moderateScale(1),
      color: variables.darkGray
  },
  modalText: {
      fontSize: moderateScale(22),
      lineHeight: moderateScale(26),
      color: variables.darkGray,
      letterSpacing: moderateScale(2)
  },
  detailsForm: {
      marginLeft: 0,
      borderBottomColor: 'rgba(82, 98, 163, 0.3)'
  },
  ETCPicker: {
    marginLeft: 0,
    marginTop: moderateScale(10),
    marginBottom: moderateScale(10)
  },
  plmInstructions: {
      justifyContent: "flex-start",
      alignItems: "flex-start",
      alignSelf: "stretch",
      paddingBottom: moderateScale(15),
      marginLeft: 0,
      paddingLeft: 0
  }
});

export default Styles;
