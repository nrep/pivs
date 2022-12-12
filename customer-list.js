import React from 'react';
import { Avatar, Button, ButtonGroup, Icon, Layout, ListItem, MenuItem, OverflowMenu } from '@ui-kitten/components';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native'
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';

var baseUrl = "https://standtogetherforchange.org";

const EditIcon = (props) => (
    <Icon {...props} name='edit' />
);

const TrashIcon = (props) => (
    <Icon {...props} name='trash' />
);

const ItemImage = (props) => (
    <Avatar
        {...props}
        style={[props.style, { tintColor: null }]}
        source={require('./assets/image-background.jpg')}
    />
);

const PlusIcon = (props) => (
    <Icon {...props} name='plus' />
)

export const ViewCustomersScreen = ({ navigation }) => {
    const [customers, setCustomers] = React.useState([]);

    const fetchData = async () => {
        let session = await AsyncStorage.getItem('@session');
        session = JSON.parse(session);
        const managerId = session.id;
        const params = {
            target: 'customers',
            managerId: managerId
        };
        try {
            // get the data from the api
            const response = await axios({
                method: 'get',
                url: `${baseUrl}/api.php`,
                params: params,
            });

            Reactotron.log({
                response, params
            });
            // convert the data to json
            if (response.status === 200) {
                // set state with the result
                setCustomers(response.data);
            } else {
                // Reactotron.log(response);
                throw new Error("An error has occurred");
            }
        } catch (error) {
            Reactotron.log({ error });
            console.error(error);
        }
    }

    React.useEffect(() => {
        fetchData();
    }, []);

    return (
        <ScrollView>
            {Array.isArray(customers) && customers.map((customer, index) => (
                <ListItem
                    key={index}
                    title={`${customer.FullName}`}
                    description={`Email: ${customer.Email} Phone: ${customer.PhoneNumber}`}
                    accessoryLeft={ItemImage}
                />
            ))}
        </ScrollView>
    );
}