if (__DEV__) {
	import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}

import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Button, Card, Datepicker, Icon, IconRegistry, Input, Layout, Select, SelectItem, Text } from '@ui-kitten/components';
import { ViewProductScreen } from './view-product';
import { KeyboardAvoidingView } from './extra/3rd-party';
import { ImageOverlay } from './extra/image-overlay.component';
import { StyleSheet, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { IndexPath, TouchableWithoutFeedback } from '@ui-kitten/components/devsupport';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { ViewSuppliersScreen } from './ViewSuppliers';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { ProductListScreen } from './product-list';
// import { EvaIconsPack } from '@ui-kitten/eva-icons';
import DocumentPicker from 'react-native-document-picker';
import Reactotron from 'reactotron-react-native'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ViewCategoriesScreen } from './category-list';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import QRScanner from './qr-code-scanner';
import { ViewOrdersScreen } from './order-list';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

var baseUrl = "https://standtogetherforchange.org";

const storeSession = async (data) => {
	try {
		await AsyncStorage.setItem(
			'@session',
			JSON.stringify(data)
		);

		Reactotron.log({
			message: "Session stored successfully",
			data: await AsyncStorage.getItem('@session')
		});
	} catch (error) {
		// Error saving data
	}
};

const SignInScreen = ({ navigation }) => {
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));

	const onSignInButtonPress = async () => {
		try {
			var data = {
				target: 'sign-in',
				email: email,
				password: password,
				userCategory: selectedIndex.row == 0 ? "manager" : selectedIndex.row == 1 ? "supplier" : "customer"
			}

			const response = await axios({
				method: 'get',
				url: `${baseUrl}/api.php`,
				params: data,
			});

			Reactotron.log({
				response, data
			});

			if (response.status === 200) {
				let responseJson = response.data;
				ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
				if (responseJson.value == 1) {
					await storeSession(responseJson);
					if (responseJson.userCategory == "manager") {
						navigation && navigation.navigate('Manager');
					} else if (responseJson.userCategory == "supplier") {
						navigation && navigation.navigate('ViewProducts', { userCategory: "supplier" });
					} else if (responseJson.userCategory == "customer") {
						navigation && navigation.navigate('Customer', { userCategory: "customer" });
					}
				}
			} else {
				// Reactotron.log(response);
				throw new Error("An error has occurred");
			}
		} catch (error) {
			Reactotron.log({ error });
			console.error(error);
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
						<SelectItem title='Manager' value='Manager' />
						<SelectItem title='Supplier' value='Supplier' />
						<SelectItem title='Customer' value='Customer' />
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

	const onSignInButtonPress = async () => {
		try {
			var data = {
				target: 'sign-up',
				names: names,
				phoneNumber: phoneNumber,
				email: email,
				password: password,
				location: location,
				userName: userName,
			}

			const response = await axios({
				method: 'get',
				url: `${baseUrl}/api.php`,
				params: data,
			});

			Reactotron.log({
				response, data
			});

			if (response.status === 200) {
				let responseJson = response.data;
				ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
				if (responseJson.value == 1) {
					await storeSession(responseJson);
					navigation && navigation.navigate('Customer', { userCategory: 'customer' });
				}
			} else {
				// Reactotron.log(response);
				throw new Error("An error has occurred");
			}
		} catch (error) {
			Reactotron.log({ error });
			console.error(error);
		}
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
	const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
	const [categories, setCategories] = React.useState([]);

	React.useEffect(() => {
		const fetchData = async () => {
			fetch(`${baseUrl}/api.php?target=categories`)
				.then((response) => response.json())
				.then((json) => {
					setCategories(json);
					Reactotron.log(json);
				})
		};

		fetchData();
	}, []);

	const onSignInButtonPress = async () => {
		try {
			let session = await AsyncStorage.getItem('@session');
			session = JSON.parse(session);
			const managerId = session.id;

			var data = {
				target: 'create-supplier',
				names: names,
				phoneNumber: phoneNumber,
				email: email,
				password: password,
				address: address,
				userName: userName,
				category: categories[selectedIndex.row].CategoryId,
				managerId: managerId
			}

			Reactotron.log(data);

			const response = await axios({
				method: 'get',
				url: `${baseUrl}/api.php`,
				params: data,
			});

			Reactotron.log({
				response, data
			});

			if (response.status === 200) {
				let responseJson = response.data;
				ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
				if (responseJson.value == 1) {
					ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
					if (responseJson.value == 1) {
						navigation && navigation.navigate('ViewSuppliers');
					}
				}
			} else {
				// Reactotron.log(response);
				throw new Error("An error has occurred");
			}
		} catch (error) {
			Reactotron.log({ error });
			console.error(error);
		}
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
					<Select
						label={"Category"}
						selectedIndex={selectedIndex}
						onSelect={index => setSelectedIndex(index)}
						style={styles.passwordInput}>
						{Array.isArray(categories) && categories.map((category, index) => (
							<SelectItem title={category.CategoryName} value={category.CategoryName} key={index} />
						))}
					</Select>
				</View>
				<Button
					style={styles.passwordInput}
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
	const [singleFile, setSingleFile] = React.useState(null);

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
				ToastAndroid.show('Upload Successful', ToastAndroid.SHORT);
				navigation && navigation.navigate('ViewProducts', { userCategory: 'supplier' });
			}
		} else {
			// If no file selected the show alert
			ToastAndroid.show('Please Select File first', ToastAndroid.SHORT);
		}
	};

	const selectFile = async () => {
		// Opening Document Picker to select one file
		try {
			const res = await DocumentPicker.pick({
				// Provide which type of file you want user to pick
				type: [DocumentPicker.types.images],
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

	const onSignInButtonPress = async () => {
		try {
			let session = await AsyncStorage.getItem('@session');
			session = JSON.parse(session);
			const supplierId = session.id;

			var data = {
				target: 'create-product',
				name: names,
				price: price,
				manufactureDate: manufactureDate,
				expiryDate: expiryDate,
				description: description,
				supplierId: supplierId
			}

			Reactotron.log({ data });

			const response = await axios({
				method: 'get',
				url: `${baseUrl}/api.php`,
				params: data,
			});

			Reactotron.log({
				response, data
			});

			if (response.status === 200) {
				let responseJson = response.data;
				ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
				if (responseJson.value == 1) {
					ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
					if (responseJson.value == 1) {
						await uploadImage();
					}
				}
			} else {
				// Reactotron.log(response);
				throw new Error("An error has occurred");
			}
		} catch (error) {
			Reactotron.log({ error });
			console.error(error);
		}
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

const CreateCategoryScreen = ({ navigation }) => {
	const [name, setName] = React.useState("");
	const [description, setDescription] = React.useState("");

	const onSignInButtonPress = async () => {
		try {
			var data = {
				target: 'create-category',
				name,
				description,
			}

			const response = await axios({
				method: 'get',
				url: `${baseUrl}/api.php`,
				params: data,
			});

			Reactotron.log({
				response, data
			});

			if (response.status === 200) {
				let responseJson = response.data;
				ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
				if (responseJson.value == 1) {
					navigation && navigation.navigate('ViewCategories');
				}
			} else {
				// Reactotron.log(response);
				throw new Error("An error has occurred");
			}
		} catch (error) {
			Reactotron.log({ error });
			console.error(error);
		}
	};

	return (
		<KeyboardAvoidingView>
			<ImageOverlay
				style={styles.container}
				source={require('./assets/880687.jpg')}>
				<View style={styles.formContainer}>
					<Input
						label='NAME'
						placeholder='name'
						status='control'
						value={name}
						onChangeText={setName}
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
				</View>
				<Button
					status='control'
					size='large'
					onPress={onSignInButtonPress}>
					CREATE CATEGORY
				</Button>
			</ImageOverlay>
		</KeyboardAvoidingView>
	);
};

const CreateOrderScreen = ({ navigation, route }) => {
	const [quantity, setQuantity] = React.useState(1);
	const [totalPrice, setTotalPrice] = React.useState(0);

	const { product } = route.params;

	React.useEffect(() => {
		setTotalPrice(quantity * product.price);
	}, [product]);

	React.useEffect(() => {
		setTotalPrice(quantity * product.price);
	}, [quantity])

	const onSignInButtonPress = async () => {
		try {
			let session = await AsyncStorage.getItem('@session');
			session = JSON.parse(session);
			const customerId = session.id;

			var data = {
				target: 'create-order',
				customerId,
				productId: product.id,
				quantity
			}

			const response = await axios({
				method: 'get',
				url: `${baseUrl}/api.php`,
				params: data,
			});

			Reactotron.log({
				response, data
			});

			if (response.status === 200) {
				let responseJson = response.data;
				ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
				if (responseJson.value == 1) {
					navigation && navigation.navigate('ViewOrders');
				}
			} else {
				// Reactotron.log(response);
				throw new Error("An error has occurred");
			}
		} catch (error) {
			Reactotron.log({ error });
			console.error(error);
		}
	};

	return (
		<KeyboardAvoidingView>
			<ImageOverlay
				style={styles.container}
				source={require('./assets/880687.jpg')}>
				<Card>
					<View style={styles.formContainer}>
						<Layout style={styles.layoutContainer}>
							<Layout style={styles.layout} level='4'>
								<Text category='s1'>Product Name:</Text>
							</Layout>
							<Layout style={styles.layout} level='3'>
								<Text>{product.name}</Text>
							</Layout>
						</Layout>
						<Layout style={styles.layoutContainer}>
							<Layout style={styles.layout} level='4'>
								<Text category='s1'>Unit Price:</Text>
							</Layout>
							<Layout style={styles.layout} level='3'>
								<Text>{product.price}</Text>
							</Layout>
						</Layout>
						<Layout style={styles.layoutContainer}>
							<Layout style={styles.layout} level='4'>
								<Text category='s1'>Quantity:</Text>
							</Layout>
							<Layout style={styles.layout} level='3'>
								<Input
									placeholder='Enter Quantity'
									value={quantity}
									onChangeText={setQuantity}
								/>
							</Layout>
						</Layout>
						<Layout style={styles.layoutContainer}>
							<Layout style={styles.layout} level='4'>
								<Text category='s1'>Total Price:</Text>
							</Layout>
							<Layout style={styles.layout} level='3'>
								<Text category='s1'>{totalPrice}</Text>
							</Layout>
						</Layout>
						<Button
							status='control'
							size='large'
							onPress={onSignInButtonPress}>
							CREATE ORDER
						</Button>
					</View>
				</Card>
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
	)
}
const Drawer = createDrawerNavigator();

function ManagerScreens() {
	return (
		<Drawer.Navigator>
			<Drawer.Screen name='ViewSuppliers' component={ViewSuppliersScreen} />
			<Drawer.Screen name="ViewCategories" component={ViewCategoriesScreen} />
		</Drawer.Navigator>
	);
}

const Tab = createBottomTabNavigator();

function CustomerScreens() {
	return (
		<Tab.Navigator initialRouteName="ViewProducts">
			<Tab.Screen name='Scanner' component={QRScanner} />
			<Tab.Screen
				name='ViewProducts'
				component={ProductListScreen}
				options={{
					tabBarLabel: 'Home',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons name="home" color={color} size={size} />
					),
				}}
			/>
			<Tab.Screen name='ViewOrders' component={ViewOrdersScreen} />
		</Tab.Navigator>
	)
}

export default () => (
	<>
		<IconRegistry icons={EvaIconsPack} />
		<ApplicationProvider {...eva} theme={eva.light}>
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen name="Auth" component={Auth} options={{ headerShown: false }} />
					<Stack.Screen name="Manager" component={ManagerScreens} options={{ headerShown: false }} />
					<Stack.Screen name="CreateSupplier" component={CreateSupplierScreen} />
					<Stack.Screen name="CreateCategory" component={CreateCategoryScreen} />
					<Stack.Screen name="CreateProduct" component={CreateProductScreen} />
					<Stack.Screen name='Customer' component={CustomerScreens} options={{ headerShown: false }} />
					<Stack.Screen name="ViewProducts" component={ProductListScreen} />
					<Stack.Screen name="ViewProduct" component={ViewProductScreen} />
					<Stack.Screen name="CreateOrder" component={CreateOrderScreen} />
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
	buttonStyle: {
		backgroundColor: '#307ecc',
		borderWidth: 1,
		color: '#FFFFFF',
		borderColor: '#307ecc',
		height: 40,
		alignItems: 'center',
		borderRadius: 30,
		marginLeft: 35,
		marginRight: 35,
		marginTop: 15,
	},
	buttonTextStyle: {
		color: '#FFFFFF',
		paddingVertical: 10,
		fontSize: 16,
	},
	textStyle: {
		backgroundColor: '#fff',
		fontSize: 15,
		marginTop: 16,
		marginLeft: 35,
		marginRight: 35,
		textAlign: 'center',
	},
	layoutContainer: {
		flex: 1,
		flexDirection: 'row',
	},
	layout: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	}
});

