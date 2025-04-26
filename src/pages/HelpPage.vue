<template>
  <q-page padding>
    <div class="text-h4 text-primary q-mb-md">Help & Support</div>

    <div class="row q-col-gutter-md">
      <!-- Quick Help -->
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Quick Help</div>

            <q-list bordered separator>
              <q-expansion-item
                group="help"
                icon="help_outline"
                label="What is a high-risk patient?"
                header-class="text-primary"
                default-opened
              >
                <q-card>
                  <q-card-section>
                    A high-risk patient is defined as someone who is taking 5 or more regular
                    medications. These patients require special attention and monitoring.
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                group="help"
                icon="help_outline"
                label="How do I create a new audit?"
                header-class="text-primary"
              >
                <q-card>
                  <q-card-section>
                    To create a new audit, click on "New Survey" in the navigation menu or use the
                    "New Audit" quick action on the dashboard. Fill in all required fields and
                    submit the form.
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                group="help"
                icon="help_outline"
                label="Can I edit a submitted audit?"
                header-class="text-primary"
              >
                <q-card>
                  <q-card-section>
                    Yes, you can edit a submitted audit by going to the "View Audits" page, finding
                    the audit you want to edit, and clicking the edit button. Make your changes and
                    save the form.
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- User Guide -->
      <div class="col-12 col-md-8">
        <q-card>
          <q-tabs
            v-model="tab"
            dense
            class="text-primary"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="guide" label="User Guide" />
            <q-tab name="contact" label="Contact Support" />
            <q-tab name="about" label="About" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="guide">
              <div class="text-h6 q-mb-md">User Guide</div>

              <div class="text-subtitle1 q-mb-sm">Getting Started</div>
              <p>
                This application helps you collect and manage audit data for patients taking
                multiple medications. The main workflow is:
              </p>
              <ol>
                <li>Create a new audit for each patient</li>
                <li>Record whether they are on 5+ medications</li>
                <li>View collected data in the audits list</li>
              </ol>

              <div class="text-subtitle1 q-mb-sm q-mt-md">Data Collection</div>
              <p>When creating a new audit, you'll need to provide:</p>
              <ul>
                <li>Date of audit (defaults to today)</li>
                <li>Your name (entered once per audit day)</li>
                <li>Patient ID</li>
                <li>Bed number</li>
                <li>Ward</li>
                <li>Hospital</li>
                <li>Whether the patient is on 5+ medications</li>
              </ul>
            </q-tab-panel>

            <q-tab-panel name="contact">
              <div class="text-h6 q-mb-md">Contact Support</div>

              <q-form class="q-gutter-md">
                <q-input
                  filled
                  v-model="contactForm.name"
                  label="Your Name *"
                  :rules="[(val) => !!val || 'Name is required']"
                />

                <q-input
                  filled
                  v-model="contactForm.email"
                  label="Email *"
                  type="email"
                  :rules="[(val) => !!val || 'Email is required']"
                />

                <q-select
                  filled
                  v-model="contactForm.topic"
                  :options="supportTopics"
                  label="Topic *"
                  :rules="[(val) => !!val || 'Topic is required']"
                />

                <q-input
                  filled
                  v-model="contactForm.message"
                  label="Message *"
                  type="textarea"
                  :rules="[(val) => !!val || 'Message is required']"
                />

                <div>
                  <q-btn color="primary" label="Submit" @click="submitContactForm" />
                </div>
              </q-form>
            </q-tab-panel>

            <q-tab-panel name="about">
              <div class="text-h6 q-mb-md">About This Application</div>

              <p>
                <strong>Patient Medication Audit Survey</strong> is an application designed to help
                healthcare professionals collect and analyze data about high-risk patients who are
                taking multiple medications.
              </p>

              <p>
                <strong>Version:</strong> 1.0.0<br />
                <strong>Built with:</strong> Quasar Framework and Supabase<br />
                <strong>Theme:</strong> Blue
              </p>

              <div class="text-subtitle1 q-mb-sm q-mt-md">Privacy Policy</div>
              <p>
                All patient data collected through this application is stored securely and in
                compliance with healthcare data protection regulations. Data is only accessible to
                authorized personnel.
              </p>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const tab = ref('guide')

// Contact form
const contactForm = ref({
  name: '',
  email: '',
  topic: null,
  message: '',
})

const supportTopics = [
  'Technical Issue',
  'Feature Request',
  'Data Question',
  'General Inquiry',
  'Other',
]

// Submit contact form
const submitContactForm = () => {
  // In a real implementation, this would send the form data to a support email or API
  $q.notify({
    color: 'positive',
    icon: 'check_circle',
    message: 'Your message has been sent. We will respond shortly.',
    position: 'top',
    timeout: 3000,
  })

  // Reset form
  contactForm.value = {
    name: '',
    email: '',
    topic: null,
    message: '',
  }
}
</script>
