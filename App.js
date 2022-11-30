import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Button, Datepicker, Icon, IconRegistry, Input, Layout, Select, SelectItem, Text } from '@ui-kitten/components';
import { ViewProductScreen } from './view-product';
import { KeyboardAvoidingView } from './extra/3rd-party';
import { ImageOverlay } from './extra/image-overlay.component';
import { StyleSheet, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { ArrowForwardIcon, FacebookIcon, GoogleIcon, TwitterIcon } from './extra/icons';
import { IndexPath, TouchableWithoutFeedback } from '@ui-kitten/components/devsupport';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { ViewSuppliersScreen } from './ViewSuppliers';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { ProductListScreen } from './product-list';
// import { EvaIconsPack } from '@ui-kitten/eva-icons';
import DocumentPicker from 'react-native-document-picker';

const SignInScreen = ({ navigation }) => {
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));

	const onSignInButtonPress = () => {
		if (email === "manager" && password === "manager") {
			navigation && navigation.navigate('ViewSuppliers');
		} else if (email == "supplier" && password == "supplier") {
			navigation && navigation.navigate('ViewProducts', { userCategory: "supplier" });
		} else if (email == "customer" && password == "customer") {
			navigation && navigation.navigate('ViewProducts', { userCategory: "customer" });
		} else {
			fetch('http://standtogetherforchange.org/api.php', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					target: 'sign-in',
					email: email,
					password: password,
					userCategory: selectedIndex.row == 0 ? "manager" : selectedIndex.row == 1 ? "supplier" : "customer"
				})
			})
				.then((response) => response.json())
				.then((json) => {
					ToastAndroid.show(json.message, ToastAndroid.SHORT);
					if (json.value == 1) {
						if (json.userCategory == "manager") {
							navigation && navigation.navigate('ViewSuppliers');
						} else if (json.userCategory == "supplier") {
							navigation && navigation.navigate('ViewProducts', { userCategory: "supplier" });
						} else if (json.userCategory == "customer") {
							navigation && navigation.navigate('ViewProducts', { userCategory: "customer" });
						}
					}
				})
				.catch((error) => {
					ToastAndroid.show(error, ToastAndroid.SHORT);
				})
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
					<Select
						label={"Category"}
						selectedIndex={selectedIndex}
						onSelect={index => setSelectedIndex(index)}
						style={styles.passwordInput}>
						<SelectItem title='Manager' />
						<SelectItem title='Supplier' />
						<SelectItem title='Customer' />
					</Select>
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
		fetch('http://standtogetherforchange.org/api.php', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				target: 'sign-up',
				names: names,
				phoneNumber: phoneNumber,
				email: email,
				password: password,
				location: location,
				userName: userName,
			})
		})
			.then((response) => response.json())
			.then((json) => {
				ToastAndroid.show(json.message, ToastAndroid.SHORT);
				if (json.value == 1) {
					navigation && navigation.navigate('ViewProducts', { userCategory: 'customer' });
				}
			})
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
						accessoryRight={renderIcon}
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
		fetch('http://standtogetherforchange.org/api.php', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				target: 'create-supplier',
				names: names,
				phoneNumber: phoneNumber,
				email: email,
				password: password,
				address: address,
				userName: userName,
			})
		})
			.then((response) => response.json())
			.then((json) => {
				ToastAndroid.show(json.message, ToastAndroid.SHORT);
				if (json.value == 1) {
					navigation && navigation.navigate('ViewSuppliers');
				}
			})
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
						accessoryRight={renderIcon}
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
	const [singleFile, setSingleFile] = useState(null);

	const uploadImage = async () => {
		// Check if any file is selected or not
		if (singleFile != null) {
			// If file selected then create FormData
			const fileToUpload = singleFile;
			const data = new FormData();
			data.append('name', 'Image Upload');
			data.append('file_attachment', fileToUpload);
			// Please change file upload URL
			let res = await fetch(
				'http://localhost/upload.php',
				{
					method: 'post',
					body: data,
					headers: {
						'Content-Type': 'multipart/form-data; ',
					},
				}
			);
			let responseJson = await res.json();
			if (responseJson.status == 1) {
				alert('Upload Successful');
			}
		} else {
			// If no file selected the show alert
			alert('Please Select File first');
		}
	};

	const selectFile = async () => {
		// Opening Document Picker to select one file
		try {
			const res = await DocumentPicker.pick({
				// Provide which type of file you want user to pick
				type: [DocumentPicker.types.allFiles],
				// There can me more options as well
				// DocumentPicker.types.allFiles
				// DocumentPicker.types.images
				// DocumentPicker.types.plainText
				// DocumentPicker.types.audio
				// DocumentPicker.types.pdf
			});
			// Printing the log realted to the file
			console.log('res : ' + JSON.stringify(res));
			// Setting the state to show single file attributes
			setSingleFile(res);
		} catch (err) {
			setSingleFile(null);
			// Handling any exception (If any)
			if (DocumentPicker.isCancel(err)) {
				// If user canceled the document selection
				alert('Canceled');
			} else {
				// For Unknown Error
				alert('Unknown Error: ' + JSON.stringify(err));
				throw err;
			}
		}
	};

	const onSignInButtonPress = () => {
		fetch('http://standtogetherforchange.org/api.php', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				target: 'create-product',
				names: names,
				price: price,
				manufactureDate: manufactureDate,
				expiryDate: expiryDate,
				description: description,
			})
		})
			.then((response) => response.json())
			.then((json) => {
				ToastAndroid.show(json.message, ToastAndroid.SHORT);
				if (json.value == 1) {
					navigation && navigation.navigate('ViewProducts', { userCategory: 'supplier' });
				}
			})
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
					<Datepicker
						label='MANUFACTURE DATE'
						status='control'
						date={manufactureDate}
						onSelect={setManufactureDate}
					/>
					<Datepicker
						label='EXPIRY DATE'
						status='control'
						date={expiryDate}
						onSelect={setExpiryDate}
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
					{singleFile != null && (
						<Text style={styles.textStyle}>
							File Name: {singleFile.name ? singleFile.name : ''}
							{'\n'}
							Type: {singleFile.type ? singleFile.type : ''}
							{'\n'}
							File Size: {singleFile.size ? singleFile.size : ''}
							{'\n'}
							URI: {singleFile.uri ? singleFile.uri : ''}
							{'\n'}
						</Text>
					)}
					<TouchableOpacity
						style={styles.buttonStyle}
						activeOpacity={0.5}
						onPress={selectFile}>
						<Text style={styles.buttonTextStyle}>Select File</Text>
					</TouchableOpacity>
				</View>
				<Button
					style={styles.passwordInput}
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

