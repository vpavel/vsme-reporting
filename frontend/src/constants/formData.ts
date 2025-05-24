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

// Form items for B3 - Energy and GHG Emissions
export const b3FormItems = [
  {
    id: "b3.1",
    description: "What is your company's total energy consumption in MWh?",
    placeholder: "Enter total energy consumption in MWh...",
    required: true,
  },
  {
    id: "b3.2",
    description: "Provide a breakdown of your total energy consumption into renewable and non-renewable sources (MWh).",
    placeholder: "e.g., Renewable: 500 MWh, Non-renewable: 300 MWh...",
    multiline: true,
    required: true,
  },
  {
    id: "b3.3",
    description:
      "What are your company's Scope 1 and Scope 2 greenhouse gas emissions in tonnes CO2 equivalent (tCO2eq)? Provide Scope 2 emissions based on location-based calculations.",
    placeholder: "e.g., Scope 1: 250 tCO2eq, Scope 2 (location-based): 180 tCO2eq...",
    multiline: true,
    required: true,
  },
  {
    id: "b3.4",
    description:
      "What is your company's greenhouse gas intensity, calculated as gross GHG emissions relative to turnover (in EUR)?",
    placeholder: "Enter GHG intensity (tCO2eq per EUR)...",
    required: true,
  },
];

// Form items for B4 - Pollution of Air, Water and Soil
export const b4FormItems = [
  {
    id: "b4.1",
    description:
      "Does your company report emissions of pollutants to air, water, and soil as legally required or voluntarily? If yes, specify the types of emissions.",
    placeholder: "Describe pollution reporting requirements and types...",
    multiline: true,
    required: false,
  },
  {
    id: "b4.2",
    description: "List the pollutants emitted by your company and their respective amounts.",
    placeholder: "e.g., NOx: 5 tonnes, SOx: 2 tonnes, Particulate matter: 1 tonne...",
    multiline: true,
    required: false,
  },
];

// Form items for B5 - Biodiversity
export const b5FormItems = [
  {
    id: "b5.1",
    description:
      "How many sites does your company have in or near biodiversity-sensitive areas, and what is their total area in hectares?",
    placeholder: "e.g., 3 sites, total area: 15 hectares...",
    multiline: true,
    required: false,
  },
  {
    id: "b5.2",
    description:
      "Optionally, provide land-use metrics for total land used, sealed areas, and nature-oriented areas on-site/off-site (in hectares).",
    placeholder: "e.g., Total land: 100 ha, Sealed areas: 60 ha, Nature-oriented: 40 ha...",
    multiline: true,
    required: false,
  },
];

// Form items for B6 - Water
export const b6FormItems = [
  {
    id: "b6.1",
    description: "What is the total water withdrawal of your company (in cubic meters or litres)?",
    placeholder: "Enter total water withdrawal (m³ or litres)...",
    required: false,
  },
  {
    id: "b6.2",
    description:
      "How much water does your company withdraw from areas identified as high water-stress areas (in cubic meters or litres)?",
    placeholder: "Enter water withdrawal from high stress areas (m³ or litres)...",
    required: false,
  },
  {
    id: "b6.3",
    description:
      "What amount of water is consumed by your company's significant production processes (in cubic meters or litres)?",
    placeholder: "Enter water consumption by production processes (m³ or litres)...",
    required: false,
  },
];

// Form items for B7 - Resource Use, Circular Economy and Waste Management
export const b7FormItems = [
  {
    id: "b7.1",
    description:
      "Does your company apply circular economy principles? Briefly describe how these principles are implemented in your operations.",
    placeholder: "Describe your circular economy practices and implementation...",
    multiline: true,
    required: false,
  },
  {
    id: "b7.2",
    description:
      "What is the total annual waste generation by your company, broken down by hazardous and non-hazardous waste (in tonnes)?",
    placeholder: "e.g., Non-hazardous: 150 tonnes, Hazardous: 20 tonnes...",
    multiline: true,
    required: false,
  },
  {
    id: "b7.3",
    description: "What amount of your company's waste is diverted to recycling or reuse annually (in tonnes)?",
    placeholder: "Enter amount of waste recycled/reused (tonnes)...",
    required: false,
  },
  {
    id: "b7.4",
    description:
      "Provide the annual mass-flow of relevant materials used by your company (in tonnes), applicable for significant sectors like manufacturing, construction, or packaging.",
    placeholder: "e.g., Steel: 500 tonnes, Plastic: 100 tonnes, Concrete: 200 tonnes...",
    multiline: true,
    required: false,
  },
];

// Form items for B8 - Workforce General Characteristics
export const b8FormItems = [
  {
    id: "b8.1",
    description: "Provide your company's employee count by contract type (headcount or FTE).",
    placeholder: "e.g., Full-time: 150, Part-time: 25, Contractors: 10...",
    multiline: true,
    required: true,
  },
  {
    id: "b8.2",
    description: "What is the gender breakdown of your company's employees (number or percentage)?",
    placeholder: "e.g., Male: 60% (90 employees), Female: 40% (60 employees)...",
    required: true,
  },
  {
    id: "b8.3",
    description: "In which countries are your company's employees primarily based?",
    placeholder: "List countries and approximate numbers...",
    multiline: true,
    required: true,
  },
  {
    id: "b8.4",
    description:
      "What is your company's employee turnover rate, applicable if the company employs more than 50 people (percentage)?",
    placeholder: "Enter turnover rate as percentage...",
    required: false,
  },
];

// Form items for B9 - Workforce Health and Safety
export const b9FormItems = [
  {
    id: "b9.1",
    description:
      "How many recordable work-related accidents occurred in your company during the reporting period (number and rate)?",
    placeholder: "e.g., 3 accidents, rate: 1.5 per 100 employees...",
    multiline: true,
    required: false,
  },
  {
    id: "b9.2",
    description:
      "How many fatalities occurred due to work-related incidents in your company during the reporting period?",
    placeholder: "Enter number of fatalities...",
    required: false,
  },
];

// Form items for B10 - Workforce Remuneration, Collective Bargaining and Training
export const b10FormItems = [
  {
    id: "b10.1",
    description:
      "Does your company comply with minimum wage laws and applicable collective agreements? Provide relevant details.",
    placeholder: "Describe compliance with wage laws and agreements...",
    multiline: true,
    required: true,
  },
  {
    id: "b10.2",
    description: "What is the gender pay gap percentage in your company?",
    placeholder: "Enter gender pay gap as percentage...",
    required: false,
  },
  {
    id: "b10.3",
    description: "What percentage of your company's employees is covered by collective bargaining agreements?",
    placeholder: "Enter percentage covered by collective bargaining...",
    required: false,
  },
  {
    id: "b10.4",
    description: "What are the average training hours provided per employee, broken down by gender?",
    placeholder: "e.g., Male employees: 25 hours, Female employees: 30 hours...",
    multiline: true,
    required: false,
  },
];

// Form items for B11 - Convictions and fines for corruption and bribery
export const b11FormItems = [
  {
    id: "b11.1",
    description:
      "How many convictions has your company incurred for violations of anti-corruption and anti-bribery laws in the reporting period?",
    placeholder: "Enter number of convictions...",
    required: false,
  },
  {
    id: "b11.2",
    description:
      "How many fines has your company incurred for violations of anti-corruption and anti-bribery laws in the reporting period?",
    placeholder: "Provide details of fines including amounts...",
    multiline: true,
    required: false,
  },
];

// Form metadata
export const formMetadata = {
  b1: {
    title: "Basis for Preparation",
    subtitle: "Please provide basic information about your company structure, financials, and operations.",
    submitButtonText: "Save & Continue to B2",
  },
  b2: {
    title: "Practices, Policies and Future Initiatives",
    subtitle:
      "Please provide information about your sustainability practices, policies, and future initiatives for transitioning towards a more sustainable economy.",
    submitButtonText: "Save & Complete Section",
  },
  b3: {
    title: "Energy and GHG Emissions",
    subtitle: "Report your company's energy consumption and greenhouse gas emissions data.",
    submitButtonText: "Save & Continue to B4",
  },
  b4: {
    title: "Pollution of Air, Water and Soil",
    subtitle: "Provide information about pollutant emissions to air, water, and soil.",
    submitButtonText: "Save & Continue to B5",
  },
  b5: {
    title: "Biodiversity",
    subtitle: "Report on your company's impact on biodiversity and nature-oriented areas.",
    submitButtonText: "Save & Continue to B6",
  },
  b6: {
    title: "Water",
    subtitle: "Provide data on your company's water withdrawal and consumption.",
    submitButtonText: "Save & Continue to B7",
  },
  b7: {
    title: "Resource Use, Circular Economy and Waste Management",
    subtitle: "Report on circular economy practices, waste generation, and material flows.",
    submitButtonText: "Save & Complete Environmental Section",
  },
  b8: {
    title: "Workforce General Characteristics",
    subtitle: "Provide information about your workforce composition and demographics.",
    submitButtonText: "Save & Continue to B9",
  },
  b9: {
    title: "Workforce Health and Safety",
    subtitle: "Report on workplace safety incidents and health measures.",
    submitButtonText: "Save & Continue to B10",
  },
  b10: {
    title: "Workforce Remuneration, Collective Bargaining and Training",
    subtitle: "Provide details on employee compensation, agreements, and training programs.",
    submitButtonText: "Save & Complete Social Section",
  },
  b11: {
    title: "Convictions and fines for corruption and bribery",
    subtitle: "Report any legal issues related to anti-corruption and anti-bribery compliance.",
    submitButtonText: "Save & Complete Governance Section",
  },
};
