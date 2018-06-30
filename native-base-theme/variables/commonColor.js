// @flow
import color from 'color';

import { Platform, Dimensions, PixelRatio } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const platform = Platform.OS;
const platformStyle = undefined;

const white = "white";
const black = "rgb(29, 29, 38)";
const gray =  "#bbbbbe";
const lightGray = "#f8f8f8";
const mediumGray = "#f2f2f2";
const darkGray = "#848487";
const modalOverlay = "rgba(255, 255, 255, 0.4)";

export default {
  platformStyle,
  platform,
    // AndroidRipple
  androidRipple: true,
  androidRippleColor: 'rgba(256, 256, 256, 0.3)',
  androidRippleColorDark: 'rgba(0, 0, 0, 0.15)',

    // Badge
  badgeBg: '#ED1727',
  badgeColor: '#fff',
    // New Variable
  badgePadding: (platform === 'ios') ? 3 : 0,

    // Button
  btnFontFamily: "Avenir-Book",
  btnDisabledBg: '#b5b5b5',
  btnDisabledClr: '#f1f1f1',

    // CheckBox
  CheckboxRadius: (platform === 'ios') ? 13 : 0,
  CheckboxBorderWidth: (platform === 'ios') ? 1 : 2,
  CheckboxPaddingLeft: (platform === 'ios') ? 4 : 2,
  CheckboxPaddingBottom: (platform === 'ios') ? 0 : 5,
  CheckboxIconSize: (platform === 'ios') ? 21 : 14,
  CheckboxIconMarginTop: (platform === 'ios') ? undefined : 1,
  CheckboxFontSize: (platform === 'ios') ? (23 / 0.9) : 18,
  DefaultFontSize: 17,
  checkboxBgColor: '#039BE5',
  checkboxSize: 20,
  checkboxTickColor: '#fff',

  // Segment
  segmentBackgroundColor: '#3F51B5',
  segmentActiveBackgroundColor: '#fff',
  segmentTextColor: '#fff',
  segmentActiveTextColor: '#3F51B5',
  segmentBorderColor: '#fff',
  segmentBorderColorMain: '#3F51B5',

    // New Variable
  get defaultTextColor() {
    return this.textColor;
  },


  get btnPrimaryBg() {
    return this.brandPrimary;
  },
  get btnPrimaryColor() {
    return this.inverseTextColor;
  },
  get btnInfoBg() {
    return this.brandInfo;
  },
  get btnInfoColor() {
    return this.inverseTextColor;
  },
  get btnSuccessBg() {
    return this.brandSuccess;
  },
  get btnSuccessColor() {
    return this.inverseTextColor;
  },
  get btnDangerBg() {
    return this.brandDanger;
  },
  get btnDangerColor() {
    return this.inverseTextColor;
  },
  get btnWarningBg() {
    return this.brandWarning;
  },
  get btnWarningColor() {
    return this.inverseTextColor;
  },
  get btnTextSize() {
    return (platform === 'ios') ? this.fontSizeBase * 1.1 :
        this.fontSizeBase - 1;
  },
  get btnTextSizeLarge() {
    return this.fontSizeBase * 1.5;
  },
  get btnTextSizeSmall() {
    return this.fontSizeBase * 0.8;
  },
  get borderRadiusLarge() {
    return this.fontSizeBase * 3.8;
  },

  buttonPadding: 6,

  get iconSizeLarge() {
    return this.iconFontSize * 1.5;
  },
  get iconSizeSmall() {
    return this.iconFontSize * 0.6;
  },


    // Card
  cardDefaultBg: '#fff',


    // Color
  brandPrimary: '#95C335',
  brandInfo: '#50D2C2',
  brandSecondary: '#5161A2',
  brandSuccess: '#5cb85c',
  brandDanger: '#d9534f',
  brandWarning: '#f0ad4e',
  brandSidebar: '#252932',
  white,
  black,
  gray,
  lightGray,
  mediumGray,
  darkGray,

    // Job Status Colors
  jobSubmitted: '#f0ad4e',
  jobReceived: '#5161A2',
  jobCompleted: '#5cb85c',


    // Font
  fontFamily: 'Avenir-Book',
  fontSizeBase: 15,

  get fontSizeH1() {
    return this.fontSizeBase * 1.8;
  },
  get fontSizeH2() {
    return this.fontSizeBase * 1.6;
  },
  get fontSizeH3() {
    return this.fontSizeBase * 1.4;
  },


    // Footer
  footerHeight: moderateScale(55),
  get footerDefaultBg() {
      return this.brandInfo;
  },

    // FooterTab
  tabBarTextColor: 'white',
  tabBarTextSize: (platform === 'ios') ? 14 : 11,
  activeTab: (platform === 'ios') ? '#007aff' : '#fff',
  sTabBarActiveTextColor: '#007aff',
  tabBarActiveTextColor: '#fff',
  tabActiveBgColor: (platform === 'ios') ? '#1569f4' : undefined,

    // Tab
  tabDefaultBg: 'white',
  topTabBarTextColor: '#b3c7f9',
  topTabBarActiveTextColor: '#fff',
  topTabActiveBgColor: (platform === 'ios') ? '#1569f4' : undefined,
  topTabBarBorderColor: '#fff',
  get topTabBarActiveBorderColor() { return this.brandInfo; },


    // Header
  toolbarBtnColor: black,
  toolbarDefaultBg: 'white',
  toolbarHeight: (platform === 'ios') ? 64 : 56,
  toolbarIconSize: (platform === 'ios') ? 20 : 22,
  toolbarSearchIconSize: (platform === 'ios') ? 20 : 23,
  toolbarInputColor: (platform === 'ios') ? '#CECDD2' : '#fff',
  searchBarHeight: (platform === 'ios') ? 30 : 40,
  toolbarInverseBg: '#222',
  toolbarTextColor: black,
  iosStatusbar: 'dark-content',
  toolbarDefaultBorder: '#2874F0',
  get statusBarColor() {
    return color(this.toolbarDefaultBg).darken(0.2).hex();
  },


    // Icon
  iconFamily: 'Ionicons',
  iconFontSize: (platform === 'ios') ? 30 : 28,
  iconMargin: 7,
  iconHeaderSize: (platform === 'ios') ? 33 : 24,


    // InputGroup
  inputFontSize: 17,
  inputBorderColor: '#D9D5DC',
  inputSuccessBorderColor: '#2b8339',
  inputErrorBorderColor: '#ed2f2f',

  get inputColor() {
    return this.textColor;
  },
  get inputColorPlaceholder() {
    return gray;
  },

  inputGroupMarginBottom: 10,
  inputHeightBase: 50,
  inputPaddingLeft: 5,

  get inputPaddingLeftIcon() {
    return this.inputPaddingLeft * 8;
  },


    // Line Height
  btnLineHeight: 24,
  lineHeightH1: 37,
  lineHeightH2: 32,
  lineHeightH3: 27,
  iconLineHeight: (platform === 'ios') ? 37 : 30,
  lineHeight: (platform === 'ios') ? 20 : 24,


    // List
  listBorderColor: '#c9c9c9',
  listDividerBg: lightGray,
  listItemHeight: 45,
  listBtnUnderlayColor: '#DDD',

    // Card
  cardBorderColor: '#ccc',

    // Changed Variable
  listItemPadding: (platform === 'ios') ? 10 : 12,

  listNoteColor: '#808080',
  listNoteSize: 13,


    // Progress Bar
  defaultProgressColor: '#E4202D',
  inverseProgressColor: '#1A191B',


    // Radio Button
  radioBtnSize: (platform === 'ios') ? 25 : 23,
  radioSelectedColorAndroid: '#5067FF',

    // New Variable
  radioBtnLineHeight: (platform === 'ios') ? 29 : 24,

  radioColor: '#7e7e7e',

  get radioSelectedColor() {
    return color(this.radioColor).darken(0.2).hex();
  },


    // Spinner
  defaultSpinnerColor: '#45D56E',
  inverseSpinnerColor: '#1A191B',


    // Tabs
  tabBgColor: '#F8F8F8',
  tabFontSize: 15,
  tabTextColor: '#222222',


    // Text
  textColor: black,
  inverseTextColor: '#fff',
  noteFontSize: 14,


    // Title
  titleFontfamily: "Avenir-Light",
  titleFontSize: 17,
  subTitleFontSize: 12,
  subtitleColor: '#FFF',

    // New Variable
  titleFontColor: black,


    // Other
  borderRadiusBase: (platform === 'ios') ? 5 : 2,
  borderWidth: (1/PixelRatio.getPixelSizeForLayoutSize(1)),
  contentPadding: 10,

  get darkenHeader() {
    return color(this.tabBgColor).darken(0.03).hex();
  },

  dropdownBg: '#000',
  dropdownLinkColor: '#414142',
  inputLineHeight: 24,
  jumbotronBg: '#C9C9CE',
  jumbotronPadding: 30,
  deviceWidth,
  deviceHeight,
  modalOverlay,

    // New Variable
  inputGroupRoundedBorderRadius: 30,
};
