import React from 'react';
import { Dimensions, ImageBackground, ListRenderItemInfo, View } from 'react-native';
import { Button, Card, Icon, List, StyleService, Text, useStyleSheet } from '@ui-kitten/components';
import { CartIcon } from './extra/icons';
import { Product } from './extra/data';
import axios from 'axios';
import Reactotron from 'reactotron-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const products = [
    Product.pinkChair(),
    Product.blackLamp(),
    Product.whiteChair(),
    Product.woodChair(),
    Product.pinkChair(),
    Product.blackLamp(),
    Product.whiteChair(),
    Product.woodChair(),
];

var baseUrl = "https://standtogetherforchange.org";

export const ProductListScreen = ({ navigation, route }) => {
    let [products, setProducts] = React.useState([]);
    const [userCategory, setUserCategory] = React.useState("customer");
    const styles = useStyleSheet(themedStyles);

    React.useEffect(() => {
        const fetchData = async () => {
            let session = await AsyncStorage.getItem('@session');
            session = JSON.parse(session);
            const userCategory = session.userCategory;

            setUserCategory(userCategory);

            const params = {
                target: 'products',
            };
            try {
                // get the data from the api
                const response = await axios({
                    method: 'get',
                    url: `${baseUrl}/api.php`,
                    params: params,
                });
                // set the data to the products state
                setProducts(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const displayProducts = products.filter(product => product.category === route.name);

    const onItemPress = (item) => {
        navigation && navigation.navigate('ViewProduct', { item, userCategory });
    };

    const onItemCartPress = (index) => {
        navigation && navigation.navigate('ShoppingCart');
    };

    const renderItemFooter = (info) => {
        Reactotron.log({ info });
        return (
            <View style={styles.itemFooter}>
                <Text category='s1'>
                    {info.item.Price} RWF
                </Text>
                {/* <Button
                style={styles.iconButton}
                size='small'
                accessoryLeft={CartIcon}
                onPress={() => onItemCartPress(info.index)}
            /> */}
            </View>
        );
    }

    const renderItemHeader = (info) => (
        <ImageBackground
            style={styles.itemHeader}
            source={info.item.ImagePath ? { uri: baseUrl + '/' + info.item.ImagePath } : require('./assets/image-product-3.jpg')}
        />
    );

    const renderProductItem = (info) => (
        <Card
            style={styles.productItem}
            header={() => renderItemHeader(info)}
            footer={() => renderItemFooter(info)}
            onPress={() => onItemPress(info.item)}>
            <Text category='s1'>
                {info.item.ProductName}
            </Text>
            <Text
                appearance='hint'
                category='c1'>
                {info.item.Description}
            </Text>
        </Card>
    );

    const PlusIcon = (props) => (
        <Icon {...props} name='plus' />
    )

    const onNewButton = () => {
        navigation && navigation.navigate('CreateProduct');
    };

    return (
        <>
            {userCategory === "supplier" && <View>
                <Button style={styles.button} status='primary' accessoryLeft={PlusIcon} onPress={onNewButton}>
                    NEW
                </Button>
            </View>
            }
            <List
                contentContainerStyle={styles.productList}
                data={products}
                numColumns={2}
                renderItem={renderProductItem}
            />
        </>
    );
};

const themedStyles = StyleService.create({
    container: {
        flex: 1,
        backgroundColor: 'background-basic-color-2',
    },
    productList: {
        paddingHorizontal: 8,
        paddingVertical: 16,
    },
    productItem: {
        flex: 1,
        margin: 8,
        maxWidth: Dimensions.get('window').width / 2 - 24,
        backgroundColor: 'background-basic-color-1',
    },
    itemHeader: {
        height: 140,
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    iconButton: {
        paddingHorizontal: 0,
    },
});