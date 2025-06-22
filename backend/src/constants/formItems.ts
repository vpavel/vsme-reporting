// Form items for B1 - Basis for Preparation
export const b1FormItems = [
  {
    id: "b1.1",
    description:
      "Have you omitted any disclosures due to sensitive or classified information? If yes, specify which ones and provide the justification.",
    placeholder: "Specify any omitted disclosures and justification...",
    multiline: true,
    required: false,
  },
  {
    id: "b1.2",
    description:
      "Is your sustainability report prepared on a consolidated basis (including subsidiaries) or on an individual basis?",
    placeholder: "e.g., Consolidated basis including all subsidiaries...",
    required: true,
  },
  {
    id: "b1.3",
    description:
      "If reporting on a consolidated basis, please list all subsidiaries included in the report along with their registered addresses.",
    placeholder: "List subsidiaries and their registered addresses...",
    multiline: true,
    required: false,
  },
  {
    id: "b1.4",
    description: "What is the legal form of your company (e.g., LLC, corporation, partnership)?",
    placeholder: "e.g., Limited Liability Company (LLC)...",
    required: true,
  },
  {
    id: "b1.5",
    description: "Please provide your company's NACE sector classification code(s).",
    placeholder: "e.g., 62.01 - Computer programming activities...",
    required: true,
  },
  {
    id: "b1.6",
    description: "What is your company's total balance sheet size in Euros (EUR)?",
    placeholder: "Enter total balance sheet size in EUR...",
    required: true,
  },
  {
    id: "b1.7",
    description: "What was your company's total turnover (revenue) in Euros (EUR) in the reporting year?",
    placeholder: "Enter total turnover in EUR...",
    required: true,
  },
  {
    id: "b1.8",
    description: "How many employees does your company have (in headcount or full-time equivalent - FTE)?",
    placeholder: "Enter number of employees (headcount or FTE)...",
    required: true,
  },
  {
    id: "b1.9",
    description: "In which country is your company's primary operation located?",
    placeholder: "Enter country of primary operation...",
    required: true,
  },
  {
    id: "b1.10",
    description: "Where are your company's significant assets primarily located? (Specify the country/countries)",
    placeholder: "Specify countries where significant assets are located...",
    multiline: true,
    required: true,
  },
  {
    id: "b1.11",
    description: "Provide the geolocation (latitude and longitude) of sites owned, leased, or managed by your company.",
    placeholder: "Enter coordinates: Latitude, Longitude...",
    multiline: true,
    required: false,
  },
  {
    id: "b1.12",
    description:
      "Does your company hold any sustainability-related certifications or labels? If yes, please list them along with issuer, date, and rating/score.",
    placeholder: "List certifications with issuer, date, and rating/score...",
    multiline: true,
    required: false,
  },
];

// Form items for B2 - Practices, Policies and Future Initiatives
export const b2FormItems = [
  {
    id: "b2.1",
    description:
      "What specific practices does your company have in place to reduce water consumption, energy use, or greenhouse gas emissions? Please briefly describe each practice.",
    placeholder: "Describe your water, energy, and emissions reduction practices...",
    multiline: true,
    required: true,
  },
  {
    id: "b2.2",
    description:
      "Does your company have formal sustainability policies? If yes, please list and briefly describe them.",
    placeholder: "List and describe your formal sustainability policies...",
    multiline: true,
    required: false,
  },
  {
    id: "b2.3",
    description: "Are your sustainability policies publicly available? If yes, where (e.g., company website link)?",
    placeholder: "Provide links or locations where policies are available...",
    required: false,
  },
  {
    id: "b2.4",
    description:
      "What future initiatives or plans does your company have to enhance sustainability (e.g., planned projects, investments, or strategic changes)?",
    placeholder: "Describe planned sustainability initiatives and investments...",
    multiline: true,
    required: true,
  },
  {
    id: "b2.5",
    description: "Does your company set specific sustainability targets? If yes, briefly describe each target.",
    placeholder: "Describe your specific sustainability targets...",
    multiline: true,
    required: false,
  },
  {
    id: "b2.6",
    description:
      "How do you monitor progress towards these targets (describe monitoring methods, tools, or indicators)? Provide quantitative progress against each target (if available).",
    placeholder: "Describe monitoring methods and provide quantitative progress data...",
    multiline: true,
    required: false,
  },
];
