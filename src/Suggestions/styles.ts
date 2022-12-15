import { CSSProperties } from 'React'

const viewStyles = {
  styles(color: string) {
    return {
      width: '80%',
      border: `1px solid ${color}`,
      gap: '10px',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '0.75rem',
      padding: '10px',
      position: 'relative',
    } as CSSProperties
  },
}

const maxButtonStyles = {
  background: 'transparent',
  position: 'absolute',
  right: 0,
  top: '5px',
  bottom: '5px',
} as CSSProperties

const valueInfoStyles = {
  display: 'flex',
  justifyContent: 'flex-end',
} as CSSProperties

const valueStyles = {
  fontSize: '12px',
  opacity: '0.5',
  marginBottom: '5px',
} as CSSProperties

const imageStyles = {
  width: '50px',
  height: '50px',
} as CSSProperties

const borrowButtonStyles = {
  styles(color: string) {
    return {
      backgroundColor: color,
      color: 'black',
      width: '100%',
    } as CSSProperties
  },
}

const nftListStyles = {
  display: 'flex',
  gap: '10px',
  overflow: 'auto',
}

const buttonWrapperStyles = {
  display: 'flex',
  justifyContent: 'center',
}

const loansStatusStyles = {
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '60px',
  textAlign: 'center',
  gap: '15px',
  padding: '0 15px'
} as CSSProperties

const containerStyles = {
  gap: '25px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: '20px',
} as CSSProperties

const badgeStyles = {
  styles(color: string) {
    return {
      backgroundColor: color,
      color: '#000',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px solid transparent',
      position: 'absolute',
      top: '-16px',
      left: '16px',
      height: '30px',
      padding: '8px',
      maxWidth: '90px',
      zIndex: '6',
      borderRadius: '10px',
    } as CSSProperties
  },
}

export {
  viewStyles,
  borrowButtonStyles,
  maxButtonStyles,
  imageStyles,
  valueStyles,
  containerStyles,
  nftListStyles,
  buttonWrapperStyles,
  badgeStyles,
  valueInfoStyles,
  loansStatusStyles,
}
