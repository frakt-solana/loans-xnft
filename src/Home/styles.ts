import { CSSProperties } from 'React'

const viewStyles = {
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '60px',
  gap: '15px',
} as CSSProperties

const valueInfoStyles = {
  display: 'flex',
  justifyContent: 'space-between',
} as CSSProperties

const maxButtonStyles = {
  background: 'transparent',
  position: 'absolute',
  right: 0,
  top: '5px',
  bottom: '5px',
} as CSSProperties

const borrowButtonStyles = {
  styles(isBorrowBtnDisabled: boolean) {
    return {
      opacity: isBorrowBtnDisabled ? '0.5' : '1',
      backgroundColor: '#9cff1f',
      color: 'black',
    } as CSSProperties
  },
}

const loadingStyles = {
  position: 'absolute',
  top: '40%',
  left: '45%',
  transform: 'translate(-50%, -50%)',
} as CSSProperties

export {
  viewStyles,
  maxButtonStyles,
  borrowButtonStyles,
  valueInfoStyles,
  loadingStyles,
}
