import * as React from 'react'
import { I18n } from 'i18n-js';

export const i18n = new I18n({
  en: { 
    titles: {
      form: 'Form',
      confirm: 'Confirm',
      login_by: 'Login by %{field}'
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
    }, 
    languages: {
      vi: 'Vietnamese',
      en: 'English',
      de: 'German'
    }
  },
  de: {
    titles: {
      form: 'Formular',
      confirm: 'Bestätigen',
      login_by: 'Login auf %{field}'
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
    }, 
    languages: {
      vi: 'Vietnamesisch',
      en: 'Englisch',
      de: 'Deutsch'
    }
  },
  vi: {
    titles: {
      form: 'Biểu Mẫu',
      confirm: 'Xác Nhận',
      login_by: 'Trường %{field}'
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
    }, 
    languages: {
      vi: 'Tiếng Việt',
      en: 'Tiếng Anh',
      de: 'Tiếng Đức'
    }
  }
});
i18n.locale = 'vi';

export const I18nContext = React.createContext(i18n)