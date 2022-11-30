import React from 'react';
import { Avatar, Button, Icon, Layout, ListItem, MenuItem, OverflowMenu } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';

const InstallButton = (props) => (
    <Icon
        style={styles.icon}
        fill='#8F9BB3'
        name='arrow-down-outline'
    />
);

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

    React.useEffect(() => {
        fetch('http://standtogetherforchange.org/api.php?target=suppliers')
            .then(response => response.json())
            .then(data => setSuppliers(data));
    }, []);

    const onNewButton = () => {
        navigation && navigation.navigate('CreateSupplier');
    };

    return (
        <>
            <View>
                <Button style={styles.button} status='primary' accessoryLeft={PlusIcon} onPress={onNewButton}>
                    NEW
                </Button>
            </View>
            {Array.isArray(suppliers) && suppliers.map((supplier, index) => (
                <ListItem
                    title={`${supplier.FullName}`}
                    description={`Email: ${supplier.Email} Phone: ${supplier.PhoneNumber}`}
                    accessoryLeft={ItemImage}
                    accessoryRight={OverflowMenuSimpleUsageShowcase}
                />
            ))}
            <ListItem
                title="Elvis Peace"
                description={`Email: elvisrugero@gmail.com Phone: 0788888888`}
                accessoryLeft={ItemImage}
                accessoryRight={OverflowMenuSimpleUsageShowcase}
            />
            <ListItem
                title="Umukunzi Elyse"
                description={`Email: elyseeumukunzi@gmail.com Phone: 0788888888`}
                accessoryLeft={ItemImage}
                accessoryRight={OverflowMenuSimpleUsageShowcase}
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