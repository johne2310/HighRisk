# Patient Medication Audit Survey Application Guidelines

## Project Overview

This project is a survey application for auditing high-risk patients (defined as those taking 5 or more regular medications). The application allows healthcare professionals to collect and store audit data for these patients.

## Technology Stack

- **Frontend Framework**: [Quasar Framework](https://quasar.dev/) (Vue.js-based)
- **Backend/Database**: [Supabase](https://supabase.io/) (Backend as a Service)
- **Theme**: Blue-themed UI

## Project Structure

```
quasar-project/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Application assets (images, etc.)
│   ├── boot/               # Initialization scripts
│   ├── components/         # Reusable Vue components
│   │   ├── EssentialLink.vue
│   │   └── SurveyForm.vue  # Form component for data collection
│   ├── css/                # Global CSS/SCSS files
│   │   ├── app.scss
│   │   └── quasar.variables.scss  # Theme variables
│   ├── layouts/            # Application layouts
│   │   └── MainLayout.vue  # Main application layout
│   ├── pages/              # Application pages
│   │   ├── IndexPage.vue   # Landing page
│   │   ├── SurveyPage.vue  # Survey data collection page
│   │   └── ErrorNotFound.vue
│   ├── router/             # Vue Router configuration
│   │   ├── index.js
│   │   └── routes.js
│   ├── stores/             # Pinia stores for state management
│   │   └── survey-store.js # Store for survey data
│   ├── supabase/           # Supabase configuration
│   │   └── index.js
│   └── App.vue             # Root component
├── .eslintrc.js            # ESLint configuration
├── package.json            # Project dependencies
└── quasar.config.js        # Quasar configuration
```

## Implementation Details

### Data Model

The survey form will collect the following data:

- Date of audit (default: today)
- Name of person collecting data (entered once per audit day)
- Patient ID
- Bed number
- Ward
- Hospital
- High-risk status (Yes/No radio button for 5+ medications)

### Supabase Integration

- Supabase will be used for data storage and authentication
- A table will be created to store the survey data
- Authentication will be implemented to ensure only authorized users can submit data

### Theme Implementation

- The application will use a blue theme, customized in the `quasar.variables.scss` file
- Primary color will be set to a blue shade
- Secondary and accent colors will be complementary to the primary blue

## Development Guidelines

1. Follow Vue.js best practices and Composition API patterns
2. Use Quasar components for UI elements
3. Implement form validation for all input fields
4. Ensure responsive design for use on various devices
5. Add appropriate error handling for API calls
6. Document code with clear comments

## Testing

- Test the application on different devices and screen sizes
- Verify that all form fields work correctly
- Ensure data is properly saved to Supabase
- Test the authentication flow

## Deployment

- Build the application using `yarn build` or `npm run build`
- Deploy the built files to a web server or hosting service
- Configure Supabase for production use
