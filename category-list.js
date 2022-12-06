import React from 'react';
import { Avatar, Button, ButtonGroup, Icon, Layout, ListItem, MenuItem, OverflowMenu } from '@ui-kitten/components';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native'
import axios from 'axios';

var baseUrl = "https://standtogetherforchange.org";

const PlusIcon = (props) => (
    <Icon {...props} name='plus' />
)

const EditIcon = (props) => (
    <Icon {...props} name='edit' />
);

const TrashIcon = (props) => (
    <Icon {...props} name='trash' />
);

export const ViewCategoriesScreen = ({ navigation }) => {
    const [categories, setCategories] = React.useState([]);

    const fetchData = async () => {
        const params = {
            target: 'categories',
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
                setCategories(response.data);
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
        navigation && navigation.navigate('CreateCategory', {
            context: 'create'
        });
    };

    const Buttons = ({ category }) => {

        const onEditButtonPress = () => {
            navigation && navigation.navigate('CreateCategory', {
                context: 'edit',
                category: category
            });
        }

        const onDeleteButtonPress = () => {
            Reactotron.log(baseUrl + '/api.php?target=delete-category&id=' + category.CategoryId);
            axios.get(baseUrl + '/api.php?target=delete-category&id=' + category.CategoryId)
                .then(function (response) {
                    fetchData();
                    ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
                })
                .catch(function (error) {
                    ToastAndroid.show('Error deleting category', ToastAndroid.SHORT);
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
                <Button status='primary' accessoryLeft={PlusIcon} onPress={onNewButton}>
                    NEW
                </Button>
            </View>
            {Array.isArray(categories) && categories.map((category, index) => (
                <ListItem
                    key={index}
                    title={`${category.CategoryName}`}
                    accessoryRight={() => <Buttons category={category} />}
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
});