import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  Text,
} from 'react-native'

type Props = {
  onPress: any
  imageUrl: string
  style?: StyleProp<ViewStyle>
  fee: any
  loanValue: any
  duration: any
}
export function NFTtoBorrow({
  onPress,
  style,
  imageUrl,
  loanValue,
  duration,
  fee,
}: Props) {
  const loan = (loanValue / LAMPORTS_PER_SOL).toFixed(1)

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <img src={imageUrl} />
      <View style={[styles.button, style]}>
        <Text style={[styles.buttonText, style]}>Get {loan} ◎</Text>
      </View>
      <View style={[styles.info, style]}>
        <Text style={[styles.durationText, style]}>{duration} days</Text>
        <Text style={[styles.feeText, style]}>Fee: {fee?.toFixed(2)} ◎</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    maxWidth: '50%',
  },
  button: {
    display: 'flex',
    backgroundColor: '#a4ff31',
    paddingTop: '10px',
    paddingBottom: '10px',
  },
  buttonText: {
    width: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 14,
    fontWeight: 600,
  },
  info: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    position: 'absolute',
    width: 'calc(100% - 24px)',

    backgroundColor: '#19191c',
  },
  feeText: {
    color: 'white',
  },
  durationText: {
    color: 'white',
  },
})
