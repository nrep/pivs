import React from 'react';
import { Avatar, Button, Icon, Layout, ListItem, MenuItem, OverflowMenu, Text } from '@ui-kitten/components';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native'
import axios from 'axios';

var baseUrl = "https://standtogetherforchange.org";

const InstallButton = (props) => (
    <Icon
        style={styles.icon}
        fill='#8F9BB3'
        name='arrow-down-outline'
    />
);

export const OverflowMenuSimpleUsageShowcase = (order) => {
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    const [visible, setVisible] = React.useState(false);

    Reactotron.log({ order });

    const onItemSelect = (index) => {
        setSelectedIndex(index);
        setVisible(false);
    };

    const renderToggleButton = () => (
        <Icon
            style={styles.icon}
            fill='#8F9BB3'
            name='arrow-down-outline'
        />
    );

    return (
        <View>
            <Layout style={styles.container}>
                <Layout style={styles.layout} level='4'>
                    <Text category='s1'>{order.Quantity * order.Price}</Text>
                </Layout>
                <Layout style={styles.layout} level='3'>
                    <OverflowMenu
                        anchor={renderToggleButton}
                        visible={visible}
                        selectedIndex={selectedIndex}
                        onSelect={onItemSelect}
                        onBackdropPress={() => setVisible(false)}>
                        <MenuItem title='Users' />
                        <MenuItem title='Orders' />
                        <MenuItem title='Transactions' />
                    </OverflowMenu>
                </Layout>
            </Layout>
        </View>
    );
};

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

export const ViewOrdersScreen = ({ navigation, route }) => {
    const [orders, setOrders] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            let session = await AsyncStorage.getItem('@session');
            session = JSON.parse(session);
            const id = session.id;
            const userCategory = session.userCategory;

            const params = {
                target: 'orders',
                userCategory,
                id
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

        // call the function
        fetchData();
    }, []);

    const onNewButton = () => {
        navigation && navigation.navigate('CreateOrder');
    };

    return (
        <>
            <View>
                <Button style={styles.button} status='primary' accessoryLeft={PlusIcon} onPress={onNewButton}>
                    NEW
                </Button>
            </View>
            {Array.isArray(orders) && orders.map((order, index) => (
                <ListItem
                    key={index}
                    title={`${order.ProductName}`}
                    description={order.Quantity}
                    accessoryLeft={ItemImage}
                    accessoryRight={OverflowMenuSimpleUsageShowcase(order)}
                />
            ))}
        </>
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