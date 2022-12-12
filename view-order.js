import React from 'react';
import { Avatar, Button, Icon, Input, Layout, ListItem, MenuItem, OverflowMenu, Text } from '@ui-kitten/components';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native'
import axios from 'axios';
import { Card } from 'react-native-paper';
import { sendEmail } from './send-email';

var baseUrl = "https://standtogetherforchange.org";

export const OrderDetailsScreen = ({ navigation, route }) => {
    const [to, setTo] = React.useState(null);
    const [cc, setCc] = React.useState(null);
    const [body, setBody] = React.useState(null);
    const [subject, setSubject] = React.useState(null);
    const [bcc, setBcc] = React.useState(null);
    const [customer, setCustomer] = React.useState({});

    const { order, userCategory } = route.params;

    const fetcCustomerData = async () => {
        const params = {
            target: 'customer',
            id: order.CustomerId
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
                setCustomer(response.data[0]);
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
        fetcCustomerData();
    }, [route.params?.order])

    React.useEffect(() => {
        setTo(customer.Email);
    }, [customer])

    const onSendEmailButtonPress = () => {
        sendEmail(
            to,
            subject,
            body,
        ).then(() => {
            console.log('Your message was successfully sent!');
        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Layout style={styles.layoutContainer}>
                    <Layout style={styles.layout} level='4'>
                        <Text category='s1'>Product Name:</Text>
                    </Layout>
                    <Layout style={styles.layout} level='3'>
                        <Text>{order.ProductName}</Text>
                    </Layout>
                </Layout>
                <Layout style={styles.layoutContainer}>
                    <Layout style={styles.layout} level='4'>
                        <Text category='s1'>Unit Price:</Text>
                    </Layout>
                    <Layout style={styles.layout} level='3'>
                        <Text>{order.Price}</Text>
                    </Layout>
                </Layout>
                <Layout style={styles.layoutContainer}>
                    <Layout style={styles.layout} level='4'>
                        <Text category='s1'>Quantity:</Text>
                    </Layout>
                    <Layout style={styles.layout} level='3'>
                        <Text>{order.Quantity}</Text>
                    </Layout>
                </Layout>
                <Layout style={styles.layoutContainer}>
                    <Layout style={styles.layout} level='4'>
                        <Text category='s1'>Total Price:</Text>
                    </Layout>
                    <Layout style={styles.layout} level='3'>
                        <Text category='s1'>{order.Price * order.Quantity}</Text>
                    </Layout>
                </Layout>
                <Layout style={styles.layoutContainer}>
                    <Layout style={styles.layout} level='4'>
                        <Text category='s1'>Payment Status:</Text>
                    </Layout>
                    <Layout style={styles.layout} level='3'>
                        <Text category='s1'>{order?.payment?.apiResult.status}</Text>
                    </Layout>
                </Layout>
                {userCategory == "supplier" && (
                    <Card style={styles.card}>
                        <Input
                            label={"Email"}
                            placeholder='Email'
                            value={to}
                            onChangeText={setTo}
                            style={styles.passwordInput}
                        />
                        <Input
                            label={"Subject"}
                            placeholder='Subject'
                            value={subject}
                            onChangeText={setSubject}
                            style={styles.passwordInput}
                        />
                        <Input
                            label={"Body"}
                            placeholder='Body'
                            value={body}
                            onChangeText={setBody}
                            style={styles.passwordInput}
                            multiline={true}
                            numberOfLines={3}
                        />
                        <Button
                            style={styles.passwordInput}
                            size='giant'
                            onPress={onSendEmailButtonPress}>
                            SEND EMAIL
                        </Button>
                    </Card>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 24,
        paddingHorizontal: 16,
    },
    icon: {
        width: 32,
        height: 32,
    },
    layoutContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    layout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        flex: 1,
        marginTop: 8,
    },
    passwordInput: {
        marginTop: 16,
    },
    signInLabel: {
        flex: 1,
    },
    signUpButton: {
        flexDirection: 'row-reverse',
        paddingHorizontal: 0,
    },
    socialAuthButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    socialAuthHintText: {
        alignSelf: 'center',
        marginBottom: 16,
    },
    buttonStyle: {
        backgroundColor: '#307ecc',
        borderWidth: 1,
        color: '#FFFFFF',
        borderColor: '#307ecc',
        height: 40,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 15,
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
    },
    textStyle: {
        backgroundColor: '#fff',
        fontSize: 15,
        marginTop: 16,
        marginLeft: 35,
        marginRight: 35,
        textAlign: 'center',
    },
    passwordInput: {
        marginTop: 8,
    },
    card: {
        marginTop: 8,
        padding: 16,
    }
});