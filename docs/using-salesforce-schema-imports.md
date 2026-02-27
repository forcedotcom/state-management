# Examples for using @salesforce/schema imports in State Managers

State Managers work with the existing @salesforce/schema import mechanism for Object and Field data. This provides the following benefits: 

> Salesforce verifies that the objects and fields exist, prevents objects and fields from being deleted, and cascades any renamed objects and fields into your component's source code. It also ensures that dependent objects and fields are included in change sets and packages. Importing references to objects and fields ensures that your code works, even when object and field names change.

## References
[@salesforce/schema](https://developer.salesforce.com/docs/platform/lwc/guide/reference-salesforce-modules.html#salesforceschema)

[Import References to Salesforce Objects and Fields](https://developer.salesforce.com/docs/platform/lwc/guide/data-wire-service-about.html#import-references-to-salesforce-objects-and-fields)

# Using @salesforce/schema imports example

```
import { defineState } from '@lwc/state';
import smRecord from 'lightning/stateManagerRecord';
import ACCOUNT from "@salesforce/schema/Account";
import NAME_FIELD from "@salesforce/schema/Account.Name";
import CUSTOM_OBJECT from "@salesforce/schema/CustomObject__c"
import CUSTOM_FIELD from "@salesforce/schema/CustomObject__c.CustomField__c";


const recordSM = defineState(() => {
            const accountRecord = smRecord({recordId: '001xx000003GYiCAAW', optionalFields: [`${ACCOUNT.objectApiName}.${NAME_FIELD.fieldApiName}`]}, {}); // Account.Name
            const customObjectRecord = smRecord({recordId: 'a00xx000000bnfRAAQ', optionalFields: [`${CUSTOM_OBJECT.objectApiName}.${CUSTOM_FIELD.fieldApiName}`]}, {}); // CustomObject__c.CustomField__c
    return {
        accountRecord,
        customObjectRecord
    };
});
```
