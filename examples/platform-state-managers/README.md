# Platform State Manager: An LWC State Manager Example

This example provides a minimal implementation of a state manager. It demonstrates how to define a state manager, how to use it to retrieve Salesforce metadata and data, and how to display state manager data in your LWC user interface.

This example is packaged as a Salesforce DX project, and is intended to be run in a Salesforce Developer or Sandbox org.

The interesting portion of this example is [the JavaScript file for the `detailPanelStateManager` component](force-app/main/default/lwc/detailPanelStateManager). It implements a minimal state manager that is capable of retrieving record data for a given record ID. It first retrieves layout metadata to get a list of fields for the record and record type, and then retrieves the record data. Copious comments guide you through the implementation. 

The remainder of the example lets you enter a record ID, and displays a plain text representation of the retrieved record data.

## Salesforce DX Project: Next Steps

If you want to experiment with `platform-state-managers` in your own Salesforce org, as a Salesforce DX project, what’s next? 

First, we recommend you limit use of state management to Developer or Sandbox orgs while the feature is in Developer Preview. 

Next, here are some documentation resources to get you started.

### How Do You Plan to Deploy Your Changes?

Do you want to deploy a set of changes, or create a self-contained application? Choose a [development model](https://developer.salesforce.com/tools/vscode/en/user-guide/development-models).

### Configure Your Salesforce DX Project

The `sfdx-project.json` file contains useful configuration information for your project. See [Salesforce DX Project Configuration](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_ws_config.htm) in the _Salesforce DX Developer Guide_ for details about this file.

### Read All About It

- [Salesforce Extensions Documentation](https://developer.salesforce.com/tools/vscode/)
- [Salesforce CLI Setup Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_intro.htm)
- [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm)
- [Salesforce CLI Command Reference](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference.htm)
