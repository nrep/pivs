if (__DEV__) {
	import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}

import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Button, Card, Datepicker, Icon, IconRegistry, Input, Layout, Select, SelectItem, Spinner, Text } from '@ui-kitten/components';
import { ViewProductScreen } from './view-product';
import { KeyboardAvoidingView } from './extra/3rd-party';
import { ImageOverlay } from './extra/image-overlay.component';
import { Image, StyleSheet, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { IndexPath, TouchableWithoutFeedback } from '@ui-kitten/components/devsupport';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { ViewSuppliersScreen } from './ViewSuppliers';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { ProductListScreen } from './product-list';
import DocumentPicker from 'react-native-document-picker';
import Reactotron from 'reactotron-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ViewCategoriesScreen } from './category-list';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import QRScanner from './qr-code-scanner';
import { ViewOrdersScreen } from './order-list';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RNBootSplash from "react-native-bootsplash";
import { SupplierSettingsScreen } from './supplier-settings';
import { ViewCustomersScreen } from './customer-list';
import { CustomerSettingsScreen } from './customer-settings';
import { launchImageLibrary } from 'react-native-image-picker';
import { OrderDetailsScreen } from './view-order';
import { ManagerSettingsScreen } from './manager-settings';

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

const LoadingIndicator = (props) => (
	<View style={[props.style, styles.indicator]}>
		<Spinner size='small' />
	</View>
);

const SignInScreen = ({ navigation }) => {
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
	const [isLoading, setIsLoading] = React.useState(false);

	const userCategories = [
		'Manager',
		'Supplier',
		'Customer'
	]

	const displayValue = userCategories[selectedIndex.row];

	const renderOption = (title, key) => (
		<SelectItem title={title} key={key} />
	);


	const onSignInButtonPress = async () => {
		try {
			setIsLoading(true);
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
					setIsLoading(false);
					if (responseJson.userCategory == "manager") {
						navigation && navigation.navigate('Manager');
					} else if (responseJson.userCategory == "supplier") {
						navigation && navigation.navigate('Supplier', { userCategory: "supplier" });
					} else if (responseJson.userCategory == "customer") {
						navigation && navigation.navigate('Customer', { userCategory: "customer" });
					}
				}
				setIsLoading(false);
			} else {
				// Reactotron.log(response);
				setIsLoading(false);
				throw new Error("An error has occurred");
			}
		} catch (error) {
			setIsLoading(false);
			Reactotron.log({ error });
			console.error(error);
		}
	};

	const onSignUpButtonPress = () => {
		navigation && navigation.navigate('SignUp', {
			context: "sign-up"
		});
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
						style={styles.passwordInput}
						placeholder="Manager"
						status='control'
						value={displayValue}>
						{userCategories.map(renderOption)}
					</Select>
				</View>
				<Button
					status='control'
					size='large'
					onPress={onSignInButtonPress}
					disabled={isLoading}
					accessoryLeft={() => isLoading && <LoadingIndicator />}>
					SIGN IN
				</Button>
			</ImageOverlay>
		</KeyboardAvoidingView>
	);
};

const SignUpScreen = ({ navigation, route }) => {
	const [names, setNames] = React.useState(null);
	const [phoneNumber, setPhoneNumber] = React.useState(null);
	const [email, setEmail] = React.useState(null);
	const [password, setPassword] = React.useState(null);
	const [location, setLocation] = React.useState(null);
	const [secureTextEntry, setSecureTextEntry] = React.useState(true);
	const [userName, setUserName] = React.useState(null);
	const [customer, setCustomer] = React.useState({});
	const [context, setContext] = React.useState("create");
	const [isLoading, setIsLoading] = React.useState(false);

	const isEnabled = () => {
		return (names !== null && phoneNumber !== null && email !== null && password !== null && location !== null && userName !== null);
	}

	React.useEffect(() => {
		if (route.params?.context) {
			setContext(route.params.context);
		}
	}, [route.params?.context]);

	React.useEffect(() => {
		if (context == "edit") {
			setCustomer(route.params?.customer);
		}
	}, [context]);

	React.useEffect(() => {
		if (context == "edit") {
			setNames(customer.FullName);
			setPhoneNumber(customer.PhoneNumber);
			setEmail(customer.Email);
			setLocation(customer.Location);
			setUserName(customer.UserName);
			setPassword(customer.PassWord);
		}
	}, [customer])

	const onSignInButtonPress = async () => {
		setIsLoading(true);
		try {
			var data = {
				target: context == "sign-up" ? 'sign-up' : 'update-customer',
				names: names,
				phoneNumber: phoneNumber,
				email: email,
				password: password,
				location: location,
				userName: userName,
			}

			if (context == "edit") {
				data.customerId = customer.CustomerId
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
				setIsLoading(false);
				let responseJson = response.data;
				ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
				if (responseJson.value == 1) {
					await storeSession(responseJson);
					if (context == "sign-up") {
						navigation && navigation.navigate('SignIn');
					} else {
						navigation && navigation.navigate('Customer', {
							screen: 'Settings',
						});
					}
				}
			} else {
				setIsLoading(false);
				// Reactotron.log(response);
				throw new Error("An error has occurred");
			}
		} catch (error) {
			setIsLoading(false);
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
						{context == "edit" ? "EDIT PROFILE" : "SIGN UP"}
					</Text>
					{context == "sign-up" && (
						<Button
							style={styles.signUpButton}
							appearance='ghost'
							status='control'
							size='giant'
							onPress={onSignUpButtonPress}>
							Sign In
						</Button>
					)}
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
					onPress={onSignInButtonPress}
					disabled={!isEnabled || isLoading}
					accessoryLeft={() => isLoading && <LoadingIndicator />}>
					{context == "edit" ? "UPDATE PROFILE" : "SIGN UP"}
				</Button>
			</ImageOverlay>
		</KeyboardAvoidingView>
	);
};

const CreateSupplierScreen = ({ navigation, route }) => {
	const [names, setNames] = React.useState("");
	const [phoneNumber, setPhoneNumber] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [secureTextEntry, setSecureTextEntry] = React.useState(true);
	const [address, setAddress] = React.useState("");
	const [userName, setUserName] = React.useState("");
	const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
	const [categories, setCategories] = React.useState([]);
	const [supplier, setSupplier] = React.useState({});
	const [isLoading, setIsLoading] = React.useState(false);

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

	const { context } = route.params;

	React.useEffect(() => {
		if (context == "edit") {
			setSupplier(route.params.supplier);
		}
	}, [context]);

	React.useEffect(() => {
		if (context == "edit") {
			setNames(supplier.FullName);
			setPhoneNumber(supplier.PhoneNumber);
			setEmail(supplier.Email);
			setAddress(supplier.Adress);
			setUserName(supplier.UserName);
			setPassword(supplier.PassWord);
			setSelectedIndex(new IndexPath(supplier.CategoryId - 1));
		}
	}, [supplier]);

	const onSignInButtonPress = async () => {
		setIsLoading(true);
		try {
			let session = await AsyncStorage.getItem('@session');
			session = JSON.parse(session);
			Reactotron.log(session)
			const userCategory = session.userCategory;
			const managerId = userCategory == "manager" ? session.id : session.data.ManagerId;

			var data = {
				target: context == "edit" ? "update-supplier" : "create-supplier",
				names: names,
				phoneNumber: phoneNumber,
				email: email,
				password: password,
				address: address,
				userName: userName,
				category: categories[selectedIndex.row].CategoryId,
				managerId: managerId
			}

			if (context == "edit") {
				data.supplierId = supplier.SupplierId;
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

			setIsLoading(false);

			if (response.status === 200) {
				let responseJson = response.data;
				ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
				if (responseJson.value == 1) {
					ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
					if (responseJson.value == 1) {
						if (userCategory == "manager") {
							navigation && navigation.navigate('ViewSuppliers');
						} else {
							navigation && navigation.navigate('Settings');
						}
					}
				}
			} else {
				// Reactotron.log(response);
				throw new Error("An error has occurred");
			}
		} catch (error) {
			setIsLoading(false);
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
					onPress={onSignInButtonPress}
					disabled={isLoading}
					accessoryLeft={() => isLoading && <LoadingIndicator />}>
					{context && context == "edit" ? "UPDATE SUPPLIER" : "CREATE SUPPLIER"}
				</Button>
			</ImageOverlay>
		</KeyboardAvoidingView>
	);
};

const CreateProductScreen = ({ navigation, route }) => {
	const [names, setNames] = React.useState("");
	const [price, setPrice] = React.useState("");
	const [manufactureDate, setManufactureDate] = React.useState("");
	const [expiryDate, setExpiryDate] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [product, setProduct] = React.useState({});
	const [photo, setPhoto] = React.useState(null);
	const [isLoading, setIsLoading] = React.useState(false);
	const [quantity, setQuantity] = React.useState(1);

	const { context } = route.params;

	React.useEffect(() => {
		if (context && context == "edit") {
			setProduct(route.params.product);
		}
	}, [context]);

	React.useEffect(() => {
		if (context == "edit" && product) {
			setNames(product.ProductName);
			setPrice(product.Price);
			setManufactureDate(Date.parse(product.MfgDate));
			setExpiryDate(Date.parse(product.ExpDate));
			setDescription(product.Description);
		}
	}, [product]);

	const createFormData = (photo, body = {}) => {
		Reactotron.log({ photo })
		const data = new FormData();

		data.append('photo', {
			name: photo.assets[0].fileName,
			type: photo.assets[0].type,
			uri: Platform.OS === 'ios' ? photo.assets[0].uri.replace('file://', '') : photo.assets[0].uri,
		});

		Object.keys(body).forEach((key) => {
			data.append(key, body[key]);
		});

		return data;
	};

	const handleChoosePhoto = () => {
		launchImageLibrary({ noData: true }, (response) => {
			Reactotron.log({ response })
			if (response) {
				setPhoto(response);
			}
		});
	};

	const handleUploadPhoto = async (productId) => {
		const client = axios.create({
			baseURL: baseUrl
		});
		const headers = {
			'Content-Type': 'multipart/form-data'
		}
		const data = createFormData(photo, { productId: productId });
		let res = await client.post('/upload.php', data, {
			headers: headers
		});
		if (res.status === 200) {
			ToastAndroid.show('Upload Successful', ToastAndroid.SHORT);
			navigation && navigation.navigate('ViewProducts', { userCategory: 'supplier' });
		}
	};

	const onSignInButtonPress = async () => {
		setIsLoading(true);
		try {
			let session = await AsyncStorage.getItem('@session');
			session = JSON.parse(session);
			const supplierId = session.id;

			var data = {
				target: context == "edit" ? 'update-product' : 'create-product',
				name: names,
				price: price,
				manufactureDate: manufactureDate,
				expiryDate: expiryDate,
				description: description,
				supplierId: supplierId,
				quantity
			}

			if (context == "edit") {
				data.productId = product.ProductId;
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
					await handleUploadPhoto(responseJson.id);
					setIsLoading(false);
				}
				setIsLoading(false);
			} else {
				setIsLoading(false);
				// Reactotron.log(response);
				throw new Error("An error has occurred");
			}
		} catch (error) {
			setIsLoading(false);
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
						label='QUANTITY'
						placeholder='Quantity'
						status='control'
						value={quantity}
						onChangeText={setQuantity}
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
					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
						<Button title="Choose Photo" onPress={handleChoosePhoto}>Choose Photo</Button>
					</View>
				</View>
				<Button
					style={styles.passwordInput}
					status='control'
					size='large'
					onPress={onSignInButtonPress}
					disabled={isLoading}
					accessoryLeft={() => isLoading && <LoadingIndicator />}>
					{context == 'edit' ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
				</Button>
			</ImageOverlay>
		</KeyboardAvoidingView>
	);
};

const CreateCategoryScreen = ({ navigation, route }) => {
	const [name, setName] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [category, setCategory] = React.useState("");
	const [isLoading, setIsLoading] = React.useState(false);

	const { context } = route.params;

	React.useEffect(() => {
		if (context == 'edit') {
			setCategory(route.params.category);
		}
	}, [context]);

	React.useEffect(() => {
		if (context == 'edit') {
			setName(category.CategoryName);
			setDescription(category.Description);
		}
	}, [category]);

	const onSignInButtonPress = async () => {
		try {
			var data = {
				target: context == 'edit' ? 'update-category' : 'create-category',
				name,
				description,
			}

			if (context == 'edit') {
				data.categoryId = category.CategoryId;
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
					onPress={onSignInButtonPress}
					disabled={isLoading}
					accessoryLeft={() => isLoading && <LoadingIndicator />}>
					{context == 'edit' ? 'UPDATE CATEGORY' : 'CREATE CATEGORY'}
				</Button>
			</ImageOverlay>
		</KeyboardAvoidingView>
	);
};

const CreateOrderScreen = ({ navigation, route }) => {
	const [quantity, setQuantity] = React.useState(1);
	const [totalPrice, setTotalPrice] = React.useState(0);
	const [isLoading, setIsLoading] = React.useState(false);
	const [phoneNumber, setPhoneNumber] = React.useState("");

	const { product } = route.params;

	React.useEffect(() => {
		setQuantity(route.params?.quantity);
	}, [route.params?.quantity])

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
			setPhoneNumber(session.data.PhoneNumber);

			var data = {
				target: 'create-order',
				customerId,
				productId: product.id,
				quantity,
				phone: phoneNumber,
				totalPrice,
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
					<View style={[styles.formContainer, styles.passwordInput]}>
						<Layout style={[styles.layoutContainer, styles.passwordInput]}>
							<Layout style={styles.layout} level='4'>
								<Text category='s1'>Product Name:</Text>
							</Layout>
							<Layout style={styles.layout} level='3'>
								<Text>{product.name}</Text>
							</Layout>
						</Layout>
						<Layout style={[styles.layoutContainer, styles.passwordInput]}>
							<Layout style={styles.layout} level='4'>
								<Text category='s1'>Unit Price:</Text>
							</Layout>
							<Layout style={styles.layout} level='3'>
								<Text>{product.price}</Text>
							</Layout>
						</Layout>
						<Layout style={[styles.layoutContainer, styles.passwordInput]}>
							<Layout style={styles.layout} level='4'>
								<Text category='s1'>Payment Phone Number:</Text>
							</Layout>
							<Layout style={styles.layout} level='3'>
								<Input
									placeholder='Enter Quantity'
									value={phoneNumber}
									onChangeText={setPhoneNumber}
								/>
							</Layout>
						</Layout>
						<Layout style={[styles.layoutContainer, styles.passwordInput]}>
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
						<Layout style={[styles.layoutContainer, styles.passwordInput]}>
							<Layout style={styles.layout} level='4'>
								<Text category='s1'>Total Price:</Text>
							</Layout>
							<Layout style={styles.layout} level='3'>
								<Text category='s1'>{totalPrice}</Text>
							</Layout>
						</Layout>
						<Button
							size='large'
							disabled={isLoading}
							accessoryLeft={() => isLoading && <LoadingIndicator />}
							onPress={onSignInButtonPress}>
							PLACE ORDER
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
			<Stack.Screen name="SignIn" component={SignInScreen} options={{
				headerShown: false,
				title: 'Sign In'
			}} />
			<Stack.Screen name="SignUp"
				component={SignUpScreen}
				options={({ route }) => ({
					title: route.params?.context && route.params.context == "sign-up" ? "Create Account" : "Update Profile",
					headerShown: route.params?.context && route.params.context == "sign-up" ? false : true
				})}
			/>
		</Stack.Navigator>
	)
}
const Drawer = createDrawerNavigator();

function ManagerScreens() {
	return (
		<Drawer.Navigator>
			<Drawer.Screen
				name='ViewSuppliers'
				component={ViewSuppliersScreen}
				options={{
					title: 'Suppliers',
				}}
			/>
			<Drawer.Screen
				name="ViewCategories"
				component={ViewCategoriesScreen}
				options={{
					title: 'Categories',
				}}
			/>
			<Drawer.Screen
				name="ViewCustomers"
				component={ViewCustomersScreen}
				options={{
					title: 'Customers',
				}}
			/>
			<Drawer.Screen
				name="Settings"
				component={ManagerSettingsScreen}
			/>
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
					title: 'Products',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons name="home" color={color} size={26} />
					),
				}}
			/>
			<Tab.Screen
				name='ViewOrders'
				component={ViewOrdersScreen}
				options={{
					title: 'Orders',
					tabBarIcon: ({ color, size }) => (
						<Icon name="home" color={color} size={26} />
					),
				}}
			/>
			<Tab.Screen
				name='Settings'
				component={CustomerSettingsScreen}
				options={{
					tabBarIcon: ({ color, size }) => (
						<MaterialIcons name="settings" color={color} size={26} />
					),
				}}
			/>
		</Tab.Navigator>
	)
}

const SettingsIcon = (props) => (
	<Icon {...props} name='settings' />
)

const SuppplierTab = createBottomTabNavigator();

function SupplierScreens() {
	return (
		<SuppplierTab.Navigator initialRouteName="ViewProducts">
			<SuppplierTab.Screen
				name='ViewProducts'
				component={ProductListScreen}
				options={{
					title: 'Products',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons name="home" color={color} size={size} />
					),
				}}
			/>
			<SuppplierTab.Screen
				name='ViewOrders'
				component={ViewOrdersScreen}
				options={{
					title: 'Orders'
				}}
			/>
			<SuppplierTab.Screen
				name='Settings'
				component={SupplierSettingsScreen}
				options={{
					tabBarIcon: ({ color, size }) => (
						<SettingsIcon color={color} size={size} />
					),
				}}
			/>
		</SuppplierTab.Navigator>
	)
}

export default () => (
	<>
		<IconRegistry icons={EvaIconsPack} />
		<ApplicationProvider {...eva} theme={eva.light}>
			<NavigationContainer>
				<Stack.Navigator
					screenOptions={{
						headerStyle: {
							backgroundColor: '#00acc1',
						},
						headerTintColor: '#fff',
						headerTitleStyle: {
							fontWeight: 'bold',
						},
					}}
				>
					<Stack.Screen name="Auth" component={Auth} options={{ headerShown: false }} />
					<Stack.Screen name="Manager" component={ManagerScreens} options={{ headerShown: false }} />
					<Stack.Screen
						name="CreateSupplier"
						component={CreateSupplierScreen}
						options={({ route }) => ({
							title: route.params?.context && route.params.context == "create" ? "Create Supplier" : "Update Supplier",
						})}
					/>
					<Stack.Screen
						name="CreateCategory"
						component={CreateCategoryScreen}
						options={({ route }) => ({
							title: route.params?.context && route.params.context == "create" ? "Create Category" : "Update Category",
						})}
					/>
					<Stack.Screen name="Supplier" component={SupplierScreens} options={{ headerShown: false }} />
					<Stack.Screen name='Customer' component={CustomerScreens} options={{ headerShown: false }} />
					<Stack.Screen
						name="ViewProduct"
						component={ViewProductScreen}
						options={({ route }) => ({
							title: route.params?.product && route.params.product.name,
						})}
					/>
					<Stack.Screen
						name="CreateOrder"
						component={CreateOrderScreen}
						options={({ route }) => ({
							title: route.params?.context && route.params.context == "create" ? "Create Order" : "Update Order",
						})}
					/>
					<Stack.Screen
						name="CreateProduct"
						component={CreateProductScreen}
						options={({ route }) => ({
							title: route.params?.context && route.params.context == "create" ? "Create Product" : "Update Product",
						})}
					/>
					<Stack.Screen
						name="OrderDetails"
						component={OrderDetailsScreen}
						options={{ title: "Order Details" }}
					/>
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
	},
	indicator: {
		justifyContent: 'center',
		alignItems: 'center',
	},
});

