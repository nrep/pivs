import { Button, Icon, Input, Text } from '@ui-kitten/components';
import { TouchableWithoutFeedback } from '@ui-kitten/components/devsupport';
import React from 'react';
import { View } from 'react-native';
import { ImageOverlay } from './extra/image-overlay.component';
import { KeyboardAvoidingView } from './extra/keyboard-avoiding-view.component';
import { styles } from './form-styles';

export const CreateProductScreen = ({ navigation }) => {
	const [names, setNames] = React.useState("");
	const [price, setPrice] = React.useState("");
	const [manufactureDate, setManufactureDate] = React.useState("");
	const [expiryDate, setExpiryDate] = React.useState("");
	const [description, setDescription] = React.useState("");

	const onSignInButtonPress = () => {
		navigation && navigation.goBack();
	};

	const onSignUpButtonPress = () => {
		navigation && navigation.navigate('SignUp1');
	};

	return (
		<KeyboardAvoidingView>
			<ImageOverlay
				style={styles.container}
				source={require('./assets/image-background.jpg')}>
				<View style={styles.signInContainer}>
					<Text
						style={styles.signInLabel}
						status='control'
						category='h4'>
						CREATE PRODUCT
					</Text>
				</View>
				<View style={styles.formContainer}>
					<Input
						label='NAME'
						placeholder='Name'
						status='control'
						value={names}
						onChangeText={setNames}
					/>
					<Input
						label='MANUFACTURE DATE'
						placeholder='Manufacture Date'
						status='control'
						value={manufactureDate}
						onChangeText={setManufactureDate}
					/>
					<Input
						label='EXPIRY DATE'
						placeholder='Expiry Date'
						status='control'
						value={expiryDate}
						onChangeText={setExpiryDate}
					/>
					<Input
						label='DESCRIPTION'
						placeholder='Description'
						status='control'
						value={description}
						onChangeText={setDescription}
						multiline={true}
						numberOfLines={4}
					/>
					<Input
						label='PRICE'
						placeholder='Price'
						status='control'
						value={price}
						onChangeText={setPrice}
					/>
				</View>
				<Button
					status='control'
					size='large'
					onPress={onSignInButtonPress}>
					CREATE PRODUCT
				</Button>
			</ImageOverlay>
		</KeyboardAvoidingView>
	);
};