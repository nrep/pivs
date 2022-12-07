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

export const CustomerSettingsScreen = ({ navigation }) => {
    const [customer, setCustomer] = React.useState({});

    const logout = async () => {
        await AsyncStorage.removeItem("@session");

        navigation.navigate('Auth', {
            screen: 'Login'
        });
    }

    const updateProfile = async () => {
        try {
            // Get customer id from AsyncStorage
            let session = await AsyncStorage.getItem('@session');
            session = JSON.parse(session);
            const customerId = session.id;
            const customer = session.data;

            setCustomer(customer);

            Reactotron.log({ session, customerId, customer });

            navigation && navigation.navigate('Auth', {
                screen: 'SignUp',
                params: {
                    context: 'edit',
                    customer: customer
                }
            })
        } catch (error) {
            Reactotron.log({ error });
            console.error(error);
        }
    }

    return (
        <>
            <ListItem
                title={`Update Profile`}
                accessoryRight={ArrowIcon}
                onPress={updateProfile}
            />
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