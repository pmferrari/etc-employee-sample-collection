// Name: ETC API
// Developer: Michael Copley
// Date: March 20th, 2018
// Description: This is mock data to return for the ETC API functions

export const mockAPIData = {
  "clientJobs": [
    {
      id: "example_job_id_1",
      clientId: "example1234",
      clientProjectId: "daddy98",
      facilityName: "Wayne State",
      facilityAddress: "123 Woodward Ave, Detroit MI 48004",
      name: "Jeremy Westcott",
      resultsPreference: "Email",
      turnAroundTime: -1,
      editedOn: "2015-05-08 14:00",
      dateSampled: "2015-02-04 14:00",
      minSurfacing: 3,
      minThermal: 3,
      minMisc: 3,
      contactId: "9831",
      surveyType: "Bulk Sample",
      plmInstructions: [ "Stop at 1st Positive" ],
      // associatedContacts: [],
      materials: [
        {
            clientMaterialId: 1,
            materialLocation: "Throughout",
            id: "material_1234",
            name: "Caulk",
            classification: "M",
            materialSub: "Window",
            size: "9x9",
            color: "White",
            friable: "Cat 2 - NF",
            note1: "Exterior",
            note2: "",
            assumed: false,
            rooms: [
              {
                id: "room1234",
                floor: "basement",
                room: "216",
                quantity: 4500,
                hangers: true,
                end: false,
                puncture: false,
                vibration: false,
                water: true,
                air: false,
                delimination: true,
                slowDeterioration: false,
                useWear: true,
                damageExtent: "Localized",
                feetDamaged: 50,
                access: "Staff",
                frequencyOfAccess: "High",
                vibrationLevel: "Seldom",
                airMovement: "Seldom",
                disturbancePotential: "Medium",
                acmCondition: "Fair",
                heightOfACM: "2 to 12",
                assessment: "Damaged Friable Surfacing",
                response: "Schedule Removal"
              }
            ],
            samples: [
                {
                    id: "sample1234",
                    clientSampleId: "A",
                    sampleLocation: "Room #1"
                },
                {
                    id: "sample5678",
                    clientSampleId: "B",
                    sampleLocation: "Room #4"
                },
                {
                    id: "sample9101",
                    clientSampleId: "C",
                    sampleLocation: "Room #3 and 6"
                }
            ],
            quantity: 3350,
            units: "SF"
        }
      ],
      // building: {
      //     inspectorCert: "564",
      //     mgmtPlanner: "David Bowier",
      //     mgmtPlannerCert: "P-987",
      //     buildingType: "School",
      //     buildingOwner: "Mr. Detroit",
      //     buildingContactName: "Luke Poyle",
      //     buildingContactPhone: "+1 (810) 888-0983",
      //     occupied: true
      // },
      facilityType: 2,
      managementPlannerId: 1035,
      inspectorId: 1035,
      onSitePerson: "Luke Poyle",
      onSitePhone: "+1 (810) 888-0983",
      occupied: true,
      editable: true,
      statusId: 1,
      isVerbal: false
    },
    {
      id: "example_job_id_2",
      clientId: "example1234",
      clientProjectId: "daddy98",
      facilityAddress: "123 Woodward Ave, Detroit MI 48004",
      facilityName: "Detroit Mercy",
      name: "Jeremy Westcott",
      resultsPreference: "Email",
      turnAroundTime: -1,
      editedOn: "2017-10-21 14:00",
      dateSampled: "2015-02-04 14:00",
      plmInstructions: [ "Stop at 1st Positive" ],
      minSurfacing: 0,
      minThermal: 0,
      minMisc: 0,
      surveyType: "Bulk Sample",
      materials: [],
      associatedContacts: [],
      // samples: [ array of Sample objects (see below for structure) ]
      editable: false,
      statusId: 3,
      isVerbal: false
    }
  ],
  "refreshClientJobs":[
    {
      id: "example_job_id_1",
      clientId: "example1234",
      clientProjectId: "daddy98",
      facilityAddress: "123 Woodward Ave, Detroit MI 48004",
      facilityName: "Wayne State",
      name: "Jeremy Westcott",
      resultsPreference: "Email",
      turnAroundTime: 0,
      editedOn: "2015-05-08 14:00",
      dateSampled: "2015-02-04 14:00",
      plmInstructions: [ "Stop at 1st Positive" ],
      surveyType: "Bulk Sample",
      contactId: "1234",
      associatedContacts: [],
      // materials: [ array of Material objects (see below for structure) ]
      // samples: [ array of Sample objects (see below for structure) ]
      editable: true,
      statusId: 1,
      isVerbal: false
    },
    {
      id: "example_job_id_2",
      clientId: "example1234",
      clientProjectId: "daddy98",
      facilityAddress: "123 Woodward Ave, Detroit MI 48004",
      facilityName: "Detroit Mercy",
      name: "Jeremy Westcott",
      resultsPreference: "Email",
      turnAroundTime: 1,
      editedOn: "2017-10-21 14:00",
      dateSampled: "2015-02-04 14:00",
      associatedContacts: [],
      plmInstructions: [ "Stop at 1st Positive" ],
      contactId: "1234",
      // materials: [ array of Material objects (see below for structure) ]
      // samples: [ array of Sample objects (see below for structure) ]
      editable: false,
      surveyType: "Bulk Sample",
      statusId: 3,
      isVerbal: false
    },
    {
      id: "example_job_id_3",
      clientId: "example1234",
      clientProjectId: "daddy98",
      contactId: "1234",
      facilityAddress: "123 Woodward Ave, Detroit MI 48004",
      facilityName: "The Common Cup",
      name: "Jeremy Westcott",
      resultsPreference: "Email",
      turnAroundTime: 2,
      editedOn: "2017-01-31 14:00",
      dateSampled: "2015-02-04 14:00",
      plmInstructions: [ "Stop at 1st Positive" ],
      // materials: [ array of Material objects (see below for structure) ]
      // samples: [ array of Sample objects (see below for structure) ]
      editable: false,
      surveyType: "Bulk Sample",
      associatedContacts: [],
      statusId: 4,
      isVerbal: false
    }
  ],
  userData: {
    name: "Devin Dennis",
    cell: "+1 (888) 888-8888",
    fax: "+1 (555) 555-5555",
    email: "devindenis@hotmail.com",
    resultsPreference: "Phone",
    id: "devin1234",
    companyId: "company1234",
    companyName: "ETC LLC",
    editedOn: "",
    client: {
      name: "ETC LLC",
      id: "company1234"
    }
  }
}
