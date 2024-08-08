import { StyleSheet } from "react-native";

export const globalStyle = StyleSheet.create({
  flex_center: {
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  flex_end: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  }
})

export const headerStyle = StyleSheet.create({
  headerContainer: {
    height: 64, 
    backgroundColor: "#397af8",
    display: 'flex',
    flexDirection: 'row'
  },
  headerCenter: {
    ...globalStyle.flex_center,
    flexGrow: 1
  },
  headerRight: { 
    ...globalStyle.flex_center, 
    flexDirection: 'row', 
    padding: 12, 
    columnGap: 10 
  },
  headerLeft: { 
    ...globalStyle.flex_center,
    padding: 12
  },
  headerTitle: { 
    fontSize: 24, 
    color: 'white', 
    fontWeight: 'bold' 
  }
})

export const cameraStyle = StyleSheet.create({
  container: {
    ...globalStyle.flex_center,
    flex: 1,
    position: 'absolute',
    width: '100%'
  },
  camera: {
    flex: 1,
  },
});

export const loginFormStyle = StyleSheet.create({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  title: {
    fontWeight: "bold",
  },
});

export const utilStyle = StyleSheet.create({
  container: {
    ...globalStyle.flex_end,
    flexDirection: 'row',
    marginTop: 24,
    marginRight: 24
  },
});