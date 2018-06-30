// Name: ETC API
// Developer: Michael Copley
// Date: March 20th, 2018
// Description: This is the helper file to make API requests to ETC

import { mockAPIData } from './mockAPI.js';
import { alphabet, APIFormat, requiredFields, emptyJob,
          emptyMaterial, emptySample, emptyRoom } from './config.js';
import { observable, action, runInAction } from "mobx";
import { observer } from "mobx-react/native";
import { AsyncStorage, Platform, NetInfo } from "react-native";
import { moderateScale } from 'react-native-size-matters';
import { Toast } from "native-base";
import moment from "moment";

export let clientJobs = {};
export let materialsConfig = {};
export let dropdownConfig = {};
export let lastAPICallTimestamp = null;
export let loggedIn = false;
export let userProfile = null;
export let seenWalkthrough = false;
export const minutesAPIThreshold = 15;


/************** LOCAL DEVICE ****************/

// EFFECTS: This is the callback function from when the AsyncStorage is
//          queried in App.js - this simply assigns it to their variables.
export function parseLocalData(err, stores) {

    return new Promise(async function(resolve, reject) {

        if (err) {
            toastHelper("Could not retrieve device data");
        } else {
            // console.log('Here are the local stores: ');
            // console.log(stores);
            await stores.map((result, i, store) => {
                let key = store[i][0];
                let value = store[i][1];
                clientJobs = key === 'clientJobs' && value !== 'null' ? observable(JSON.parse(value)) : clientJobs; // might have to figure out a way to make it observable again
                lastAPICallTimestamp = key === 'lastAPICallTimestamp' && value !== 'null' ? moment(value) : lastAPICallTimestamp;
                materialsConfig = key === 'materialsConfig' && value !== "null" ? JSON.parse(value) : materialsConfig;
                dropdownConfig = key === 'dropdownConfig' && value !== "null" ? JSON.parse(value) : dropdownConfig;
                loggedIn = key === 'loggedIn' && value === "true" ? true : loggedIn;
                seenWalkthrough = key === 'seenWalkthrough' && value === "true" ? true : seenWalkthrough;
                userProfile = key === 'userProfile' && value !== "null" ? JSON.parse(value) : userProfile;
            });
            resolve();
        }
    });
}

// EFFECTS: Returns boolean based on if its been too long since an API call
export function tooLongSinceAPICall() {
    if (lastAPICallTimestamp === null) {
        return true;
    } else if (moment() > lastAPICallTimestamp.add(minutesAPIThreshold, 'minutes')) {
        return true;
    } else {
        return false;
    }
}

// EFFECTS: Returns true/false based on if the device has an internet connection
export function internetConnectionExists() {
    return new Promise(async function(resolve, reject) {
        if (Platform.OS === "ios") {
            fetch("https://www.google.com").then(response => {
                isConnected = response.status === 200 ? true : false;
                resolve(isConnected);
            })
            .catch(error => {
                // console.error(error);
                resolve(false);
            })

        } else {
            NetInfo.isConnected.fetch().done((isConnected) => {
                resolve(isConnected);
            });
        }
    });
}

export function grabClientJobs(refresh?: Boolean) { // refresh button, toast no internet

    console.log('in client jobs');
    console.log(refresh);

    return new Promise(async function(resolve, reject) {

        internetConnectionExists().then(async function(isConnected) {

            // if refresh, or timestamp AND internet connection
            if ((refresh || tooLongSinceAPICall()) && isConnected) {

                console.log('were doing the API call!');
                // Call etcAPI, update lastAPICallTimestamp
                jobs = await APICall('GET', '/asbestossurvey/getbyclient/' + String(userProfile.client.id));
                jobs = jobs.data;
                // jobs = await mockAPIData["clientJobs"];
                lastAPICallTimestamp = moment();

                // Merge only allowed fields into MobX object if it exists locally, otherwise just add it
                await runInAction("Updating Jobs from API", async () => {
                    for (job of jobs) {

                        await updateLocalFromAPIJobResponse(job);

                        // Uncomment if we only want to allow certain fields to change from API
                        // if (job.jobId in clientJobs) {
                        //     if (clientJobs[job.jobId].statusId !== job.statusId) {
                        //         clientJobs[job.jobId].statusId = job.statusId;
                        //     }
                        //     if (clientJobs[job.jobId]["editable"] !== job.editable) {
                        //         clientJobs[job.jobId]["editable"] = job.editable;
                        //     }
                        // } else {
                        //     clientJobs[job.jobId] = job;
                        // }
                    }
                });

                // always need to at least update the timestamp
                updateLocalData(['lastAPICallTimestamp', 'clientJobs']); // get a promise here, guess we dont have to?

                clientJobs = observable(clientJobs);
                resolve(clientJobs);

            } else {
                // since were doing an async function w/await - we can abstract this out like before
                console.log('returning cached version');
                clientJobs = observable(clientJobs);
                resolve(clientJobs);
            }

            if (refresh && !isConnected) {
                toastHelper("No internet connection", "danger");
            } else if (refresh && isConnected) {
                toastHelper("Everything is now up to date.");
            }
        }).catch((error) => {
            console.error(error);
            reject(error);
        });;
    });
}

export async function updateLocalFromAPIJobResponse(job: Object) {
    return new Promise(async function(resolve, reject) {
        // Assigning keys so we don't overwrite minimum # of samples
        if (!(job.jobId in clientJobs)) {
            job.minMisc = 0;
            job.minSurfacing = 0;
            job.minThermal = 0;
        } else {
            job.minMisc = clientJobs[job.jobId].minMisc;
            job.minSurfacing = clientJobs[job.jobId].minSurfacing;
            job.minThermal = clientJobs[job.jobId].minThermal;
        }
        clientJobs[job.jobId] = job;

        // Adding empty array of samples if necessary
        for (let i = 0; i < clientJobs[job.jobId].materials.length; ++i) {
            console.log(clientJobs[job.jobId].materials[i]);
            clientJobs[job.jobId].materials[i].name = clientJobs[job.jobId].materials[i].material;
            if (clientJobs[job.jobId].materials[i].samples === null ||
                clientJobs[job.jobId].materials[i].samples === undefined) {
                clientJobs[job.jobId].materials[i].samples = [];
            }
        }
        resolve();
    });
}


// REQUIRES: 'jobId' - the job to be sent to ETC's database
// MODIFIES: ETC Database
// EFFECTS: Sync's the latest job changes to the ETC database
export async function syncWithETC(jobId: String) {
    return new Promise(async function(resolve, reject) {
        // API call to the Job Upsert, don't change to "submitted" though

        // Make sure a clientProjectId is supplied to update
        if (clientJobs[jobId].clientProjectId === "") {
            toastHelper("Provide clientProjectId to Save to ETC");
            return resolve();
        }

        try {
            await submitJob(jobId);
            toastHelper("Successfully saved job");
            resolve();
        } catch(error) {
            console.log(String(error));
            toastHelper("Issue Updating ETC");
            resolve();
        }
    });
}

// REQUIRES: An array of variable names to put in local storage
// MODIFIES: The device's local storage
// EFFECTS: Writes the program's variables into the local device's persistent memory
export async function updateLocalData(values: Array) {
    let error = null;
    const updates = [];

    for (data of values) {
        if (data === "lastAPICallTimestamp") {
            updates.push(AsyncStorage.setItem(data, eval(data)));
        } else {
            updates.push(AsyncStorage.setItem(data, JSON.stringify(eval(data))));
        }
    }
    return Promise.all(updates)
        .then(() => {
            console.log('Local save successful: ' + String(values));
        })
        // eslint-disable-next-line
        .catch(error => {
            console.error(error);
            toastHelper("Unable to save the data locally");
        })
    ;
}

/************** JOB *************/

// REQUIRES: n/a
// MODIFIES: 'clientJobs', local device data
// EFFECTS: Returns an empty job object after creating a new temporary
//          key for it and saving it in clientJobs (later gets replaced by API)
//          Key Naming Convention: "new_job_" + (length of 'clientJobs' + 1)
export async function createNewJob() {

    return new Promise(async function(resolve, reject) {
        let newJob = JSON.parse(JSON.stringify(emptyJob));
        let index = Object.keys(clientJobs).length + 1;
        while ("new_job_" + String(index) in clientJobs) {
            index++;
        }
        newJob.jobId = "new_job_" + String(index);
        newJob.dateSampled = moment();
        newJob.editedOn = moment();
        newJob.contactId = userProfile.id;
        newJob.resultsPreference = userProfile.resultsPreference;
        newJob.clientId = userProfile.client.id;
        newJob.turnAroundTime = 5; // Standard
        newJob.surveyType = "Bulk Sample";

        await runInAction("Adding New Job", async () => {
            clientJobs[newJob.jobId] = newJob;
            updateLocalData(['clientJobs']).then(async () => {
                console.log('just saved the new job');
                // Can't get job id without a clientProjectId, so cant do it here
                // newJobAPI = await submitJob(newJob.jobId);
                // console.log(newJobAPI);
                resolve(clientJobs[newJob.jobId]);
            })
            .catch(error => {
                // Still resolve if you're trying to create a new job w/o internet
                toastHelper(String("Issue Saving to ETC"));
                resolve(clientJobs[newJob.jobId]);
            });
        });
    });
}

// REQUIRES: The latest up to date job object
// MODIFIES: clientJobs and local device memory
// EFFECTS: Syncs the user's changes to a job
export async function syncJobUpdate(job: Object) {
    clientJobs[job.jobId].editedOn = moment();
    const newJob = JSON.parse(JSON.stringify(job))
    delete newJob.navigation;
    delete newJob.syncUpdates;
    clientJobs[newJob.jobId] = JSON.parse(JSON.stringify(newJob));
    updateLocalData(['clientJobs']);
}


// REQUIRES: The id of the job to delete
// MODIFIES: clientJobs and the local device memory
// EFFECTS: Deletes the specified job from the device
export async function deleteJob(id: String) {
    return new Promise(async function(resolve, reject) {
        await APICall('DELETE', '/asbestossurvey/' + id);
        await runInAction("Removing Job", async () => {
            delete clientJobs[id];
            updateLocalData(['clientJobs']).then(() => {
                console.log('just saved the changes');
                toastHelper("Successfully deleted Job");
                resolve();
            })
            .catch(error => {
                toastHelper(String(error));
                reject(error);
            });
        });
    });
}

// REQUIRES: 'job' - a Job object
// MODIFIES: n/a
// EFFECTS: Validates all required information is supplied for a job request
//          If valid, it will return false
//          If invalid, it will return true and display a toast showing the first error.
function invalidJob(job: Object) {

    let errorMsg = "";
    const materialReqs = requiredFields.material[job.surveyType];
    const classificationMap = {
        "m": "Misc",
        "s": "Surfacing",
        "t": "Thermal"
    };

    // Validating Job Fields
    for (key in job) {
        if (key !== "fax" && job[key] === "") {
            errorMsg = String(key) + " is blank for the job";
            return errorMsg;
        }
    }

    // Validating Material Fields
    let minimums = { s: 0, t: 0, m: 0 };
    let samples = { s: 0, t: 0, m: 0 };

    if (job.materials.length === 0) {
        errorMsg = "There are no materials";
        return errorMsg;
    } else {
        // Checking for minimums
        for (material of job.materials) {
            for (key in material) {
                if (materialReqs.indexOf(key) >= 0 &&
                    (material[key] === "" || material[key] === 0 || material[key].length === 0)) {
                    errorMsg = String(key) + " is blank for " + material.name;
                    errorMsg += ", " + material.materialSub;
                    return errorMsg;
                }
            }

            // Validating Sample Fields
            if (!material.assumed) {
                minimums[material.classification.toLowerCase()]++;
                samples[material.classification.toLowerCase()] += material.samples !== undefined ? material.samples.length : 0;
                if (material.samples === undefined || material.samples.length === 0) {
                    errorMsg = "There are no samples for: " + material.name + ", ";
                    errorMsg += material.materialSub;
                    return errorMsg;
                }
            } else {
                for (sample of material.samples) {
                    for (key in sample) {
                        if (sample[key] === "") {
                            errorMsg = "Sample " + sample.clientSampleId + " for ";
                            errorMsg += "material " + material.name + ", " + material.materialSub;
                            errorMsg += " is blank for " + String(key);
                            return errorMsg;
                        }
                    }
                }
            }
        }
        minimums.s *= job.minSurfacing;
        minimums.t *= job.minThermal;
        minimums.m *= job.minMisc;
        for (key in minimums) {
            if (minimums[key] > samples[key]) {
                errorMsg = "You need " + String(minimums[key]) + " " + String(classificationMap[key]);
                errorMsg += " samples and only got " + String(samples[key]);
                return errorMsg;
            }
        }
    }
    return errorMsg;
}

// EFFECTS: Cleans the job data structure to match what the API is expecting
function cleanJob(jobId: String) {
    const tempJob = JSON.parse(JSON.stringify(clientJobs[jobId]));
    console.log('IN CLEAN JOB');
    console.log(jobId);
    console.log(tempJob);
    // delete tempJob.editable;
    // delete tempJob.minSurfacing, delete tempJob.minThermal, delete tempJob.minMisc;
    if (typeof(tempJob.jobId) == "string" && tempJob.jobId.indexOf("new_job" >= 0)) {
        delete tempJob.jobId;
    }
    // DEV
    for (key in tempJob) {
        if (APIFormat.job[key] !== true) {
            delete tempJob[key];
        }
    }

    for (let i = 0; i < tempJob.materials.length; ++i) {
        tempJob.materials[i].material = tempJob.materials[i].name;
        delete tempJob.materials[i].name, delete tempJob.materials[i].samplesNeeded;
        if (tempJob.materials[i].id.indexOf("new_material" >= 0)) {
            delete tempJob.materials[i].id;
        }

        // DEV
        for (key in tempJob.materials[i]) {
            if (APIFormat.material[key] !== true) {
                delete tempJob.materials[i][key];
            }
        }

        for (let j = 0; j < tempJob.materials[i].samples.length; ++j) {
            if (tempJob.materials[i].samples[j].id.indexOf("new_sample" >= 0)) {
                delete tempJob.materials[i].samples[j].id;
            }
        }
        // repeat for room?
    }
    console.log("CLEANED JOB");
    console.log(tempJob);

    // cycle through and correct quantity, feetDamaged, etc to 0 if empty string
    return tempJob;
}

// REQUIRES: jobId - String of the job's id
// MODIFIES: ETC database, local device data, clientJobs
// EFFECTS: Completes the job and sends it to the ETC database
export async function completeJob(jobId: String) {
    return new Promise(async function(resolve, reject) {
        // validate job using clientJobs submission
        await runInAction("Completing Job", async () => {
            clientJobs[jobId].statusId = 2;
            let jobIssues = invalidJob(clientJobs[jobId]);
            if (jobIssues !== "") {
                toastHelper(capitalizeFirstLetter(jobIssues), "danger");
                reject(capitalizeFirstLetter(jobIssues));
            } else {
                await submitJob(jobId);
                toastHelper("Successfully Submitted Job");
                resolve();
            }
        });
    });
}

// REQUIRES: jobId - String of the job's id
// MODIFIES: ETC database, local device data, clientJobs
// EFFECTS: Submits the job to the ETC database
export async function submitJob(jobId: String) {
    return new Promise(async function(resolve, reject) {

        // validate job using clientJobs submission
        const readyJob = cleanJob(jobId);
        console.log('getting ready to submit job: ');
        console.log(readyJob);
        const apiResponse = await APICall('POST', '/AsbestosSurvey', readyJob); // { statusCode: 200 }; // await fetch...
        console.log(apiResponse);

        // No internet connection, toast already appears
        if (apiResponse === undefined) {
            reject(apiResponse);
        } else if (apiResponse.status !== 200) {
            toastHelper("There was a problem submitting the job", "danger");
            reject(apiResponse);
        } else {
            // Adjust this not to overwrite the minimum #'s
            apiResponse.data.minMisc = clientJobs[jobId].minMisc;
            apiResponse.data.minSurfacing = clientJobs[jobId].minSurfacing;
            apiResponse.data.minThermal = clientJobs[jobId].minThermal;
            await runInAction("Updating Local Job", async () => {
                updateLocalFromAPIJobResponse(apiResponse.data);
                // clientJobs[apiResponse.data.jobId] = JSON.parse(JSON.stringify(apiResponse.data));
                if (typeof(jobId) === "string" && jobId.indexOf("new_job") >= 0) {
                    delete clientJobs[jobId];
                }
            });
            updateLocalData(['clientJobs']).then(() => {
                console.log('just saved the changes');
                console.log(clientJobs[apiResponse.data.jobId]);
                resolve();
            })
            .catch(error => {
                toastHelper(String(error));
                reject(error);
            });
        }
    });
}

/************** MATERIAL *************/

// REQUIRES: n/a
// MODIFIES: 'clientJobs', local device data
// EFFECTS: Returns an empty material object after creating a new temporary
//          key for it and saving it in clientJobs (later gets replaced by API)
//          Key Naming Convention: "new_material_" + (length of 'clientJobs' + 1)
export async function createNewMaterial(jobId: String) {

    return new Promise(async function(resolve, reject) {

        let newMaterial = JSON.parse(JSON.stringify(emptyMaterial));
        let index = 0; // Base case for first material
        let found = false;
        for (material of clientJobs[jobId].materials) {
            console.log(material.clientMaterialId);
            if (material.clientMaterialId > index) {
                index = material.clientMaterialId;
            }
        }
        index += 1;
        newMaterial.id = "new_material_" + String(index);
        newMaterial.clientMaterialId = index;
        console.log("new material id is: " + String(newMaterial.id));

        await runInAction("Adding New Material", async () => {
            clientJobs[jobId].materials.push(newMaterial);
            updateLocalData(['clientJobs']).then(() => {
                console.log('just saved the new material');
                resolve(newMaterial);
            })
            .catch(error => {
                toastHelper(String(error));
                reject(error);
            });
        });
    });
}


// REQUIRES: The latest up to date job object
// MODIFIES: clientJobs and local device memory
// EFFECTS: Syncs the user's changes to a job
export async function syncMaterialUpdate(material: Object, original: Object, jobId: String) {
    let newMaterial = JSON.parse(JSON.stringify(material))
    delete newMaterial.navigation, delete newMaterial.materialUpdate;
    clientJobs[jobId].editedOn = moment();
    for (let i = 0; i < clientJobs[jobId].materials.length; ++i){
        temp = clientJobs[jobId].materials[i];
        if (temp.id === original.id) {
            console.log('found material to update!');
            clientJobs[jobId].materials[i] = newMaterial;
            break;
        }
    }
    updateLocalData(['clientJobs']);
}

// REQUIRES: The id of the job to delete
// MODIFIES: clientJobs and the local device memory
// EFFECTS: Deletes the specified job from the device
export async function deleteMaterial(materialId: String, jobId: String) {
    console.log('beginning to delete with materialId: ' + String(materialId));
    return new Promise(async function(resolve, reject) {
        await runInAction("Removing Material", async () => {

            for (let i = 0; i < clientJobs[jobId].materials.length; i++) {
                if (clientJobs[jobId].materials[i].id === materialId) {
                    console.log('found the material to delete!');
                    console.log(clientJobs[jobId].materials[i]);
                    clientJobs[jobId].materials.splice(i, 1);
                }
            }
            updateLocalData(['clientJobs']).then(() => {
                console.log('just saved the changes');
                toastHelper("Successfully deleted material");
                resolve();
            })
            .catch(error => {
                toastHelper(String(error));
                reject(error);
            });
        });
    });
}


/************** SAMPLE *************/

// REQUIRES: The array of samples
// MODIFIES: n/a
// EFFECTS: Returns the next sample letter given the current samples
function nextSampleClientId(samples: Array) {
    let letterIndex = 0;
    if (samples.length === 0) {
        return alphabet[letterIndex];
    }
    for (sample of samples) {
        sampleIndex = alphabet.indexOf(sample.clientSampleId);
        if (sampleIndex > letterIndex) {
            letterIndex = sampleIndex;
        }
    }
    return alphabet[letterIndex + 1];
}

// REQUIRES: n/a
// MODIFIES: 'clientJobs', local device data
// EFFECTS: Returns an empty material object after creating a new temporary
//          key for it and saving it in clientJobs (later gets replaced by API)
//          Key Naming Convention: "new_material_" + (length of 'clientJobs' + 1)
export async function createNewSample(materialId: String, jobId: String) {

    return new Promise(async function(resolve, reject) {
        // Update the empty object with the user's saved preferences for
        // delivery method, name, phone, email, etc.
        let newSample = JSON.parse(JSON.stringify(emptySample));
        let materialIndex = clientJobs[jobId].materials.map(function(x) {return x.id; }).indexOf(materialId);
        let index = Object.keys(clientJobs[jobId].materials[materialIndex].samples).length;
        let found = false;
        while (!found) {
          index++;
          let match = true;
          for (let i = 0; i < clientJobs[jobId].materials[materialIndex].samples.length; ++i) {
              if ("new_sample_" + String(index) === clientJobs[jobId].materials[materialIndex].samples[i].id) {
                  match = false;
              }
          }
          found = match;
        }
        newSample.id = "new_sample_" + String(index);
        newSample.clientSampleId = nextSampleClientId(clientJobs[jobId].materials[materialIndex].samples);
        // console.log("new sample id is: " + String(newSample.id));
        // console.log(newSample);

        await runInAction("Adding New Sample", async () => {
            clientJobs[jobId].materials[materialIndex].samples.push(newSample);
            updateLocalData(['clientJobs']).then(() => {
                console.log('just saved the new sample');
                resolve(newSample);
            })
            .catch(error => {
                toastHelper(String(error));
                reject(error);
            });
        });
    });
}


// REQUIRES: The latest up to date job object
// MODIFIES: clientJobs and local device memory
// EFFECTS: Syncs the user's changes to a job
export async function syncSampleUpdate(sample: Object, materialId: String, jobId: String) {
    let newSample = JSON.parse(JSON.stringify(sample));
    delete newSample.navigation, delete newSample.materialId, delete newSample.jobId;
    delete newSample.editable, delete newSample.sampleUpdate;
    clientJobs[jobId].editedOn = moment();
    for (let i = 0; i < clientJobs[jobId].materials.length; ++i){
        tempMaterial = clientJobs[jobId].materials[i];
        if (tempMaterial.id === materialId) {
            for (let j = 0; j < clientJobs[jobId].materials[i].samples.length; ++j) {
                tempSample = clientJobs[jobId].materials[i].samples[j];
                if (tempSample.id === sample.id) {
                    clientJobs[jobId].materials[i].samples[j] = newSample;
                    break;
                }
            }
            break;
        }
    }
    updateLocalData(['clientJobs']);
}

// REQUIRES: The id of the job to delete
// MODIFIES: clientJobs and the local device memory
// EFFECTS: Deletes the specified job from the device
export async function deleteSample(sampleId: String, materialId: String, jobId: String) {
    console.log('beginning to delete with sampleId: ' + String(sampleId));
    return new Promise(async function(resolve, reject) {
        await runInAction("Removing Sample", async () => {

            let materialIndex = clientJobs[jobId].materials.map(function(x) {return x.id; }).indexOf(materialId);
            let sampleIndex = clientJobs[jobId].materials[materialIndex].samples.map(function(x) {return x.id; }).indexOf(sampleId);
            clientJobs[jobId].materials[materialIndex].samples.splice(sampleIndex, 1);
            updateLocalData(['clientJobs']).then(() => {
                console.log('just saved the changes');
                toastHelper("Successfully deleted sample");
                resolve();
            })
            .catch(error => {
                toastHelper(String(error));
                reject(error);
            });
        });
    });
}

/************** ROOMS (AHERA) *************/


// REQUIRES: n/a
// MODIFIES: 'clientJobs', local device data
// EFFECTS: Returns an empty room object after creating a new temporary
//          key for it and saving it in clientJobs (later gets replaced by API)
//          Key Naming Convention: "new_room_" + (length of 'clientJobs[jobId].materials[materialId].rooms' + 1)
export async function createNewRoom(materialId: String, jobId: String) {
    return new Promise(async function(resolve, reject) {
        let newRoom = JSON.parse(JSON.stringify(emptyRoom));
        let materialIndex = clientJobs[jobId].materials.map(function(x) {return x.id; }).indexOf(materialId);
        let index = Object.keys(clientJobs[jobId].materials[materialIndex].rooms).length;
        let found = false;
        while (!found) {
          index++;
          let match = true;
          for (let i = 0; i < clientJobs[jobId].materials[materialIndex].rooms.length; ++i) {
              console.log("new_room_" + String(index));
              if ("new_room_" + String(index) === clientJobs[jobId].materials[materialIndex].rooms[i].id) {
                  match = false;
              }
          }
          found = match;
        }
        newRoom.id = "new_room_" + String(index);

        await runInAction("Adding New Room", async () => {
            clientJobs[jobId].materials[materialIndex].rooms.push(newRoom);
            updateLocalData(['clientJobs']).then(() => {
                console.log('just saved the new room');
                resolve(newRoom);
            })
            .catch(error => {
                toastHelper(String(error));
                reject(error);
            });
        });
    });
}


// REQUIRES: The latest up to date job object
// MODIFIES: clientJobs and local device memory
// EFFECTS: Syncs the user's changes to a room
export async function syncRoomUpdate(room: Object, roomId: Number, materialId: String, jobId: String) {
    let newRoom = JSON.parse(JSON.stringify(room));
    clientJobs[jobId].editedOn = moment();
    let materialIndex = clientJobs[jobId].materials.map(function(x) {return x.id; }).indexOf(materialId);
    let roomIndex = clientJobs[jobId].materials[materialIndex].rooms.map(function(x) {return x.id; }).indexOf(roomId);
    console.log('found the room to update!');
    clientJobs[jobId].materials[materialIndex].rooms[roomIndex] = newRoom;
    updateLocalData(['clientJobs']);
}

// REQUIRES: The id of the room to delete, as well as material and job id's
// MODIFIES: clientJobs and the local device memory
// EFFECTS: Deletes the specified room from the device
export async function deleteRoom(roomId: String, materialId: String, jobId: String) {
    console.log('beginning to delete with roomId: ' + String(roomId));
    return new Promise(async function(resolve, reject) {
        await runInAction("Removing Sample", async () => {

            let materialIndex = clientJobs[jobId].materials.map(function(x) {return x.id; }).indexOf(materialId);
            let roomIndex = clientJobs[jobId].materials[materialIndex].rooms.map(function(x) {return x.id; }).indexOf(roomId);
            clientJobs[jobId].materials[materialIndex].rooms.splice(roomIndex, 1);
            updateLocalData(['clientJobs']).then(() => {
                console.log('just saved the changes');
                toastHelper("Successfully deleted room");
                resolve();
            })
            .catch(error => {
                toastHelper(String(error));
                reject(error);
            });
        });
    });
}



/************** USER PROFILE *************/


// REQUIRES: n/a
// MODIFIES: n/a
// EFFECTS: Returns true if the logged in user is from ETC, false otherwise
export function etcUser() {
    return userProfile.isetcContact;
}

// REQUIRES: 'method' the type of request (GET, POST, etc)
//           'endpoint' the url for the endpoint
//           'data' the JSON data being sent to the endpoint
// MODIFIES: ETC Database
// EFFECTS: Queries the ETC API endpoint
async function APICall(method: String, endpoint: String, data: Object) {
    return new Promise(async function(resolve, reject) {

        isConnected = await internetConnectionExists();

        if (isConnected) {
            fetch('http://labapi.2etc.com/api' + endpoint, {
                method: method,
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }).then((response) => {
              try {
                  response.data = JSON.parse(response._bodyText);
              } catch(error) {
                  console.log('');
              }
              resolve(response);
            });
        } else {
            toastHelper("No internet connection", "danger");
            resolve(undefined);
        }
    });
}

// REQUIRES: clientID (string), pin (string)
// MODIFIES: n/a
// EFFECTS: Returns boolean on whether login was successful or not
export async function login(clientId: String, pin: String) {
    return new Promise(async function(resolve, reject) {
        let endpoint = '/asbestossurvey/login';
        let userLogin = await APICall('POST', endpoint, { id: clientId, pin: pin });
        if (userLogin.status !== 200) { // 200
            toastHelper("Login Credentials Invalid.", "danger");
            resolve(false);
        } else {
            loggedIn = true;
            // userProfile = JSON.parse(JSON.stringify(mockAPIData.userData));
            userProfile = JSON.parse(JSON.stringify(userLogin.data));
            console.log(userProfile);
            updateLocalData(['loggedIn', 'userProfile']).then(async () => {
                await generateDropdownConfig(); // Updating the dropdown stuff
                resolve(true);
            });

        }
    });
}

// REQUIRES: The latest up to date profle object
// MODIFIES: userProfile and local device memory
// EFFECTS: Syncs the user's changes to their profile
export async function syncProfileUpdate(profile: Object) {
    profile.editedOn = moment();
    userProfile = JSON.parse(JSON.stringify(profile));
    updateLocalData(['userProfile']);
}

// REQUIRES: n/a
// MODIFIES: ETC database
// EFFECTS: Sends the current userProfile object to the ETC database
//          The settings page automatically updates & saves the local data
//          for user profile, so we dont need to do that again here.
export async function updateUser() {
    return new Promise(async function(resolve, reject) {
        let endpoint = '/asbestossurvey/updatecontact';
        let data = JSON.parse(JSON.stringify(userProfile));
        let updateResponse = await APICall('PUT', endpoint, data);
        console.log(updateResponse);
        if (updateResponse !== undefined && updateResponse.status !== 204) {
            console.log('here');
            toastHelper("Error saving preferences to server.", "danger");
            resolve(false);
        } else {
            console.log('there');
            resolve(true);
        }
    });

}

// REQUIRES: n/a
// MODIFIES: Local storage variable for loggedIn
// EFFECTS: Logs out the User
export function logoutUser() {
    return new Promise(async function(resolve, reject) {
        loggedIn = false;
        userProfile = null;
        lastAPICallTimestamp = null;
        clientJobs = {};
        await updateLocalData(['loggedIn', 'userProfile', 'clientJobs']);
        resolve();
    });
}


// REQUIRES: n/a
// MODIFIES: the 'materialsConfig' object
// EFFECTS: Queries the API for the latest material mappings
export function generateDropdownConfig() {
    return new Promise(async function(resolve, reject) {
        materialsConfig = { "Select...": {} }; // Ask Michael why this is here => weird Android fix
        if (userProfile === null) {
            await updateLocalData(['materialsConfig']);
            return resolve(false); // the API call function already pops up a toast for no internet connection
        }

        const response = await APICall('GET', '/asbestossurvey/data/' + userProfile.client.id);
        if (response === undefined) {
            await updateLocalData(['materialsConfig']);
            resolve(false); // the API call function already pops up a toast for no internet connection
        } else if (response.status === 200) {

            // Dropdown Config
            dropdownConfig.statusList = {};
            for (key in response.data.statusList) {
                const obj = response.data.statusList[key];
                dropdownConfig.statusList[obj.id] = titleCase(obj.status);
            }
            dropdownConfig.statusList[1] = "In Progress"; // We'll just do this because it takes time for Pablo to change things
            dropdownConfig.facilityTypeList = {};
            for (key in response.data.facilityTypeList) {
                const obj = response.data.facilityTypeList[key];
                dropdownConfig.facilityTypeList[obj.id] = titleCase(obj.description);
            }
            dropdownConfig.turnaroundList = {};
            for (key in response.data.turnaroundList) {
                const obj = response.data.turnaroundList[key];
                dropdownConfig.turnaroundList[obj.value] = titleCase(obj.description);
            }
            dropdownConfig.inspectorsList = {};
            for (key in response.data.inspectorsList) {
                const obj = response.data.inspectorsList[key];
                dropdownConfig.inspectorsList[obj.name] = titleCase(obj.id);
            }
            dropdownConfig.plannersList = {};
            for (key in response.data.plannersList) {
                const obj = response.data.plannersList[key];
                dropdownConfig.plannersList[obj.name] = titleCase(obj.id);
            }

            // Materials Config
            for (row of response.data.mappings) {
                let materialName = row.material;
                let materialSubName = row.materialSub;
                if (materialsConfig[materialName] === undefined) {
                    materialsConfig[materialName] = {
                        // materialNumber: 1, // DEV
                        materialSubs: {}
                    };
                }
                if (materialsConfig[materialName].materialSubs[materialSubName] === undefined) {
                    materialsConfig[materialName].materialSubs[materialSubName] = {
                        friable: row.friable,
                        classification: row.classification,
                        units: row.units
                    };
                }
            }
            await updateLocalData(['materialsConfig', 'dropdownConfig']);
            resolve(true);
        } else {
            toastHelper("Issue updating Material Mappings", "danger");
            resolve(false);
        }

    });

}

// REQUIRES: The latest up to date profle object
// MODIFIES: userProfile and local device memory
// EFFECTS: Syncs the user's changes to their profile
export async function syncWalkthroughUpdate(seen: Boolean) {
    return new Promise(async function(resolve, reject) {
        seenWalkthrough = seen;
        updateLocalData(['seenWalkthrough']).then(() => {
          console.log('we saw walkthrough!');
          resolve();
        })
        .catch(error => {
            console.log(error);
            toastHelper("Walkthrough view was not saved");
        });
    });
}

// REQUIRES: message (string) to be displayed on toast
// MODIFIES: The device's screen
// EFFECTS: Displays a toast on the device
export function toastHelper(message: String, type?: String) {
    toastArgs = {
        text: message,
        position: 'bottom',
        buttonText: 'Dismiss',
        duration: 4000,
        style: {
            minHeight: moderateScale(50),
            padding: moderateScale(10)
        },
        textStyle: {
            fontSize: moderateScale(16),
            lineHeight: moderateScale(20)
        }
    }
    if (type) {
        toastArgs.type = type;
    }
    Toast.show(toastArgs);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function titleCase(str: String) {
    str = String(str);
    return str.toLowerCase().split(' ').map(function(word) {
      return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
}




// function to push all updates to ETC
// loops through the jobs in the Mobx object and calls the POST endpoint (if necessary)
