import * as React from 'react';

import { StyleSheet, Text } from 'react-native';
import { useCameraDevices } from 'react-native-vision-camera';
import { Camera } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';
import Reactotron from 'reactotron-react-native';

export default function QRScanner({ navigation }) {
    const [hasPermission, setHasPermission] = React.useState(false);
    const devices = useCameraDevices();
    const device = devices.back;

    const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
        checkInverted: true,
    });

    const onBarcodeDected = (barcode) => {
        Reactotron.log({ barcode });
        if (barcode.displayValue.startsWith("{") && barcode.displayValue.endsWith("}")) {
            navigation && navigation.navigate('CreateOrder', {
                product: JSON.parse(barcode.displayValue),
                quantity: 1
            });
        }
    }

    // Alternatively you can use the underlying function:
    //
    // const frameProcessor = useFrameProcessor((frame) => {
    //   'worklet';
    //   const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE], { checkInverted: true });
    //   runOnJS(setBarcodes)(detectedBarcodes);
    // }, []);

    React.useEffect(() => {
        (async () => {
            const status = await Camera.requestCameraPermission();
            setHasPermission(status === 'authorized');
        })();
    }, []);

    return (
        device != null &&
        hasPermission && (
            <>
                <Camera
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={true}
                    frameProcessor={frameProcessor}
                    frameProcessorFps={5}
                />
                {barcodes.map((barcode, idx) => onBarcodeDected(barcode))}
            </>
        )
    );
}

const styles = StyleSheet.create({
    barcodeTextURL: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },
});