import { BaseToast, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'pink' }}
      contentContainerStyle={{ paddingVertical: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400'
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      contentContainerStyle={{ paddingVertical: 15 }}
      text1Style={{
        fontSize: 24,
        color: 'red',
        fontWeight: 'bold'
      }}
      text2Style={{
        fontSize: 16
      }}
    />
  ),
}