import React from 'react';
import { Avatar, Button, ButtonGroup, Icon, Layout, ListItem, MenuItem, OverflowMenu } from '@ui-kitten/components';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Reactotron from 'reactotron-react-native'

const ArrowIcon = (props) => (
    <Icon {...props} name='arrow-ios-forward' />
)

const LogOutIcon = (props) => (
    <Icon {...props} name='log-out' />
)

export const ManagerSettingsScreen = ({ navigation }) => {
    const [manager, setManager] = React.useState({});

    const logout = async () => {
        await AsyncStorage.removeItem("@session");

        navigation.navigate('Auth', {
            screen: 'Login'
        });
    }

    const updateProfile = async () => {
        try {
            // Get manager id from AsyncStorage
            let session = await AsyncStorage.getItem('@session');
            session = JSON.parse(session);
            const managerId = session.id;
            const manager = session.data;

            setManager(manager);

            Reactotron.log({ session, managerId, manager });

            navigation && navigation.navigate('CreateManager', {
                context: 'edit',
                manager: manager
            })
        } catch (error) {
            Reactotron.log({ error });
            console.error(error);
        }
    }

    return (
        <>
            {/* <ListItem
                title={`Update Profile`}
                accessoryRight={ArrowIcon}
                onPress={updateProfile}
            /> */}
            <ListItem
                title={`Logout`}
                accessoryRight={LogOutIcon}
                onPress={logout}
            />
        </>
    );
}

const styles = StyleSheet.create({
    icon: {
        width: 32,
        height: 32,
    },
});