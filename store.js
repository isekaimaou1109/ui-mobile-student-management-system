import { create } from "zustand";
import { produce } from "immer";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { i18n } from "./i18n";

export const useForm = create(
  persist(
    (set) => ({
      login: {
        email: "",
        password: "",
        salt: "",
      },
      submit: (email, password, salt) =>
        set((state) =>
          produce(state.login, (draftState) => {
            draftState.email = email;
            draftState.password = password;
            draftState.salt = salt;
          })
        ),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ login: state.login }),
    }
  )
);

export const useProfile = create(
  persist(
    (set) => ({
      profile: {
        id: "",
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        address: "",
        avatar_url: "",
        password: "",
        salt: "",
        tax_id: "",
        citizen_identification_number: "",
        created_at: null,
        updated_at: null,
        salary: "",
        position: "",
      },
      saveProfile: (profile) =>
        set((state) => {
          return produce(state.profile, (draftState) => {
            draftState.id = profile.id;
            draftState.first_name = profile.first_name;
            draftState.last_name = profile.last_name;
            draftState.phone = profile.phone;
            draftState.email = profile.email;
            draftState.address = profile.address;
            draftState.avatar_url = profile.avatar_url;
            draftState.password = profile.password;
            draftState.salt = profile.salt;
            draftState.tax_id = profile.tax_id;
            draftState.citizen_identification_number =
              profile.citizen_identification_number;
            draftState.created_at = profile.created_at;
            draftState.updated_at = profile.updated_at;
            draftState.salary = profile.salary;
            draftState.position = profile.position;
          });
        }),
    }),
    {
      name: "profile",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ login: state.login }),
    }
  )
);

export const useGlobal = create(
  persist(
    (set) => ({
      isOpenedDialog: false,
      language: "vn",
      loginType: "employee",
      changeDialogState: (newState) =>
        set((state) =>
          produce(state, (draftState) => {
            draftState.isOpenedDialog = newState;
          })
        ),
      changeLanguage: (newLanguage) =>
        set((state) =>
          produce(state, (draftState) => {
            draftState.language = newLanguage;
            i18n.locale = newLanguage;
          })
        ),
      changeLoginType: (newLoginType) =>
        set((state) =>
          produce(state, (draftState) => {
            draftState.loginType = newLoginType;
          })
        ),
    }),
    {
      name: "global",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        language: state.language,
        loginType: state.loginType,
      }),
    }
  )
);
