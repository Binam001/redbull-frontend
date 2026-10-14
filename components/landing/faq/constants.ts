import { FaqItem } from './types';

export const FAQ_HEADER = {
  tag: '[ FAQS ]',
  heading: 'Questions clients often ask',
  intro:
    'Find answers to common questions about our integrated design process, multidisciplinary BIM coordination, LOD deliverables, Scan-to-BIM workflows, and project delivery timelines.',
};

export const FAQ_LIST: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Do you only create the design project, or do you manage the coordination end to end?',
    answer:
      'We provide end-to-end digital solutions from conceptual design and multidisciplinary BIM development (Architecture, Structure, MEP) to clash detection, Construction Cloud management, and construction-ready documentation.',
  },
  {
    id: 'faq-2',
    question: 'What is included in the BIM deliverables, and what will I receive?',
    answer:
      'You receive complete, coordinated Autodesk Revit models, federated Navisworks models (.NWD/.NWC), clash reports, 2D architectural & engineering drawings (PDF/DWG), schedules, quantities, and IFC export files for universal interoperability.',
  },
  {
    id: 'faq-3',
    question: 'What BIM Level of Development (LOD) do you provide?',
    answer:
      'We support all standard LOD levels from LOD 200/300 (schematic and detailed design) to LOD 400 (fabrication, shop drawings, and constructability) and LOD 500 (field-verified as-built and facility management models).',
  },
  {
    id: 'faq-4',
    question: 'How does your Scan to BIM / Point Cloud workflow work for existing structures?',
    answer:
      'We convert 3D laser scan and point cloud data into precise Revit BIM models and 2D documentation. Real-world conditions, structural deviations, and MEP routing are faithfully recreated to support renovation, retrofit, extension, and record drawings.',
  },
  {
    id: 'faq-5',
    question: 'How do you handle 4D sequencing and 5D cost integration?',
    answer:
      'We link 3D model geometry with construction schedules (Primavera P6, MS Project) for 4D visual phasing and simulate construction sequencing over time. For 5D, we connect model elements with unit costs for automated quantity takeoff and financial forecasting.',
  },
  {
    id: 'faq-6',
    question: 'How is project pricing structured and what affects the cost?',
    answer:
      'Pricing is determined by the gross floor area (GFA), discipline scope (Architecture, Structure, MEP), required LOD level, complexity of geometry, and turnaround timeline. We provide transparent fixed-fee proposals and milestone schedules upfront.',
  },
];
