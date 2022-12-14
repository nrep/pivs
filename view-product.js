import React from 'react';
import { ImageBackground, Platform, TouchableOpacity, View } from 'react-native';
import {
    Button,
    Input,
    Layout,
    Radio,
    RadioGroup,
    StyleService,
    Text,
    useStyleSheet,
} from '@ui-kitten/components';
import { KeyboardAvoidingView } from './extra/keyboard-avoiding-view.component';
import { CommentList } from './extra/comment-list.component';
import { Product, ProductColor } from './extra/data-1';
import QRCode from 'react-native-qrcode-svg';
import axios from 'axios';
import { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';

var baseUrl = "https://standtogetherforchange.org";

const product = Product.pinkChair();

const keyboardOffset = (height) => Platform.select({
    android: 0,
    ios: height,
});

export const ViewProductScreen = ({ navigation, route }) => {
    const [quantity, setQuantity] = React.useState(1);

    const ref = React.useRef();

    const styles = useStyleSheet(themedStyles);

    let svg;

    const { item, userCategory } = route.params;

    const onBuyButtonPress = () => {
        navigation && navigation.navigate('CreateOrder', {
            product: {
                id: item.ProductId,
                name: item.ProductName,
                price: item.Price,
                quantity: item.Quantity
            },
            quantity
        });
    };

    const onEditButtonPress = () => {
        navigation && navigation.navigate('CreateProduct', {
            context: 'edit',
            product: item
        });
    }

    const onDeleteButtonPress = () => {
        axios.get(baseUrl + '/api.php?target=delete-product&id=' + product.ProductId)
            .then(function (response) {
                navigation && navigation.navigate('ViewProducts');
                ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
            })
            .catch(function (error) {
                ToastAndroid.show('Error deleting product', ToastAndroid.SHORT);
            });
    }

    const shareQR = () =>  {
        svg.toDataURL((data) => {
            const shareImageBase64 = {
                title: "QR",
                message: "Ehi, this is my QR code",
                url: `data:image/png;base64,${data}`
            };
            Share.open(shareImageBase64);
        });
    }

    const renderHeader = () => (
        <Layout style={styles.header}>
            <ImageBackground
                style={styles.image}
                source={item.ImagePath ? { uri: baseUrl + '/' + item.ImagePath } : require('./assets/image-product-3.jpg')}
            />
            <Layout
                style={styles.detailsContainer}
                level='1'>
                <TouchableOpacity onPress={shareQR}>
                    <QRCode
                        value={JSON.stringify({
                            id: item.ProductId,
                            name: item.ProductName,
                            price: item.Price,
                            quantity: item.Quantity
                        })}
                        getRef={(ref) => (svg = ref)}
                    />
                </TouchableOpacity>
                <Text
                    category='h6'>
                    {item.ProductName}
                </Text>
                <Text
                    style={styles.price}
                    category='h4'>
                    {item.Price}
                </Text>
                {/*
                <Text
                    style={styles.subtitle}
                    appearance='hint'
                    category='p2'>
                    {product.subtitle}
                </Text>
                */}
                <Text
                    style={styles.description}
                    appearance='hint'>
                    {item.Description}
                </Text>
                {/* <Text
                    style={styles.sectionLabel}
                    category='h6'>
                    Size:
                </Text>
                <Text
                    style={styles.size}
                    appearance='hint'>
                    {product.size}
                </Text>
                <Text
                    style={styles.sectionLabel}
                    category='h6'>
                    Color:
                </Text>
                <RadioGroup
                    style={styles.colorGroup}
                    selectedIndex={selectedColorIndex}
                    onChange={setSelectedColorIndex}>
                    {product.colors.map(renderColorItem)}
                </RadioGroup> */}
                {userCategory === 'customer' ? (
                    <>
                        <Input
                            placeholder='Enter Quantity'
                            value={quantity}
                            onChangeText={setQuantity}
                        />
                        <View style={styles.actionContainer}>
                            <Button
                                style={styles.actionButton}
                                size='giant'
                                onPress={onBuyButtonPress}>
                                PLACE ORDER
                            </Button>
                        </View>
                    </>
                ) : (
                    <View style={styles.actionContainer}>
                        <Button
                            style={styles.actionButton}
                            size='giant'
                            onPress={shareQR}>
                            Save QR
                        </Button>
                        <Button
                            style={styles.actionButton}
                            size='giant'
                            onPress={onEditButtonPress}>
                            Edit
                        </Button>
                        <Button
                            style={styles.actionButton}
                            size='giant'
                            status='danger'
                            onPress={onDeleteButtonPress}>
                            Delete
                        </Button>
                    </View>
                )}
            </Layout>
            {/* <Input
                style={styles.commentInput}
                label={evaProps => <Text {...evaProps} style={styles.commentInputLabel}>Comments</Text>}
                placeholder='Write your comment'
                value={comment}
                onChangeText={setComment}
            /> */}
        </Layout>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            offset={keyboardOffset}>
            <CommentList
                style={styles.commentList}
                data={[]}
                ListHeaderComponent={renderHeader()}
            />
        </KeyboardAvoidingView>
    );
};

const themedStyles = StyleService.create({
    container: {
        flex: 1,
        backgroundColor: 'background-basic-color-2',
    },
    commentList: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    header: {
        marginBottom: 8,
    },
    image: {
        height: 340,
        width: '100%',
    },
    detailsContainer: {
        paddingVertical: 24,
        paddingHorizontal: 16,
    },
    subtitle: {
        marginTop: 4,
    },
    price: {
        position: 'absolute',
        top: 24,
        right: 16,
    },
    description: {
        marginVertical: 16,
    },
    size: {
        marginBottom: 16,
    },
    colorGroup: {
        flexDirection: 'row',
        marginHorizontal: -8,
    },
    colorRadio: {
        marginHorizontal: 8,
    },
    actionContainer: {
        flexDirection: 'row',
        marginHorizontal: -8,
        marginTop: 24,
    },
    actionButton: {
        flex: 1,
        marginHorizontal: 8,
    },
    sectionLabel: {
        marginVertical: 8,
    },
    commentInputLabel: {
        fontSize: 16,
        marginBottom: 8,
        color: 'text-basic-color',
    },
    commentInput: {
        marginHorizontal: 16,
        marginVertical: 24,
    },
});