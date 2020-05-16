import { createMuiTheme } from '@material-ui/core';
import { PaletteOptions } from '@material-ui/core/styles/createPalette';

const colors = {
  primary: '#af8245',
};

const palette: PaletteOptions = {
  type: 'dark',
  primary: {
    main: colors.primary,
  },
  secondary: {
    main: '#0f0',
  },
  common: {
    white: '#feffff',
    black: '#060409',
  },
  grey: {
    // '50': adjustHue(75, '#040809'),
    // '900': adjustHue(75, '#ebebeb'),
  },
  text: {
    primary: '#aeaeae',
    secondary: '#feffff',
  },
  background: {
    default: '#0d0a0e',
    paper: '#131215',
  },
};

export default createMuiTheme({
  palette,
  shape: {
    borderRadius: 0,
  },
  typography: {
    allVariants: {
      fontFamily: "'Amatic SC', sans-serif",
    },
    body1: {
      fontFamily: "'Lato', sans-serif",
    },
    body2: {
      fontFamily: "'Lato', sans-serif",
    },
    h1: {
      color: palette.common?.white,
      fontSize: 50,
      fontWeight: 700,
      textTransform: 'uppercase',
    },
    h2: {
      color: palette.common?.white,
      fontSize: 50,
      fontWeight: 700,
      textTransform: 'uppercase',
    },
    h3: {
      color: palette.common?.white,
      fontSize: 34,
      fontWeight: 700,
      textTransform: 'uppercase',
    },
    h4: {
      color: palette.common?.white,
      fontSize: 24,
      fontWeight: 700,
      textTransform: 'uppercase',
    },
    h5: {
      color: palette.common?.white,
      fontSize: 20,
      fontWeight: 700,
      textTransform: 'uppercase',
    },
    button: {
      fontSize: 18,
      fontWeight: 700,
      lineHeight: 26 / 18,
      textShadow: '0 0 0.01px',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1220,
      xl: 1920,
    },
  },
  overrides: {
    MuiAppBar: {
      colorDefault: {
        backgroundColor: palette.common?.black,
      },
    },
    MuiButton: {
      root: {
        padding: '14px 20px',
      },
      outlined: {
        border: '2px solid #5e5e5e',
        padding: '12px 18px',
      },
      outlinedPrimary: {
        '&, &:hover': {
          borderWidth: 2,
        },
      },
    },
    MuiFormGroup: {
      root: {
        marginBottom: 16,
      },
    },
    MuiFormHelperText: {
      root: {
        fontFamily: "'Lato', sans-serif",
      },
    },
    MuiIcon: {
      root: {
        fontSize: 20,
      },
    },
    MuiLink: {
      root: {
        color: palette.common?.white,
      },
    },
    MuiOutlinedInput: {
      root: {
        '&:hover $notchedOutline': {
          borderWidth: 2,
        },
      },
      input: {
        '&:-webkit-autofill': {
          WebkitBoxShadow: `0 0 0 100px ${palette.background?.paper} inset`,
          caretColor: palette.text?.primary,
        },
      },
    },
    MuiStepConnector: {
      alternativeLabel: {
        top: 16,
      },
    },
    MuiStepIcon: {
      root: {
        borderRadius: 32,
        boxShadow: `inset 0 0 0 2px ${palette.common?.white}`,
        color: 'transparent',
        fontSize: 32,

        '&$active, &$completed': {
          boxShadow: `inset 0 0 0 2px ${colors.primary}`,
        },
      },
    },
    MuiStepLabel: {
      label: {
        '&$active, &$completed': {
          color: palette.common?.white,
          fontWeight: 700,
        },
      },
    },
    MuiSvgIcon: {
      root: {
        fontSize: 20,
      },
    },
  },
  props: {
    MuiAppBar: {
      elevation: 0,
    },
    MuiButton: {
      disableElevation: true,
      variant: 'outlined',
    },
    MuiCheckbox: {
      color: 'primary',
    },
    MuiPaper: {
      elevation: 0,
    },
    MuiRadio: {
      color: 'primary',
    },
    MuiTextField: {
      variant: 'outlined',
      InputLabelProps: {
        shrink: true,
      },
    },
  },
});
