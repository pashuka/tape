export const schema = {
  signin: {
    email: {
      label: 'Username or email address',
      type: 'email',
      valid: v => v.length > 2,
      attributes: {
        autoComplete: 'username',
      },
    },
    password: {
      label: 'Password',
      type: 'password',
      valid: v => v.length > 3,
      attributes: {
        autoComplete: 'current-password',
      },
    },
  },
  forgot: {
    email: {
      label: 'Email',
      required: true,
      type: 'email',
      valid: v => v.length > 2 && /\S+@\S+\.\S+/.test(v),
      attributes: {
        autoComplete: 'username',
      },
    },
  },
  signup: {
    username: {
      label: 'Username',
      required: true,
      type: 'text',
      valid: v => v.length > 2,
      attributes: {
        autoComplete: 'off',
      },
    },
    email: {
      label: 'Email',
      required: true,
      type: 'email',
      valid: v => v.length > 2 && /\S+@\S+\.\S+/.test(v),
      attributes: {
        autoComplete: 'off',
      },
      helper:
        'We’ll never give out your email address or any of the information you submit on this site to anyone else.',
    },
    password: {
      label: 'Password',
      required: true,
      type: 'password',
      valid: v => v.length > 3,
      attributes: {
        autoComplete: 'new-password',
      },
      helper:
        "Make sure it's at least 15 characters OR at least 8 characters including a number and a lowercase letter.",
    },
  },
  reset: {
    password1: {
      label: 'New password',
      type: 'password',
      attributes: {
        autoComplete: 'new-password',
      },
      valid: v => v.length > 3,
    },
    password2: {
      label: 'Confirm new password',
      type: 'password',
      attributes: {
        autoComplete: 'new-password',
      },
      valid: (v, { password1 }) => v && password1 === v,
    },
  },
};
