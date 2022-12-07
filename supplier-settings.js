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

export const SupplierSettingsScreen = ({ navigation }) => {
    const [supplier, setSupplier] = React.useState({});

    const logout = async () => {
        await AsyncStorage.removeItem("@session");

        navigation.navigate('Auth', {
            screen: 'Login'
        });
    }

    const updateProfile = async () => {
        try {
            // Get supplier id from AsyncStorage
            let session = await AsyncStorage.getItem('@session');
            session = JSON.parse(session);
            const supplierId = session.id;
            const supplier = session.data;

            setSupplier(supplier);

            Reactotron.log({ session, supplierId, supplier });

            navigation && navigation.navigate('CreateSupplier', {
                context: 'edit',
                supplier: supplier
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