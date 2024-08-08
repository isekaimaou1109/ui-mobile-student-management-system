import * as React from "react";
import { View } from "react-native";
import { Input, Text, Button, Icon, Dialog } from "@rneui/themed";
import { useShallow } from "zustand/react/shallow";
import { router } from "expo-router";
import { z } from "zod";
import Toast from "react-native-toast-message";
import CountryFlag from "react-native-country-flag";
import { ListItem } from "@rneui/themed";
import {
  useFonts,
  MontserratAlternates_700Bold,
  Inter_200ExtraLight,
} from "@expo-google-fonts/dev";
// import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { useForm, useGlobal, useProfile } from "../store";
import { I18nContext } from "../i18n";
import { toastConfig } from "../config";
import { SocketContext } from "../socket";
import { loginFormStyle, utilStyle } from "../styles";
import Selector from "../components/Selector";

const SUPPORTED_LANGUAGES = ["de", "vi", "en"];
const SUPPORTED_LOGIN_TYPE = ["employee", "student"];

export default function HomeScreen() {
  const [fontLoaded] = useFonts([
    MontserratAlternates_700Bold,
    Inter_200ExtraLight,
  ]);
  const socket = React.useContext(SocketContext);
  const i18n = React.useContext(I18nContext);
  const [isHiddenPassword, setPasswordState] = React.useState(true);
  const [isHiddenSalt, setSaltState] = React.useState(true);
  const [formStatus, setFormState] = React.useState({
    status: "",
    isSendingForm: false,
  });
  const { login, submit } = useForm(
    useShallow((state) => ({
      login: state.login,
      submit: state.submit,
    }))
  );
  const { saveProfile } = useProfile(
    useShallow((state) => ({
      saveProfile: state.saveProfile,
    }))
  );
  const {
    isOpenedDialog,
    changeDialogState,
    changeLanguage,
    language,
    loginType,
    changeLoginType,
  } = useGlobal(
    useShallow((state) => ({
      isOpenedDialog: state.isOpenedDialog,
      changeDialogState: state.changeDialogState,
      changeLanguage: state.changeLanguage,
      language: state.language,
      loginType: state.loginType,
      changeLoginType: state.changeLoginType,
    }))
  );

  const fields = [
    {
      name: "email",
      placeholder: "fields.email",
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
      placeholder: "fields.password",
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
      placeholder: "fields.salt",
      leftIcon: { type: "font-awesome", name: "key" },
      leftIconContainerStyle: { marginRight: 12 },
      rightIcon: {
        type: "font-awesome",
        name: isHiddenSalt ? "eye" : "eye-slash",
        onPress: () => setSaltState(!isHiddenSalt),
      },
      onChangeText: (newValue) => (login.salt = newValue),
    },
  ];

  const selectors = [
    {
      keyPrefix: "login-type",
      items: SUPPORTED_LOGIN_TYPE,
      TitleComponent: () => (
        <React.Fragment>
          <Icon type="font-awesome" name="user" size={28} />
          <Text style={{ marginLeft: 12 }}>
            {i18n.t('titles.login_by', { field: loginType })}
          </Text>
        </React.Fragment>
      ),
      onPress: (newLoginType) => {
        changeLoginType(newLoginType);
      },
      ListItemChild: ({ data }) => (
        <ListItem.Content>
          <ListItem.Title>
            <Text>{data}</Text>
          </ListItem.Title>
        </ListItem.Content>
      ),
    },
    {
      keyPrefix: "language",
      items: SUPPORTED_LANGUAGES,
      TitleComponent: () => (
        <React.Fragment>
          <CountryFlag
            isoCode={
              language === "vi" ? "vn" : language === "en" ? "gb" : language
            }
            size={28}
            color="primary"
          />
          <ListItem.Content style={{ marginLeft: 8 }}>
            <ListItem.Title>{i18n.t(`languages.${language}`)}</ListItem.Title>
          </ListItem.Content>
        </React.Fragment>
      ),
      onPress: (newLanguage) => {
        changeLanguage(newLanguage);
      },
      ListItemChild: ({ data }) => (
        <ListItem.Content>
          <ListItem.Title>{i18n.t(`languages.${data}`)}</ListItem.Title>
        </ListItem.Content>
      ),
    },
  ];

  function onFormSubmit() {
    setFormState({
      status: "sending",
      isSendingForm: true,
    });
    const formSchema = z.object({
      email: z.string().email(),
      password: z
        .string()
        .min(12)
        .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{12,}$/),
      salt: z.string(),
    });
    const processedForm = formSchema.safeParse(login);
    if (processedForm.success) {
      let beforeSendingForm = setTimeout(() => {
        socket.emit("form_process", {
          email: processedForm.data.email,
          password: processedForm.data.password,
          salt: processedForm.data.salt,
        });
        submit(login.email, login.password, login.salt);
        clearTimeout(beforeSendingForm);
      }, 1000);
    }
  }

  function onAgreeCloseModal() {
    changeDialogState(false);
  }

  React.useEffect(() => {
    socket.on("get_me", onGetProfile);
    function onGetProfile(profile) {
      console.log('profile:', profile)
      if (profile) {
        saveProfile(profile);
        setFormState({
          status: "sent",
          isSendingForm: false,
        });
        router.replace("/dashboard/(tabs)/index");
      } else {
        setFormState({
          status: "fail",
          isSendingForm: false,
        });
        Toast.show({
          type: "error",
          text1: "Hello",
          text2: "This is some something 👋",
        });
      }
    }

    return () => {
      socket.off("get_me", onGetProfile);
    };
  }, []);

  return (
    fontLoaded && (
      <View style={{ height: "100%" }}>
        <View style={utilStyle.container}>
          <View>
            {selectors.map((selector, selectorIndex) => (
              <Selector
                key={`selector-${selectorIndex}`}
                keyPrefix={selector.keyPrefix}
                onPress={selector.onPress}
                TitleComponent={selector.TitleComponent}
                ListItemChild={selector.ListItemChild}
                items={selector.items}
              />
            ))}
          </View>
        </View>

        <View style={loginFormStyle.wrapper}>
          <Text h2 h2Style={{ fontFamily: "Inter_200ExtraLight" }}>
            {i18n.t("titles.form")}
          </Text>
          <View style={{ width: "100%", marginVertical: 12 }}>
            {fields.map((field, fieldIndex) => (
              <Input
                key={`field-${field.name}-${fieldIndex}`}
                placeholder={i18n.t(field.placeholder)}
                leftIcon={{
                  ...field.leftIcon,
                  ...(formStatus.isSendingForm && { onPress: () => {} }),
                  ...(formStatus.status === "fail" ? { color: "red" } : {}),
                }}
                disabled={formStatus.isSendingForm}
                leftIconContainerStyle={field.leftIconContainerStyle}
                rightIcon={{
                  ...field.rightIcon,
                  ...(formStatus.isSendingForm && { onPress: () => {} }),
                  ...(formStatus.status === "fail" ? { color: "red" } : {}),
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
