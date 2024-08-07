import * as React from "react";
import { create } from 'zustand'
import { produce } from "immer"
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useForm = create(
  persist(
    (set) => ({
      login: {
        email: '',
        password: '',
        salt: ''
      },
      submit: (email, password, salt) => set((state) => {
        const socket = React.useContext(I18nContext);
        socket.emit('form_process', { email, password, salt })
        return produce(state.login, (draftState) => {
          draftState.email = email
          draftState.password = password
        })
      })
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ login: state.login })
    },
  ),
)

export const useGlobal = create((set) => ({
  isOpenedDialog: false,
  changeDialogState: (newState) => set((state) => 
    produce(state, (draftState) => {
      draftState.isOpenedDialog = newState
    })
  )
}))