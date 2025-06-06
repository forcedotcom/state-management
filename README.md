# README

## State Management for Lightning Web Components

State Management in Lightning Web Components (LWC) is a feature designed to help developers manage data and its related logic more effectively within their applications. State management provides a structured way to handle application state, making it easier to share data across components, manage complex data interactions, and separate data concerns from presentation logic.

:::important
State management is available as a developer preview. State management isn’t generally available unless or until Salesforce announces its general availability in documentation or in press releases or public statements. All commands, parameters, and other features are subject to change or deprecation at any time, with or without notice. Don't implement functionality developed with these commands or tools.

I agree that my participation and the participation of my organization and its Affiliates in this Developer Preview Program is subject to the Main Services Agreement for Developer Services and the Developer Terms of Use, including any applicable content, usage guides, or policies provided by Salesforce, and that any information disclosed by Salesforce as part of the Developer Preview Program is Salesforce Confidential Information. I acknowledge that Developer Preview Programs are provided AS IS, exclusive of any warranty or support, can contain bugs or errors, are provided for evaluation and testing purposes, are not intended for production use, are not necessarily made generally available, and can be discontinued at any time.
:::

This repository includes two complete code samples for using state management features in your LWC code.

### Example: `platform-state-managers`

This simple example provides a minimal implementation of a state manager. It demonstrates how to define a state manager, how to use it to retrieve Salesforce metadata and data, and how to display state manager data in your LWC user interface. 

This is the example from which to learn the basics of state management, and how to use it with Salesforce. It's copiously commented, explaining what each part does. The primary implementation is in [the JavaScript file for the `detailPanelStateManager` component](examples/platform-state-managers/force-app/main/default/lwc/detailPanelStateManager). The `simulatedDetailPanel` is a minimal UI component designed to initiate activity in the state manager, and then display the resulting data. 

### Example: `simple-store`

Despite the "simple" in the name, this example is a more complex code sample. It provides a set of related components that demonstrate using a state manager to maintain the state of a shopping cart in a simple online store. Rather than retrieving data from Salesforce, it shows how to build and manipulate local data that isn't ready to be sent to a server yet, but still needs coherent logic to ensure correct, always current information is displayed.

`simple-store` is formatted as a stand-alone LWC project, rather than a Salesforce DX project, making it suitable for running in a local or remote development context that doesn't have a connection with Salesforce. This example was demonstrated publicly at TDX in March 2025 running on [StackBlitz](https://stackblitz.com/).
