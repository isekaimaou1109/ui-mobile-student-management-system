import * as React from "react";
import { View } from "react-native";
import { Input, Text, Button, Icon, Dialog } from "@rneui/themed";
import { useShallow } from "zustand/react/shallow";
import { router } from "expo-router";
import { z } from "zod";
import Toast from "react-native-toast-message";
import {
  useFonts,
  MontserratAlternates_700Bold,
  Inter_200ExtraLight,
} from "@expo-google-fonts/dev";
// import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { useForm, useGlobal } from "../store";
import { I18nContext } from "../i18n";
import { toastConfig } from "../config";
import { SocketContext } from '../socket'
import { loginFormStyle } from '../styles'

export default function Home() {
  const [fontLoaded] = useFonts([
    MontserratAlternates_700Bold,
    Inter_200ExtraLight,
  ]);
  const socket = React.useContext(SocketContext)
  const i18n = React.useContext(I18nContext);
  const [isHiddenPassword, setPasswordState] = React.useState(true);
  const [isHiddenSalt, setSaltState] = React.useState(true);
  const [formStatus, setFormState] = React.useState({
    status: '',
    isSendingForm: false
  });
  const { login, submit } = useForm(
    useShallow((state) => ({
      login: state.login,
      submit: state.submit
    }))
  );
  const { isOpenedDialog, changeDialogState } = useGlobal(
    useShallow((state) => ({
      isOpenedDialog: state.isOpenedDialog,
      changeDialogState: state.changeDialogState,
    }))
  );

  const fields = [
    {
      name: "email",
      placeholder: i18n.t("fields.email"),
      leftIcon: { type: "font-awesome", name: "envelope" },
      leftIconContainerStyle: { marginRight: 12 },
      rightIcon: login.email
        ? {
            type: "font-awesome",
            name: "times",
            onPress: () => (login.email = ""),
          }
        : {},
      onChangeText: (newValue) => (login.email = newValue),
    },
    {
      name: "password",
      secureTextEntry: isHiddenPassword,
      placeholder: i18n.t("fields.password"),
      leftIcon: { type: "font-awesome", name: "lock" },
      leftIconContainerStyle: { marginRight: 20 },
      rightIcon: {
        type: "font-awesome",
        name: isHiddenPassword ? "eye" : "eye-slash",
        onPress: () => setPasswordState(!isHiddenPassword),
      },
      onChangeText: (newValue) => (login.password = newValue),
    },
    {
      name: "salt",
      secureTextEntry: isHiddenSalt,
      placeholder: i18n.t("fields.salt"),
      leftIcon: { type: "font-awesome", name: "key" },
      leftIconContainerStyle: { marginRight: 20 },
      rightIcon: {
        type: "font-awesome",
        name: isHiddenSalt ? "eye" : "eye-slash",
        onPress: () => setSaltState(!isHiddenSalt),
      },
      onChangeText: (newValue) => (login.salt = newValue),
    },
  ];

  function onFormSubmit() {
    setFormState({
      status: 'sending',
      isSendingForm: true
    });
    const formSchema = z.object({
      email: z.string().email(),
      password: z
        .string()
        .min(12)
        .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{12,}$/),
    });
    const processedForm = formSchema.safeParse(login);
    if (processedForm.success) {
      let beforeSendingForm = setTimeout(() => {
        submit(login.email, login.password, login.salt);
        clearTimeout(beforeSendingForm)
      }, 1000)
    }
  }

  function onAgreeCloseModal() {
    changeDialogState(false);
  }

  React.useEffect(() => {
    socket.on('get_me', onGetProfile)
    function onGetProfile(profile) {
      if (profile) {
        setFormState({
          status: 'sent',
          isSendingForm: false
        });
        router.replace("/dashboard");
      } else {
        setFormState({
          status: 'fail',
          isSendingForm: false
        });
        Toast.show({
          type: "error",
          text1: "Hello",
          text2: "This is some something 👋",
        });
      }
    }

    return () => {
      socket.off('get_me', onConnect);
    }
  }, [])

  return (
    fontLoaded && (
      <View style={{ height: "100%" }}>
        <View style={loginFormStyle.wrapper}>
          <Text h2 h2Style={{ fontFamily: "Inter_200ExtraLight" }}>
            {i18n.t("titles.form")}
          </Text>
          <View style={{ width: "100%", marginVertical: 12 }}>
            {fields.map((field, fieldIndex) => (
              <Input
                key={`field-${field.name}-${fieldIndex}`}
                placeholder={field.placeholder}
                leftIcon={{
                  ...field.leftIcon,
                  ...(formStatus.isSendingForm && { onPress: () => {} }),
                  ...(formStatus.status === 'fail' ? { color: 'red' } : {})
                }}
                disabled={formStatus.isSendingForm}
                leftIconContainerStyle={field.leftIconContainerStyle}
                rightIcon={{
                  ...field.rightIcon,
                  ...(formStatus.isSendingForm && { onPress: () => {} }),
                  ...(formStatus.status === 'fail' ? { color: 'red' } : {})
                }}
                secureTextEntry={field.secureTextEntry}
                keyboardAppearance="light"
                onChangeText={field.onChangeText}
                clearTextOnFocus
              />
            ))}
          </View>

          <Button
            buttonStyle={{ borderRadius: 5 }}
            containerStyle={{ alignSelf: "flex-end" }}
            color="primary"
            loading={formStatus.isSendingForm}
            disabled={formStatus.isSendingForm}
            onPress={onFormSubmit}
            onLongPress={() => changeDialogState(true)}
          >
            <Text style={{ color: "white", fontSize: 16 }}>
              {i18n.t("buttons.submit")}
            </Text>
            <Icon style={{ marginLeft: 6 }} name="save" color="white" />
          </Button>

          <Dialog isVisible={isOpenedDialog}>
            <Dialog.Title
              title={i18n.t("titles.confirm")}
              titleStyle={{
                textAlign: "center",
                fontSize: 24,
                fontWeight: "bold",
              }}
            />
            <Text style={{ fontSize: 16 }}>
              {i18n.t("descriptions.confirm")}
            </Text>
            <Dialog.Actions>
              <Button color="secondary" onPress={onAgreeCloseModal}>
                <Text style={{ color: "white", fontSize: 16 }}>
                  {i18n.t("buttons.agree")}
                </Text>
              </Button>
              <Button
                color="secondary"
                containerStyle={{ marginRight: 10 }}
                onPress={() => changeDialogState(false)}
              >
                <Text style={{ color: "white", fontSize: 16 }}>
                  {i18n.t("buttons.close")}
                </Text>
              </Button>
            </Dialog.Actions>
          </Dialog>
        </View>
        <Toast config={toastConfig} />
      </View>
    )
  );
}
