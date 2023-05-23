import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#19191c',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
  },
  button: {
    position: 'absolute',
    right: 10,
    top: 30,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    color: '#fff',
    backgroundColor: '#27262a',
    borderRadius: 7,
    height: 45,
    marginTop: 16,
    marginBottom: 16,
    padding: 20,
    width: '100%',
    outlineStyle: 'none',
  } as any,
  borrowButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,

    height: 40,
    width: 100,
    backgroundColor: '#9cff1f',
  },
  borrowButtonDisabled: {
    opacity: 0.7,
  } as any,
  loader: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10,
  },
  textDark: {
    color: '#000',
  },
})
