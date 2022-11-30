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
        <Layout level='1'>
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
            <ListItem
                title='UI Kitten'
                description='A set of React Native components'
                accessoryLeft={ItemImage}
                accessoryRight={OverflowMenuSimpleUsageShowcase}
            />
            <ListItem
                title='UI Kitten'
                description='A set of React Native components'
                accessoryLeft={ItemImage}
                accessoryRight={OverflowMenuSimpleUsageShowcase}
            />
            <ListItem
                title='UI Kitten'
                description='A set of React Native components'
                accessoryLeft={ItemImage}
                accessoryRight={OverflowMenuSimpleUsageShowcase}
            />
            <ListItem
                title='UI Kitten'
                description='A set of React Native components'
                accessoryLeft={ItemImage}
                accessoryRight={OverflowMenuSimpleUsageShowcase}
            />
            <ListItem
                title='UI Kitten'
                description='A set of React Native components'
                accessoryLeft={ItemImage}
                accessoryRight={OverflowMenuSimpleUsageShowcase}
            />
            <ListItem
                title='UI Kitten'
                description='A set of React Native components'
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