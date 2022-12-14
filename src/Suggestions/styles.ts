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

const valueStyles = {
  fontSize: '12px',
  opacity: '0.5',
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
  overflow: 'hidden',
}

const buttonWrapperStyles = {
  display: 'flex',
  justifyContent: 'center',
}

const containerStyles = {
  gap: '15px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
} as CSSProperties

export {
  viewStyles,
  borrowButtonStyles,
  maxButtonStyles,
  imageStyles,
  valueStyles,
  containerStyles,
  nftListStyles,
  buttonWrapperStyles,
}
