import * as React from "react";
import {
  CameraView,
  useCameraPermissions,
  Camera,
} from "expo-camera";
import { Text, View, TouchableOpacity, Button, Dimensions } from "react-native";
import { Header, Icon, Tab, TabView } from "@rneui/themed";

import { headerStyle, cameraStyle } from "../../styles";
import { I18nContext } from '../../i18n'
import { SocketContext } from '../../socket'

export default function Dashboard() {
  Camera.requestCameraPermissionsAsync();
  const i18n = React.useContext(I18nContext)
  const [index, setIndex] = React.useState(0);
  const [isScannerOpening, setScannerState] = React.useState(false);
  const [permission, requestPermission] = useCameraPermissions();


  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          {i18n.t('descriptions.camera_permission')}
        </Text>
        <Button onPress={requestPermission} title={i18n.t('buttons.camera_permission')} />
      </View>
    );
  }

  function onHandleQRCode({ type, data }) {
    setScannerState(true);
    if (type === "org.iso.QRCode" && data) {
      setScannerState(false)
    }
  }

  function onSubmit() {
    socket.emit('form_process', {
      email: 'nhat11092000@gmail.com',
      password: 'Nhat11092000!@',
      salt: '$2a$16$C23jC.Z19UOrfXpE0u0Ake'
    })
  }

  return <View>
    <View style={headerStyle.headerContainer}>
      <View style={headerStyle.headerLeft}>
        <TouchableOpacity onPress={onSubmit}>
          <Icon name="description" color="white" />
        </TouchableOpacity>
      </View>

      <View style={headerStyle.headerCenter}>
        <Text style={headerStyle.headerTitle}>Header</Text>
      </View>

      <View style={headerStyle.headerRight}>
        <TouchableOpacity onPress={() => setScannerState(true)}>
          <Icon name="description" color="white" />
        </TouchableOpacity>
      </View>
    </View>


    {isScannerOpening && <View style={{ ...cameraStyle.container }}>
      <Icon name="description" color="white" style={{ position: 'absolute' }} />
      <CameraView
        videoQuality={"1080p"}
        mirror={true}
        style={{ ...cameraStyle.camera, height: Dimensions.get('window').height }}
        facing={'back'}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417", "ean13"],
        }}
        onCameraReady={() => console.log("reaady")}
        onBarcodeScanned={isScannerOpening ? onHandleQRCode : undefined}
      ></CameraView>
    </View>}
  </View>
}
