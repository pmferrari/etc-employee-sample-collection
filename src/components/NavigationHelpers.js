// @flow
import { NavigationActions } from "react-navigation"
import type {NavigationScreenProp, NavigationState} from "react-navigation/src/TypeDefinition";

export default class NavigationHelpers {
    static reset(navigation: NavigationScreenProp<NavigationState>, routeName: string, key: string | null = null) {
        const action = NavigationActions.reset({
            index: 0,
            key,
            actions: [
                NavigationActions.navigate({ routeName })
            ]
        });
        navigation.dispatch(action);
    }
}
