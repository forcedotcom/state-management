import { defineState } from 'lightning/lwcState';
import smRecord from 'lightning/stateManagerRecord';
import smLayout from 'lightning/stateManagerLayout';

/**
 * Extracts the field values referenced by a layout.
 * 
 * @param {*} layout layout definition
 * @returns fields referenced by the layout, as a string[]
 */
function extractFields(layout) {
    if (! layout) {
        return;
    }

    const fields = [];

    for (const section of layout.sections) {
        for (const row of section.layoutRows) {
            for (const item of row.layoutItems) {
                for (const component of item.layoutComponents) {
                    if (component.componentType === 'Field') {
                        fields.push(`${layout.objectApiName}.${component.apiName}`);
                    }
                }
            }
        }
    }

    return fields;
}

// Define the state manager
export default defineState(({ atom, computed, setAtom }) => {
     // A recordId and objectApiName (both strings) can be specified when the state
     // manager is created. These values can also be set/changed later using the
     // state manager's setRecordId & setObjectApiName actions.
    return (recordId, objectApiName) => {
        // This atom caputres the current configuration of the state manager instance.
        // We wrap it in an atom to make it easier for other data to react to changes
        // in the config, but it is NOT exposed as one of the properties of this state
        // manager.
        const config = atom({ recordId, objectApiName });

        // actions to set/change the config
        const setRecordId = (recordId) => setAtom(config, { recordId, objectApiName: config.value.objectApiName });
        const setObjectApiName = (objectApiName) => setAtom(config, { recordId: config.value.recordId, objectApiName });

        // The following constructs implement a data waterfall that corresponds roughly
        // to what happens in a layout-driven detail panel like you see on record home.
        // The real detail panel is obviously FAR more complex; this is just a VERY
        // simplified version of the data logic from that component.
        //
        // 1. The recordId and objectApiName supplied as config to this state manager are
        //    used to retrieve a minimal copy of the record so that we can find its
        //    recordTypeId.
        // 2. The objectApiName and recordTypeId from (1) are used to retrieve the layout
        //    that should be used for the record.
        // 3. The recordId, objectApiName, and fields referenced in the layout are used
        //    to retrieve a complete copy of the record that can be displayed.

        // initialRecord is a nested state manager that we use to retrieve the minimal copy
        // of the record (step 1 above). We use computed() here so that the configuration
        // for smRecord will automatically be updated anytime the config changes.
        const initialRecord = smRecord(computed([ config ], () => {
            // If the state manager does not yet have a recordId or objectApiName then
            // pass an empty config to smRecord; the empty config will cause smRecord to wait.
            if (! config.value.recordId || ! config.value.objectApiName) {
                return {};
            }

            // Once we have recordId & objectApiName, tell smRecord to get the record. We ask
            // for the Id field here because we are required to specify something. The data
            // we really want (the recordTypeId) is included by default.
            return {
                recordId: config.value.recordId,
                fields: [ `${config.value.objectApiName}.Id` ],
            };
        }));

        // layout is another nested state manager that we use to retrieve the layout. Its inputs
        // are derived from the output of initialRecord, so we use computed() to update
        // the config every time initialRecord changes.
        const layout = smLayout(computed([ initialRecord ], () => {
            // If initialRecord has not retrieved the record yet then return an empty config
            // so smLayout will wait.
            if (! initialRecord.value.data) {
                return {};
            }

            // Once initialRecord has data available, use its apiName & recordTypeId to ask
            // for the Compact View layout.
            return {
                objectApiName: initialRecord.value.data.apiName,
                recordTypeId: initialRecord.value.data.recordTypeId,
                layoutType: 'Compact',
                mode: 'View',
            }
        }));

        // finalRecord is used to retrieve the full set of field values that the layout needs.
        // We use computed() here so that the config this second smRecord will be re-evaluated
        // whenever initialRecord or layout changes.
        const finalRecord = smRecord(computed([ initialRecord, layout ], () => {
            // As above, tell smRecord to wait if we don't have the necessary information
            // yet.
            if (! initialRecord.value.data || ! layout.value.data) {
                return {};
            }

            // Once we have all the information, ask for all the layout's fields for the
            // record.
            return {
                recordId: initialRecord.value.data.id,
                fields: extractFields(layout.value.data),
            }
        }));

        // data is a just a more consumable form of the field values in finalRecord. As such,
        // we want to update it every time finalRecord changes.
        const data = computed([ finalRecord ], () => {
            if (! finalRecord.value.data) {
                return;
            }

            const fieldValues = {};
            for (const [ field, value ] of Object.entries(finalRecord.value.data.fields)) {
                fieldValues[field] = value.displayValue || value.value;
            }

            return fieldValues;
        });

        // error is simply an aggregation of errors from initialRecord, layout, and finalRecord.
        const error = computed([ initialRecord, layout, finalRecord ], () => {
            return initialRecord.value.error ||
                layout.value.error ||
                finalRecord.value.error;
        });

        // status is used to let consumers of this state manager understand what's going on
        const status = computed([ initialRecord, layout, finalRecord ], () => {
            // We configure initialRecord as soon as this state manager is configured, so we
            // can assume its "unconfigured" status means that this state manager is also
            // unconfigured.
            if (initialRecord.value.status === 'unconfigured') {
                return 'unconfigured';
            }
            // any errors => error
            else if (initialRecord.value.status === 'error' ||
                layout.value.status === 'error' ||
                finalRecord.value.status === 'error') {
                return 'error';
            }
            // everything loaded => loaded
            else if (initialRecord.value.status === 'loaded' &&
                layout.value.status === 'loaded' &&
                finalRecord.value.status === 'loaded') {
                return 'loaded';
            }
            // other status combinations mean something is still loading
            else {
                return 'loading';
            }
        });

        // This is the external shape that consumers of this state manager will see.
        return {
            // data properties
            data,
            error,
            status,

            // actions
            setObjectApiName,
            setRecordId,
        };
    }
});
