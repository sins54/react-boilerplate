import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { z } from "../lib/zod-config";
import {
  Form,
  Input,
  Textarea,
  Select,
  MultiSelect,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Switch,
  DatePicker,
  FileUpload,
  ImageUpload,
  AutoComplete,
} from "../components/form";

// Complex Zod schema demonstrating nested objects, arrays, and various validations
const formSchema = z.object({
  // Personal Information (nested object)
  personalInfo: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    phone: z.string().optional(),
  }),

  // Account Details
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number"
    ),

  // Bio
  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),

  // Select options
  country: z.string().min(1, "Please select a country"),
  preferredLanguage: z.string().min(1, "Please select a language"),

  // Multi-select
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  interests: z.array(z.string()).optional(),

  // Checkboxes
  acceptTerms: z.literal(true, "You must accept the terms and conditions"),
  notifications: z.array(z.string()).optional(),

  // Radio group
  experience: z.enum(["junior", "mid", "senior", "lead"], "Please select your experience level"),

  // Switches
  newsletter: z.boolean().optional(),
  darkMode: z.boolean().optional(),

  // Date
  birthDate: z.string().min(1, "Birth date is required"),
  startDate: z.string().optional(),

  // Files
  resume: z.array(z.instanceof(File)).optional(),
  avatar: z.array(z.instanceof(File)).optional(),

  // AutoComplete
  city: z.string().min(1, "Please select a city"),

  // Address (another nested object)
  address: z.object({
    street: z.string().optional(),
    postalCode: z.string().optional(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

// Options for select/multi-select components
const countryOptions = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
];

const languageOptions = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "ja", label: "Japanese" },
  { value: "zh", label: "Chinese" },
];

const skillOptions = [
  { value: "react", label: "React" },
  { value: "typescript", label: "TypeScript" },
  { value: "nodejs", label: "Node.js" },
  { value: "python", label: "Python" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
];

const interestOptions = [
  { value: "ai", label: "Artificial Intelligence" },
  { value: "web3", label: "Web3 / Blockchain" },
  { value: "mobile", label: "Mobile Development" },
  { value: "devops", label: "DevOps" },
  { value: "security", label: "Cybersecurity" },
  { value: "data", label: "Data Science" },
];

const notificationOptions = [
  { value: "email", label: "Email notifications" },
  { value: "sms", label: "SMS notifications" },
  { value: "push", label: "Push notifications" },
  { value: "weekly", label: "Weekly digest" },
];

const experienceOptions = [
  { value: "junior", label: "Junior (0-2 years)" },
  { value: "mid", label: "Mid-level (2-5 years)" },
  { value: "senior", label: "Senior (5-10 years)" },
  { value: "lead", label: "Lead (10+ years)" },
];

const cityOptions = [
  { value: "nyc", label: "New York City" },
  { value: "la", label: "Los Angeles" },
  { value: "sf", label: "San Francisco" },
  { value: "chicago", label: "Chicago" },
  { value: "boston", label: "Boston" },
  { value: "seattle", label: "Seattle" },
  { value: "austin", label: "Austin" },
  { value: "denver", label: "Denver" },
  { value: "miami", label: "Miami" },
  { value: "portland", label: "Portland" },
];

export default function FormShowcasePage() {
  const [submittedData, setSubmittedData] = React.useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      },
      username: "",
      password: "",
      bio: "",
      country: "",
      preferredLanguage: "",
      skills: [],
      interests: [],
      acceptTerms: undefined as unknown as true,
      notifications: [],
      experience: undefined as unknown as "junior",
      newsletter: false,
      darkMode: false,
      birthDate: "",
      startDate: "",
      resume: undefined,
      avatar: undefined,
      city: "",
      address: {
        street: "",
        postalCode: "",
      },
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted successfully!");
    console.log("Form Data:", data);
    setSubmittedData(data);
  };

  return (
    <div
      className="min-h-screen py-[var(--spacing-8)] px-[var(--spacing-4)]"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-[var(--spacing-8)]">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-[var(--spacing-4)] text-[length:var(--text-sm)]"
            style={{ color: "var(--color-primary)" }}
          >
            ← Back to Home
          </Link>
          <h1
            className="text-[length:var(--text-4xl)] font-[number:var(--font-bold)]"
            style={{ color: "var(--color-text)" }}
          >
            Form System Showcase
          </h1>
          <p
            className="mt-[var(--spacing-2)] text-[length:var(--text-lg)]"
            style={{ color: "var(--color-text-secondary)" }}
          >
            A comprehensive form system built with React Hook Form + Zod validation
          </p>
        </div>

        {/* Form */}
        <div
          className="rounded-[var(--radius-xl)] p-[var(--spacing-6)] border"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <Form form={form} onSubmit={onSubmit} className="space-y-[var(--spacing-8)]">
            {/* Section: Personal Information */}
            <section>
              <h2
                className="text-[length:var(--text-xl)] font-[number:var(--font-semibold)] mb-[var(--spacing-4)] pb-[var(--spacing-2)] border-b"
                style={{
                  color: "var(--color-text)",
                  borderColor: "var(--color-border)",
                }}
              >
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-4)]">
                <Input
                  name="personalInfo.firstName"
                  label="First Name"
                  required
                  placeholder="Enter your first name"
                />
                <Input
                  name="personalInfo.lastName"
                  label="Last Name"
                  required
                  placeholder="Enter your last name"
                />
                <Input
                  name="personalInfo.email"
                  label="Email"
                  type="email"
                  required
                  placeholder="you@example.com"
                />
                <Input
                  name="personalInfo.phone"
                  label="Phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  helperText="Optional, for account recovery"
                />
              </div>
            </section>

            {/* Section: Account Details */}
            <section>
              <h2
                className="text-[length:var(--text-xl)] font-[number:var(--font-semibold)] mb-[var(--spacing-4)] pb-[var(--spacing-2)] border-b"
                style={{
                  color: "var(--color-text)",
                  borderColor: "var(--color-border)",
                }}
              >
                Account Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-4)]">
                <Input
                  name="username"
                  label="Username"
                  required
                  placeholder="Choose a username"
                  helperText="3-20 characters"
                />
                <Input
                  name="password"
                  label="Password"
                  type="password"
                  required
                  placeholder="Create a password"
                  helperText="Min 8 characters with uppercase, lowercase, and number"
                />
              </div>
              <div className="mt-[var(--spacing-4)]">
                <Textarea
                  name="bio"
                  label="Bio"
                  placeholder="Tell us about yourself..."
                  helperText="Max 500 characters"
                  rows={4}
                />
              </div>
            </section>

            {/* Section: Preferences */}
            <section>
              <h2
                className="text-[length:var(--text-xl)] font-[number:var(--font-semibold)] mb-[var(--spacing-4)] pb-[var(--spacing-2)] border-b"
                style={{
                  color: "var(--color-text)",
                  borderColor: "var(--color-border)",
                }}
              >
                Preferences
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-4)]">
                <Select
                  name="country"
                  label="Country"
                  required
                  options={countryOptions}
                  placeholder="Select your country"
                />
                <Select
                  name="preferredLanguage"
                  label="Preferred Language"
                  required
                  options={languageOptions}
                  placeholder="Select a language"
                />
              </div>
              <div className="mt-[var(--spacing-4)]">
                <AutoComplete
                  name="city"
                  label="City"
                  required
                  options={cityOptions}
                  placeholder="Start typing to search..."
                />
              </div>
            </section>

            {/* Section: Skills & Interests */}
            <section>
              <h2
                className="text-[length:var(--text-xl)] font-[number:var(--font-semibold)] mb-[var(--spacing-4)] pb-[var(--spacing-2)] border-b"
                style={{
                  color: "var(--color-text)",
                  borderColor: "var(--color-border)",
                }}
              >
                Skills & Interests
              </h2>
              <div className="space-y-[var(--spacing-4)]">
                <MultiSelect
                  name="skills"
                  label="Technical Skills"
                  required
                  options={skillOptions}
                  placeholder="Select your skills..."
                />
                <MultiSelect
                  name="interests"
                  label="Areas of Interest"
                  options={interestOptions}
                  placeholder="What interests you?"
                  helperText="Optional - select any topics you're interested in"
                />
              </div>
            </section>

            {/* Section: Experience */}
            <section>
              <h2
                className="text-[length:var(--text-xl)] font-[number:var(--font-semibold)] mb-[var(--spacing-4)] pb-[var(--spacing-2)] border-b"
                style={{
                  color: "var(--color-text)",
                  borderColor: "var(--color-border)",
                }}
              >
                Experience
              </h2>
              <RadioGroup
                name="experience"
                label="Experience Level"
                required
                options={experienceOptions}
                direction="vertical"
              />
            </section>

            {/* Section: Dates */}
            <section>
              <h2
                className="text-[length:var(--text-xl)] font-[number:var(--font-semibold)] mb-[var(--spacing-4)] pb-[var(--spacing-2)] border-b"
                style={{
                  color: "var(--color-text)",
                  borderColor: "var(--color-border)",
                }}
              >
                Important Dates
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-4)]">
                <DatePicker
                  name="birthDate"
                  label="Birth Date"
                  required
                  maxDate={new Date().toISOString().split("T")[0]}
                />
                <DatePicker
                  name="startDate"
                  label="Preferred Start Date"
                  minDate={new Date().toISOString().split("T")[0]}
                  helperText="When would you like to start?"
                />
              </div>
            </section>

            {/* Section: Notifications & Settings */}
            <section>
              <h2
                className="text-[length:var(--text-xl)] font-[number:var(--font-semibold)] mb-[var(--spacing-4)] pb-[var(--spacing-2)] border-b"
                style={{
                  color: "var(--color-text)",
                  borderColor: "var(--color-border)",
                }}
              >
                Notifications & Settings
              </h2>
              <div className="space-y-[var(--spacing-4)]">
                <CheckboxGroup
                  name="notifications"
                  label="Notification Preferences"
                  options={notificationOptions}
                  direction="vertical"
                  helperText="Choose how you'd like to be notified"
                />
                <div className="flex flex-col gap-[var(--spacing-3)]">
                  <Switch
                    name="newsletter"
                    label="Subscribe to newsletter"
                    size="md"
                  />
                  <Switch
                    name="darkMode"
                    label="Enable dark mode"
                    size="md"
                  />
                </div>
              </div>
            </section>

            {/* Section: File Uploads */}
            <section>
              <h2
                className="text-[length:var(--text-xl)] font-[number:var(--font-semibold)] mb-[var(--spacing-4)] pb-[var(--spacing-2)] border-b"
                style={{
                  color: "var(--color-text)",
                  borderColor: "var(--color-border)",
                }}
              >
                Documents & Images
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-4)]">
                <FileUpload
                  name="resume"
                  label="Resume / CV"
                  accept=".pdf,.doc,.docx"
                  maxSize={5 * 1024 * 1024}
                  helperText="PDF, DOC, or DOCX up to 5MB"
                />
                <ImageUpload
                  name="avatar"
                  label="Profile Picture"
                  maxSize={2 * 1024 * 1024}
                  helperText="Upload your profile picture"
                />
              </div>
            </section>

            {/* Section: Address (Nested Object) */}
            <section>
              <h2
                className="text-[length:var(--text-xl)] font-[number:var(--font-semibold)] mb-[var(--spacing-4)] pb-[var(--spacing-2)] border-b"
                style={{
                  color: "var(--color-text)",
                  borderColor: "var(--color-border)",
                }}
              >
                Address (Optional)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-4)]">
                <Input
                  name="address.street"
                  label="Street Address"
                  placeholder="123 Main St"
                />
                <Input
                  name="address.postalCode"
                  label="Postal Code"
                  placeholder="12345"
                />
              </div>
            </section>

            {/* Section: Terms & Submit */}
            <section>
              <h2
                className="text-[length:var(--text-xl)] font-[number:var(--font-semibold)] mb-[var(--spacing-4)] pb-[var(--spacing-2)] border-b"
                style={{
                  color: "var(--color-text)",
                  borderColor: "var(--color-border)",
                }}
              >
                Terms & Conditions
              </h2>
              <Checkbox
                name="acceptTerms"
                label="I accept the terms and conditions"
                required
              />
            </section>

            {/* Submit Button */}
            <div className="flex gap-[var(--spacing-4)] pt-[var(--spacing-4)]">
              <button
                type="submit"
                className="px-[var(--spacing-6)] py-[var(--spacing-3)] rounded-[var(--radius-md)] font-[number:var(--font-medium)] transition-colors"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-text-on-primary)",
                }}
              >
                Submit Form
              </button>
              <button
                type="button"
                onClick={() => form.reset()}
                className="px-[var(--spacing-6)] py-[var(--spacing-3)] rounded-[var(--radius-md)] font-[number:var(--font-medium)] border transition-colors"
                style={{
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text)",
                  borderColor: "var(--color-border)",
                }}
              >
                Reset Form
              </button>
            </div>
          </Form>
        </div>

        {/* Submitted Data Display */}
        {submittedData && (
          <div
            className="mt-[var(--spacing-8)] rounded-[var(--radius-xl)] p-[var(--spacing-6)] border"
            style={{
              backgroundColor: "var(--color-success-bg)",
              borderColor: "var(--color-success)",
            }}
          >
            <h2
              className="text-[length:var(--text-xl)] font-[number:var(--font-semibold)] mb-[var(--spacing-4)]"
              style={{ color: "var(--color-success-text)" }}
            >
              ✓ Form Submitted Successfully!
            </h2>
            <p
              className="text-[length:var(--text-sm)] mb-[var(--spacing-2)]"
              style={{ color: "var(--color-success-text)" }}
            >
              Check the browser console for the full data object. Summary:
            </p>
            <pre
              className="p-[var(--spacing-4)] rounded-[var(--radius-md)] overflow-auto text-[length:var(--text-sm)]"
              style={{
                backgroundColor: "var(--color-surface)",
                color: "var(--color-text)",
                borderColor: "var(--color-border)",
              }}
            >
              {JSON.stringify(
                {
                  ...submittedData,
                  resume: submittedData.resume
                    ? `[${submittedData.resume.length} file(s)]`
                    : undefined,
                  avatar: submittedData.avatar
                    ? `[${submittedData.avatar.length} file(s)]`
                    : undefined,
                },
                null,
                2
              )}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
