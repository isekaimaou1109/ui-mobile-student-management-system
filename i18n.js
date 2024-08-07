import * as React from 'react'
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

const deviceLanguage = getLocales()[0].languageCode;
const i18n = new I18n({
  en: { 
    titles: {
      form: 'Form',
      confirm: 'Confirm'
    },
    fields: {
      email: 'Email',
      password: 'Password',
      salt: 'Salt'
    },
    buttons: {
      submit: 'Submit',
      agree: 'Agree',
      close: 'Close',
      camera_permission: 'Grant Camera Permission'
    },
    descriptions: {
      confirm: 'Are you sure? You wanna login, alright?',
      camera_permission: 'We need your permission to show the camera'
    }
  },
  de: {
    titles: {
      form: 'Formular',
      confirm: 'Bestätigen'
    },
    fields: {
      email: 'E-Mail',
      password: 'Passwort',
      salt: 'Code'
    },
    buttons: {
      submit: 'Verbinden',
      agree: 'Einverstanden',
      close: 'Schließen',
      camera_permission: 'Erlaubnis von Kamera'
    },
    descriptions: {
      confirm: 'Bist du sicher, dass du ein Login machen möchtest?',
      camera_permission: 'Wir brauchen Ihre Erlaubnis von Öffnung von Kamera'
    }
  },
  vi: {
    titles: {
      form: 'Biểu Mẫu',
      confirm: 'Xác Nhận'
    },
    fields: {
      email: 'Email',
      password: 'Mật Khẩu',
      salt: 'Mã'
    },
    buttons: {
      submit: 'Đăng Nhập',
      agree: 'Đồng Ý',
      close: 'Đóng',
      camera_permission: 'Mở Camera'
    },
    descriptions: {
      confirm: 'Bạn có chắc là muốn đăng nhập không?',
      camera_permission: 'Chúng tôi cần bạn mở cho phép camera'
    }
  }
});
i18n.locale = 'de';

export const I18nContext = React.createContext(i18n)