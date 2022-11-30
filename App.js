import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Button, Icon, IconRegistry, Input, Layout, Text } from '@ui-kitten/components';
import { ViewProductScreen } from './view-product';
import { KeyboardAvoidingView } from './extra/3rd-party';
import { ImageOverlay } from './extra/image-overlay.component';
import { StyleSheet, View } from 'react-native';
import { ArrowForwardIcon, FacebookIcon, GoogleIcon, TwitterIcon } from './extra/icons';
import { TouchableWithoutFeedback } from '@ui-kitten/components/devsupport';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { ViewSuppliersScreen } from './ViewSuppliers';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { ProductListScreen } from './product-list';
// import { EvaIconsPack } from '@ui-kitten/eva-icons';

const SignInScreen = ({ navigation }) => {
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");

	const onSignInButtonPress = () => {
		if (email === "manager" && password === "manager") {
			navigation && navigation.navigate('ViewSuppliers');
		} else if (email == "supplier" && password == "supplier") {
			navigation && navigation.navigate('ViewProducts', { userCategory: "supplier" });
		} else if (email == "customer" && password == "customer") {
			navigation && navigation.navigate('ViewProducts', { userCategory: "customer" });
		}
	};

	const onSignUpButtonPress = () => {
		navigation && navigation.navigate('SignUp');
	};

	return (
		<KeyboardAvoidingView>
			<ImageOverlay
				style={styles.container}
				source={require('./assets/880687.jpg')}>
				<View style={styles.signInContainer}>
					<Text
						style={styles.signInLabel}
						status='control'
						category='h4'>
						SIGN IN
					</Text>
					<Button
						style={styles.signUpButton}
						appearance='ghost'
						status='control'
						size='giant'
						onPress={onSignUpButtonPress}>
						Sign Up
					</Button>
				</View>
				<View style={styles.formContainer}>
					<Input
						label='EMAIL'
						placeholder='Email'
						status='control'
						value={email}
						onChangeText={setEmail}
					/>
					<Input
						style={styles.passwordInput}
						secureTextEntry={true}
						placeholder='Password'
						label='PASSWORD'
						status='control'
						value={password}
						onChangeText={setPassword}
					/>
				</View>
				<Button
					status='control'
					size='large'
					onPress={onSignInButtonPress}>
					SIGN IN
				</Button>
			</ImageOverlay>
		</KeyboardAvoidingView>
	);
};

const SignUpScreen = ({ navigation }) => {
	const [names, setNames] = React.useState("");
	const [phoneNumber, setPhoneNumber] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [location, setLocation] = React.useState("");
	const [secureTextEntry, setSecureTextEntry] = React.useState(true);
	const [userName, setUserName] = React.useState("");

	const onSignInButtonPress = () => {
		navigation && navigation.navigate('ViewProducts', { userCategory: 'customer' });
	};

	const onSignUpButtonPress = () => {
		navigation && navigation.navigate('SignIn');
	};

	const toggleSecureEntry = () => {
		setSecureTextEntry(!secureTextEntry);
	};

	const renderIcon = (props) => (
		<TouchableWithoutFeedback onPress={toggleSecureEntry}>
			<Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
		</TouchableWithoutFeedback>
	);

	return (
		<KeyboardAvoidingView>
			<ImageOverlay
				style={styles.container}
				source={require('./assets/1088280.jpg')}>
				<View style={styles.signInContainer}>
					<Text
						style={styles.signInLabel}
						status='control'
						category='h4'>
						SIGN UP
					</Text>
					<Button
						style={styles.signUpButton}
						appearance='ghost'
						status='control'
						size='giant'
						onPress={onSignUpButtonPress}>
						Sign In
					</Button>
				</View>
				<View style={styles.formContainer}>
					<Input
						label='NAMES'
						placeholder='Full Name'
						status='control'
						value={names}
						onChangeText={setNames}
					/>
					<Input
						label='LOCATION'
						placeholder='Location'
						status='control'
						value={location}
						onChangeText={setLocation}
					/>
					<Input
						label='PHONE NUMBER'
						placeholder='0788888888'
						status='control'
						value={phoneNumber}
						onChangeText={setPhoneNumber}
					/>
					<Input
						label='EMAIL'
						placeholder='Email'
						status='control'
						value={email}
						onChangeText={setEmail}
					/>
					<Input
						label='USER NAME'
						placeholder='User name'
						status='control'
						value={userName}
						onChangeText={setUserName}
					/>
					<Input
						style={styles.passwordInput}
						placeholder='Password'
						label='PASSWORD'
						status='control'
						value={password}
						onChangeText={setPassword}
						secureTextEntry={secureTextEntry}
					/>
				</View>
				<Button
					status='control'
					size='large'
					onPress={onSignInButtonPress}>
					SIGN UP
				</Button>
			</ImageOverlay>
		</KeyboardAvoidingView>
	);
};

const CreateSupplierScreen = ({ navigation }) => {
	const [names, setNames] = React.useState("");
	const [phoneNumber, setPhoneNumber] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [secureTextEntry, setSecureTextEntry] = React.useState(true);
	const [address, setAddress] = React.useState("");
	const [userName, setUserName] = React.useState("");

	const onSignInButtonPress = () => {
		navigation && navigation.goBack();
	};

	const onSignUpButtonPress = () => {
		navigation && navigation.navigate('SignUp1');
	};

	const toggleSecureEntry = () => {
		setSecureTextEntry(!secureTextEntry);
	};

	const renderIcon = (props) => (
		<TouchableWithoutFeedback onPress={toggleSecureEntry}>
			<Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
		</TouchableWithoutFeedback>
	);

	return (
		<KeyboardAvoidingView>
			<ImageOverlay
				style={styles.container}
				source={require('./assets/880687.jpg')}>
				<View style={styles.signInContainer}>
					<Text
						style={styles.signInLabel}
						status='control'
						category='h4'>
						CREATE SUPPLIER
					</Text>
				</View>
				<View style={styles.formContainer}>
					<Input
						label='FULL NAME'
						placeholder='Full Name'
						status='control'
						value={names}
						onChangeText={setNames}
					/>
					<Input
						label='ADDRESS'
						placeholder='Address'
						status='control'
						value={address}
						onChangeText={setAddress}
					/>
					<Input
						label='PHONE NUMBER'
						placeholder='0788888888'
						status='control'
						value={phoneNumber}
						onChangeText={setPhoneNumber}
					/>
					<Input
						label='EMAIL'
						placeholder='Email'
						status='control'
						value={email}
						onChangeText={setEmail}
					/>
					<Input
						label='USER NAME'
						placeholder='User name'
						status='control'
						value={userName}
						onChangeText={setUserName}
					/>
					<Input
						style={styles.passwordInput}
						placeholder='Password'
						label='PASSWORD'
						status='control'
						value={password}
						onChangeText={setPassword}
						secureTextEntry={secureTextEntry}
					/>
				</View>
				<Button
					status='control'
					size='large'
					onPress={onSignInButtonPress}>
					CREATE SUPPLIER
				</Button>
			</ImageOverlay>
		</KeyboardAvoidingView>
	);
};

const CreateProductScreen = ({ navigation }) => {
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

const Stack = createNativeStackNavigator();

function Auth() {
	return (
		<Stack.Navigator>
			<Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
			<Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
		</Stack.Navigator>
	);
}

const Stack1 = createNativeStackNavigator();

export default () => (
	<>
		<IconRegistry icons={EvaIconsPack} />
		<ApplicationProvider {...eva} theme={eva.light}>
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
					<Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
					{/* <Stack1.Screen name="Auth" component={Auth} options={{ headerShown: false }} /> */}
					<Stack1.Screen name="CreateSupplier" component={CreateSupplierScreen} />
					<Stack1.Screen name='CreateProduct' component={CreateProductScreen} />
					<Stack1.Screen name='ViewSuppliers' component={ViewSuppliersScreen} />
					<Stack1.Screen name='ViewProducts' component={ProductListScreen} />
					<Stack1.Screen name='ViewProduct' component={ViewProductScreen} />
				</Stack.Navigator>
			</NavigationContainer>
		</ApplicationProvider>
	</>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 24,
		paddingHorizontal: 16,
	},
	signInContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 24,
	},
	socialAuthContainer: {
		marginTop: 48,
	},
	evaButton: {
		maxWidth: 72,
		paddingHorizontal: 0,
	},
	formContainer: {
		flex: 1,
		marginTop: 48,
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
});

