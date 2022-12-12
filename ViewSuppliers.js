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

export const ViewSuppliersScreen = ({ navigation }) => {
    const [suppliers, setSuppliers] = React.useState([]);

    const fetchData = async () => {
        let session = await AsyncStorage.getItem('@session');
        session = JSON.parse(session);
        const managerId = session.id;
        const params = {
            target: 'suppliers',
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
                setSuppliers(response.data);
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

    const onNewButton = () => {
        navigation && navigation.navigate('CreateSupplier', {
            context: 'create'
        });
    };

    const Buttons = ({ supplier }) => {

        const onEditButtonPress = () => {
            navigation && navigation.navigate('CreateSupplier', {
                context: 'edit',
                supplier: supplier
            });
        }

        const onDeleteButtonPress = () => {
            axios.get(baseUrl + '/api.php?target=delete-supplier&id=' + supplier.SupplierId)
                .then(function (response) {
                    fetchData();
                    ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
                })
                .catch(function (error) {
                    ToastAndroid.show('Error deleting supplier', ToastAndroid.SHORT);
                });
        }

        return (
            <ButtonGroup style={styles.buttonGroup} size="small">
                <Button accessoryLeft={EditIcon} onPress={onEditButtonPress} />
                <Button accessoryLeft={TrashIcon} status="danger" onPress={onDeleteButtonPress} />
            </ButtonGroup>
        )
    };

    return (
        <>
            <View>
                <Button style={styles.button} status='primary' accessoryLeft={PlusIcon} onPress={onNewButton}>
                    NEW
                </Button>
            </View>
            <ScrollView>
                {Array.isArray(suppliers) && suppliers.map((supplier, index) => (
                    <ListItem
                        key={index}
                        title={`${supplier.FullName}`}
                        description={`Email: ${supplier.Email} Phone: ${supplier.PhoneNumber}`}
                        accessoryLeft={ItemImage}
                        accessoryRight={() => Buttons({ supplier })}
                    />
                ))}
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    icon: {
        width: 32,
        height: 32,
    },
});