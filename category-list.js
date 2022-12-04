import React from 'react';
import { Avatar, Button, Icon, Layout, ListItem, MenuItem, OverflowMenu } from '@ui-kitten/components';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native'
import axios from 'axios';

var baseUrl = "https://standtogetherforchange.org";

export const OverflowMenuSimpleUsageShowcase = () => {

    const [selectedIndex, setSelectedIndex] = React.useState(null);
    const [visible, setVisible] = React.useState(false);

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
    );
};

const PlusIcon = (props) => (
    <Icon {...props} name='plus' />
)

export const ViewCategoriesScreen = ({ navigation }) => {
    const [categories, setCategories] = React.useState([]);

    React.useEffect(() => {
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

        // call the function
        fetchData();
    }, []);

    const onNewButton = () => {
        navigation && navigation.navigate('CreateCategory');
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
                    accessoryRight={OverflowMenuSimpleUsageShowcase}
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