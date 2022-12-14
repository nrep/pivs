import React from 'react';
import { Avatar, Button, Icon, Layout, ListItem, MenuItem, OverflowMenu, Text } from '@ui-kitten/components';
import { RefreshControl, StyleSheet, ToastAndroid, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native'
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';

var baseUrl = "https://standtogetherforchange.org";

const InstallButton = (props) => (
    <Icon
        style={styles.icon}
        fill='#8F9BB3'
        name='arrow-down-outline'
    />
);

const ItemImage = (props, order) => (
    <Avatar
        {...props}
        style={[props.style, { tintColor: null }]}
        source={order.ImagePath ? { uri: baseUrl + '/' + order.ImagePath } : require('./assets/image-background.jpg')}
    />
);

export const ViewOrdersScreen = ({ navigation, route }) => {
    const [orders, setOrders] = React.useState([]);
    const [userCategory, setUserCategory] = React.useState("");
    const [refreshing, setRefreshing] = React.useState(false);

    const fetchData = async () => {
        let session = await AsyncStorage.getItem('@session');
        session = JSON.parse(session);
        const id = session.id;
        setUserCategory(session.userCategory);

        const params = {
            target: 'orders',
            userCategory: session.userCategory,
            id
        };

        Reactotron.log({ params });

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
                setOrders(response.data);
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
        // call the function
        fetchData();
    }, []);

    const _onRefresh = () => {
        setRefreshing(true);
        fetchData().then(() => {
            setRefreshing(false);
        });
    }

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={_onRefresh}
                />
            }
        >
            {Array.isArray(orders) && orders.map((order, index) => (
                <ListItem
                    key={index}
                    title={`${order.ProductName}`}
                    description={order.Quantity}
                    accessoryLeft={(props) => ItemImage(props, order)}
                    accessoryRight={() => (
                        <>
                            <Text category='s1'>RWF {order.Quantity * order.Price}</Text>
                            <Text category='s1'>{order?.payment?.apiResult?.status}</Text>
                        </>
                    )}
                    onPress={() => navigation.navigate('OrderDetails', { order, userCategory })}
                />
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    icon: {
        width: 32,
        height: 32,
    },
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    layout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});