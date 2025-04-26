# Patient Medication Audit Survey

A Quasar application for collecting and managing audit data for high-risk patients (defined as those taking 5 or more regular medications).

## Features

- Blue-themed UI built with Quasar Framework
- Data storage with Supabase
- Dashboard with key statistics
- Form for collecting patient medication audit data
- List view of all audits with edit and delete functionality
- High-risk patients view
- Reporting functionality
- Settings management
- Help and support resources

## Installation

```bash
# Install dependencies
yarn
# or
npm install

# Start the development server
quasar dev
```

## Configuration

Before running the application, you need to configure Supabase:

1. Create a Supabase account at [supabase.io](https://supabase.io)
2. Create a new project
3. Create a `patient_audits` table with the following columns:
   - id (uuid, primary key)
   - auditDate (date)
   - collectorName (text)
   - patientId (text)
   - bedNumber (text)
   - ward (text)
   - hospital (text)
   - isHighRisk (boolean)
4. Update the Supabase configuration in `src/supabase/index.js` with your project URL and anon key:
   - Go to your Supabase project dashboard
   - Click on "Settings" in the left sidebar
   - Click on "API" in the submenu
   - Copy the "Project URL" and replace `YOUR_SUPABASE_URL` in the file
   - Copy the "anon/public" key and replace `YOUR_SUPABASE_ANON_KEY` in the file

**Note:** If you're seeing "Application is running but is not connecting with supabase", it means you need to complete the steps above to connect your application to your Supabase project.

## Usage

### Collecting Audit Data

1. Navigate to the "New Survey" page
2. Fill in all required fields:
   - Date of audit (defaults to today)
   - Data collector name (entered once per audit day)
   - Patient ID
   - Bed number
   - Ward
   - Hospital
   - High-risk status (Yes/No for 5+ medications)
3. Submit the form

### Viewing Audit Data

1. Navigate to the "View Surveys" page to see all audits
2. Use the table controls to sort and filter the data
3. Click the edit or delete buttons to modify or remove audits

### High-Risk Patients

1. Navigate to the "High Risk Patients" page to see patients on 5+ medications
2. View the summary statistics at the bottom of the page

### Generating Reports

1. Navigate to the "Reports" page
2. Select the report type, date range, and other filters
3. Click "Generate Report"
4. Export the report in your preferred format (PDF, CSV)

## Development

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

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
│   │   ├── IndexPage.vue   # Dashboard
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

## Technologies Used

- [Vue.js 3](https://vuejs.org/) - Progressive JavaScript framework
- [Quasar Framework](https://quasar.dev/) - Vue.js based framework
- [Supabase](https://supabase.io/) - Open source Firebase alternative
- [Pinia](https://pinia.vuejs.org/) - State management
- [Vue Router](https://router.vuejs.org/) - Official router for Vue.js
