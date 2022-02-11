# OneBlink Forms App Template

This template can be used to extend the functionality of the out-of-the-box OneBlink Forms App, allowing you to leverage the existing Forms Rendering capabilities, including but not limited to retrieving a forms list, rendering a form with all the functionality the OOTB Forms App provides, as well as drafts, pending submissions and authenticated users.

This logic is provided via our own SDKs, of which our OOTB Forms App uses in an almost identical way to this template. There are two key packages in use, both provided via NPM, with their source code being easily accessible on GitHub:

* [OneBlink Apps SDK](https://github.com/oneblink/apps)
* [OneBlink Apps-React SDK](https://github.com/oneblink/apps-react)

It's recommended to familarise yourself with these SDKs, as they are used heavily throughout this template to provide access to a large range of functionality.

While it's entirely possible that you could start from scratch with your own project using the above two packages, the aim of this template is to provide a solid starting point by providing the same functionality used by a standard Forms App, allowing you to jump straight into developing and extending the existing functionality with your own features.

This template is provided using React with TypeScript, with type definitions being available from both the SDK packages, as well as a dedicated Types repository:

* [Types - GitHub](https://github.com/oneblink/types)

## Getting Started

### What you'll need

* A OneBlink Forms App, pre-configured in the LcS
  - The Forms App ID for this Forms App
  - The OAuth client ID for this Forms App
* Basic understanding of how Forms App configuration works
  - Adding Forms to a Forms App
  - Adding Users to a Forms App

The variables added above will need to be configured in an `.env.local` file:
```
REACT_APP_OB_COGNITO_CLIENT_ID=abcde12345
REACT_APP_OB_FORMS_APP_ID=12345
# REACT_APP_LOCAL_SERVICEWORKER=true
```

To start the project locally:
```
npm i && npm start
```

## Key Components

### `./src/Scenes/Login`

This is a basic component to allow users to login. This will function identically to the OOTB Forms App, where the user will be directed to either a hosted login page, or your OAuth provider login, depending on how you have this configured for the Forms App in the LcS. 

### `./src/scenes/FormsList`

Another basic component, used to render a list of forms retrieved via the `FormDefinitionProvider`.

### `./src/Scenes/Drafts`

Used to render a list of drafts for a logged in user, as well as providing functionality to resume or delete a draft.

### `./src/Scenes/Pending`

Used to render a list of pending submissions via the pending queue. Submissions are generally added to the pending queue when the device is offline, with submission beginning automatically upon regaining internet connectivity.

### `./src/Scenes/Form`

The Forms component, as the name suggests, allows a OneBlink form definition to be rendered. A basic Form Container is provided to allow the rendering of either a OneBlink Default Form, or a Controlled Form. The implementation provided uses Form IDs to achieve this, however this can obviously be customised to your own needs. It's recommended to familarise yourself with the differences between the Default Form and the Controlled Form. While the Default Form will be fine in the majority of cases, the Controlled Form will allow access to modify the Form Definition and Submission model programmatically on the fly. For more information, please see [https://github.com/oneblink/apps-react/blob/master/docs/OneBlinkFormControlled.md](https://github.com/oneblink/apps-react/blob/master/docs/OneBlinkFormControlled.md).

## Testing service workers

The service worker file must be a javascript file, therefore the project needs to be built:

- uncomment `REACT_APP_LOCAL_SERVICEWORKER=true` in `.env.local`
- build the project (`npm run build`)
- `serve -s ./build -l 3000`
