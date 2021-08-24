const config = {
  OB_COGNITO_CLIENT_ID: process.env.REACT_APP_OB_COGNITO_CLIENT_ID || '',
  OB_FORMS_APP_ID: parseInt(process.env.REACT_APP_OB_FORMS_APP_ID || ''),

  OB_HOSTED_API_URL: process.env.REACT_APP_OB_HOSTED_API_URL || '',

  GOOGLE_MAP_API_KEY: process.env.REACT_APP_GOOGLE_MAP_API_KEY || '',
  RECAPTCHA_SITE_KEY: process.env.REACT_APP_RECAPTCHA_SITE_KEY || '',
}

export default config
