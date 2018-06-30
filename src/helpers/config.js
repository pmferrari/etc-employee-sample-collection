// Name: Materials Config
// Developer: Michael Copley
// Date: March 28th, 2018
// Description: This is configuration for various field values, and new objects.

export const emptyJob = {
  jobId: "",
  clientId: "",
  clientProjectId: "",
  contactId: "",
  facilityName: "",
  facilityAddress: "",
  resultsPreference: "",
  turnAroundTime: null,
  editedOn: "",
  dateSampled: "",
  plmInstructions: [],
  materials: [],
  surveyType: "",
  // associatedContacts: [], ***the last 5 keys arent sent to API
  minSurfacing: 0,
  minThermal: 0,
  minMisc: 0,
  editable: true,
  statusId: 1,
  facilityType: 0,
  managementPlannerId: null,
  inspectorId: null,
  onSitePerson: "",
  onSitePhone: "",
  occupied: false,
  isVerbal: false
};

export const emptyMaterial = {
    clientMaterialId: 0,
    id: "",
    name: "",
    classification: "",
    materialSub: "",
    size: "",
    color: "",
    assumed: false,
    positive: false,
    friable: "",
    note1: "",
    note2: "",
    samples: [],
    location: "",
    quantity: 0,
    units: "",
    rooms: []
};

export const emptyRoom = {
    id: "",
    floor: "",
    room: "",
    quantity: 0,
    hangers: false,
    end: false,
    puncture: false,
    vibration: false,
    water: false,
    air: false,
    delimination: false,
    slowDeterioration: false,
    useWear: false,
    damageExtent: "",
    feetDamaged: 0,
    access: "",
    frequencyOfAccess: "",
    vibrationLevel: "",
    airMovement: "",
    disturbancePotential: "",
    acmCondition: "",
    heightOfACM: "",
    assessment: "",
    response: ""
};

export const emptySample = {
    id: "",
    clientSampleId: "",
    sampleLocation: ""
};

export const possibleNotes1 = [
    'n/a',
    'Exterior',
    'Interior',
    'Window',
    'Door',
    'Foundation',
    'Sashes',
    'Dots',
    'Smooth',
    'Reccessed',
    'Holes',
    'Textured',
    'Fluffy',
    'Hard',
    'Stretchy',
    'Floral',
    'Wood Grain',
    'Checkered',
    'Striped',
    'Paper Back',
    'Burlap Back',
    'Mosaic',
    'Wrap',
    'Tape',
    'Sealant',
    'Insulation',
    'Cloth',
    'Diamond',
    'Circle',
    'Square',
    'Corregated',
    'Faux',
    'Light Fixture'
];

export const possibleSizes = [
    'n/a',
    '9x9',
    '12x12',
    '18x18',
    '24x24',
    '2x4',
    '2x2',
    '1x1',
    '10x2',
    '2"',
    '4"',
    '6"',
    '8"',
    '10"',
    '12"',
    '2"- 4"',
    '5"- 8"',
    '8"- 12"',
    '12" and up'
];

export const possibleBuildingTypes = [
    'Single Family Housing',
    'Multi Family Housing',
    'School',
    'Commercial',
    'Industrial'
];

export const possibleColors = [
    'Select...',
    'White',
    'Off-White',
    'Tan',
    'Biege',
    'Grey',
    'Multi-Color',
    'Black',
    'Blue',
    'Bluish Green',
    'Brown',
    'Dark Blue',
    'Dark Brown',
    'Dark Green',
    'Dark Grey',
    'Dark Orange',
    'Dark Red',
    'Dark Tan',
    'Dark Yellow',
    'Green',
    'Light Blue',
    'Light Brown',
    'Light Green',
    'Light Grey',
    'Light Orange',
    'Light Red',
    'Light Tan',
    'Light Yellow',
    'Orange',
    'Pink',
    'Purple',
    'Red',
    'Silver',
    'Silver',
    'Wood Grain',
    'Yellow'
];


export const alphabet = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
  'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
  'W', 'X', 'Y', 'Z'
];

export const requiredFields = {
  material: {
      "Bulk Sample": [ "clientMaterialId", "name", "classification",
                        "size", "color", "friable"],
      "OSHA": [ "clientMaterialId", "name", "classification",
                 "size", "color", "friable",
                "units", "quantity", "materialLocation" ],
      "AHERA": [ "clientMaterialId", "name", "classification",
                 "size", "color", "friable",
                "units", "quantity", "materialLocation", "rooms" ],
  },
  building: {}
}


export const APIFormat = {
  job: {
    "jobId": true,
    "clientId": true,
    "contactId": true,
    "clientProjectId": true,
    "facilityName": true,
    "facilityAddress": true,
    "facilityType": true,
    "plmInstructions": true,
    "materials": true,
    "editedOn": true,
    "onSitePerson": true,
    "onSitePhone": true,
    "turnAroundTime": true,
    "inspectorId": true,
    "managementPlannerId": true,
    "isVerbal": true,
    "statusId": true,
    "dateCreated": true,
    "occupied": true
  },
  material: {
    "id": true,
    "clientMaterialId": true,
    "material": true,
    "classification": true,
    "materialSub": true,
    "size": true,
    "color": true,
    "friable": true,
    "note1": true,
    "note2": true,
    "samples": true,
    "assumed": true,
    "units": true,
    "quantity": true,
    "positive": true,
    "location": true
  }
};
