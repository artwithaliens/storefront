import { createMuiTheme } from '@material-ui/core';

const palette = {
  mode: 'dark' as const,
  primary: {
    main: '#af8245',
  },
  secondary: {
    main: '#aeaeae',
  },
  common: {
    white: '#feffff',
    black: '#060409',
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
    fontWeightLight: 400,
    fontWeightMedium: 700,
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
      color: palette.common.white,
      fontSize: 50,
      fontWeight: 700,
      textTransform: 'uppercase',
    },
    h2: {
      color: palette.common.white,
      fontSize: 50,
      fontWeight: 700,
      textTransform: 'uppercase',
    },
    h3: {
      color: palette.common.white,
      fontSize: 34,
      fontWeight: 700,
      textTransform: 'uppercase',
    },
    h4: {
      color: palette.common.white,
      fontSize: 24,
      fontWeight: 700,
      textTransform: 'uppercase',
    },
    h5: {
      color: palette.common.white,
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
  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        colorDefault: {
          backgroundColor: palette.common.black,
        },
      },
    },
    MuiBadge: {
      defaultProps: {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
        color: 'primary',
      },
      styleOverrides: {
        badge: {
          borderRadius: 16,
          fontSize: 12,
          fontWeight: 700,
          height: 16,
          minWidth: 16,
          padding: 2,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          padding: '14px 20px',
        },
        outlined: {
          borderWidth: 2,
          padding: '12px 18px',

          '&$disabled': {
            borderWidth: 2,
          },
        },
        outlinedPrimary: {
          '&, &:hover': {
            borderWidth: 2,
          },

          '&$disabled': {
            borderWidth: 2,
          },
        },
        outlinedSecondary: {
          '&, &:hover': {
            borderWidth: 2,
          },

          '&$disabled': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCheckbox: {
      defaultProps: {
        color: 'primary',
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '0 48px 48px',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: palette.common.white,
          padding: '48px 48px 0',
          textAlign: 'right',
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        marginNormal: {
          marginBottom: 8,
          marginTop: 8,
        },
      },
    },
    MuiFormGroup: {
      styleOverrides: {
        root: {
          marginBottom: 16,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontFamily: "'Lato', sans-serif",
        },
      },
    },
    MuiIcon: {
      styleOverrides: {
        root: {
          fontSize: 20,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: palette.common.white,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover $notchedOutline': {
            borderWidth: 2,
          },
        },
        input: {
          padding: '16.5px 14px !important',

          '&:-webkit-autofill': {
            WebkitBoxShadow: `0 0 0 100px ${palette.background.paper} inset !important`,
            caretColor: palette.text.primary,
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
    },
    MuiRadio: {
      defaultProps: {
        color: 'primary',
      },
    },
    MuiStepConnector: {
      styleOverrides: {
        alternativeLabel: {
          top: 16,
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          borderRadius: 32,
          boxShadow: `inset 0 0 0 2px ${palette.common.white}`,
          color: 'transparent',
          fontSize: 32,

          '&$active, &$completed': {
            boxShadow: `inset 0 0 0 2px ${palette.primary.main}`,
          },
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          '&$active, &$completed': {
            color: palette.common.white,
            fontWeight: 700,
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: 20,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        margin: 'normal',
        variant: 'outlined',
        InputLabelProps: {
          shrink: true,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        gutterBottom: {
          marginBottom: 16,
        },
      },
    },
  },
});
