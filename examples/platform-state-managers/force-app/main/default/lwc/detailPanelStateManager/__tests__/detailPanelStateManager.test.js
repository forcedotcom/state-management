import detailPanelStateManager from '../detailPanelStateManager';
import smRecord from 'lightning/stateManagerRecord';
import smLayout from 'lightning/stateManagerLayout';

const recordId = '001xx0000000000AAA';
const objectApiName = 'Account';

describe('detailPanelStateManager', () => {
    // config objects that were passed to the nested state managers
    let initialRecordConfig, layoutConfig, finalRecordConfig;

    // mock nested state managers
    let initialRecord, layout, finalRecord;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Creates a detailPanelStateManager and extracts the configs and nested state managers
    // from it. Note that the configs are all computed()s so while the refences will remain
    // constant, we'll use .value to get the current values in the tests.
    function createDetailPanelStateManager(...params) {
        const stateManager = detailPanelStateManager(...params);

        initialRecordConfig = smRecord.mock.calls[0]?.[0];
        initialRecord = smRecord.mock.results[0].value;

        layoutConfig = smLayout.mock.calls[0]?.[0];
        layout = smLayout.mock.results[0].value;

        finalRecordConfig = smRecord.mock.calls[1]?.[0];
        finalRecord = smRecord.mock.results[1].value;

        return stateManager;
    }

    it('initializes with default values', () => {
        const stateManager = createDetailPanelStateManager();

        // configs for nested state managers should be empty since we didn't provide recordId or objectApiName
        expect(initialRecordConfig.value).toEqual({});
        expect(layoutConfig.value).toEqual({});
        expect(finalRecordConfig.value).toEqual({});
        
        // state manager should be in unconfigured status since we didn't provide recordId or objectApiName
        expect(stateManager.value.data).toBeUndefined();
        expect(stateManager.value.error).toBeUndefined();
        expect(stateManager.value.status).toBe('unconfigured');
    });

    describe('initialRecord config', () => {
        it.each([
            // initialRecordId, initialObjectApiName, expectedInitialRecordConfig
            [ recordId, undefined, {} ],
            [ undefined, objectApiName, {} ],
            [ recordId, objectApiName, { recordId, fields: [ `${objectApiName}.Id` ] } ],
        ])('sets initialRecord config: detailPanelStateManager(%s, %s)', (initialRecordId, initialObjectApiName, expectedInitialRecordConfig) => {
            const stateManager = createDetailPanelStateManager(initialRecordId, initialObjectApiName);
            
            expect(initialRecordConfig.value).toEqual(expectedInitialRecordConfig);
        });

        it.each([
            // initialRecordId, initialObjectApiName, newRecordId, expectedInitialRecordConfig
            [ undefined, undefined, undefined, {} ],
            [ undefined, undefined, recordId, {} ],
            [ undefined, objectApiName, undefined, {} ],
            [ undefined, objectApiName, recordId, { recordId, fields: [ `${objectApiName}.Id` ] } ],
            [ recordId, undefined, undefined, {} ],
            [ recordId, undefined, recordId, {} ],
            [ recordId, objectApiName, undefined, {} ],
            [ recordId, objectApiName, recordId, { recordId, fields: [ `${objectApiName}.Id` ] } ],
            [ recordId, objectApiName, '001xx0000000001AAA', { recordId: '001xx0000000001AAA', fields: [ `${objectApiName}.Id` ] } ],
        ])('updates initialRecord config: detailPanelStateManager(%s, %s), setRecordId(%s)', (initialRecordId, initialObjectApiName, newRecordId, expectedInitialRecordConfig) => {
            // create state manager with initial values
            const stateManager = createDetailPanelStateManager(initialRecordId, initialObjectApiName);

            // update the recordId
            stateManager.value.setRecordId(newRecordId);

            // check initialRecordConfig after update
            expect(initialRecordConfig.value).toEqual(expectedInitialRecordConfig);
        });

        it.each([
            // initialRecordId, initialObjectApiName, newObjectApiName, expectedInitialRecordConfig
            [ undefined, undefined, undefined, {} ],
            [ undefined, undefined, objectApiName, {} ],
            [ undefined, objectApiName, undefined, {} ],
            [ undefined, objectApiName, objectApiName, {} ],
            [ recordId, undefined, undefined, {} ],
            [ recordId, undefined, objectApiName,  { recordId, fields: [ `${objectApiName}.Id` ] }],
            [ recordId, objectApiName, undefined, {} ],
            [ recordId, objectApiName, objectApiName, { recordId, fields: [ `${objectApiName}.Id` ] } ],
            [ recordId, objectApiName, 'Contact', { recordId, fields: [ 'Contact.Id' ] } ],
        ])('updates initialRecord config: detailPanelStateManager(%s, %s), setObjectApiName(%s)', (initialRecordId, initialObjectApiName, newObjectApiName, expectedInitialRecordConfig) => {
            // create state manager with initial values
            const stateManager = createDetailPanelStateManager(initialRecordId, initialObjectApiName);

            // update the objectApiName
            stateManager.value.setObjectApiName(newObjectApiName);

            // check initialRecordConfig after update
            expect(initialRecordConfig.value).toEqual(expectedInitialRecordConfig);
        });
    });

    describe('layout config', () => {
        it('sets layout config when initialRecord data is available', async () => {
            const stateManager = createDetailPanelStateManager(recordId, objectApiName);

            // layout config not set yet
            expect(layoutConfig.value).toEqual({});

            // layout config should be updated when initialRecord gets data
            await initialRecord.updateValue({
                ...initialRecord.value,
                status: 'loaded',
                data: { id: recordId, apiName: objectApiName, recordTypeId: '012xx000000000AAA' },
                error: undefined,
            })

            // layout config should be set
            expect(layoutConfig.value).toEqual({
                objectApiName,
                recordTypeId: '012xx000000000AAA',
                layoutType: 'Compact',
                mode: 'View',
            });
        });

        it('resets layout config when initialRecord data becomes unavailable', async () => {
            const stateManager = createDetailPanelStateManager(recordId, objectApiName);

            // initialRecord loaded
            await initialRecord.updateValue({
                ...initialRecord.value,
                status: 'loaded',
                data: { id: recordId, apiName: objectApiName, recordTypeId: '012xx000000000AAA' },
                error: undefined,
            })

            // layout config should be set
            expect(layoutConfig.value).toEqual({
                objectApiName,
                recordTypeId: '012xx000000000AAA',
                layoutType: 'Compact',
                mode: 'View',
            });

            // initialRecord now unavailable
            await initialRecord.updateValue({
                ...initialRecord.value,
                status: 'loading',
                data: undefined,
                error: undefined,
            })

            // layout config should be reset
            expect(layoutConfig.value).toEqual({});
        });
    });

    describe('finalRecord config', () => {
        it('sets finalRecord config when initialRecord and layout data are available', async () => {
            const stateManager = createDetailPanelStateManager(recordId, objectApiName);

            // finalRecord config not set yet
            expect(finalRecordConfig.value).toEqual({});
            
            // initialRecord loaded
            await initialRecord.updateValue({
                ...initialRecord.value,
                status: 'loaded',
                data: { id: recordId, apiName: objectApiName, recordTypeId: '012xx000000000AAA' },
                error: undefined,
            });

            // finalRecord config should still not be set since layout doesn't have data yet
            expect(finalRecordConfig.value).toEqual({});

            // layout loaded
            await layout.updateValue({
                ...layout.value,
                status: 'loaded',
                data: {
                    objectApiName,
                    sections: [{
                        layoutRows: [{
                            layoutItems: [{
                                layoutComponents: [{
                                    componentType: 'Field',
                                    apiName: 'Name',
                                }, {
                                    componentType: 'Field',
                                    apiName: 'Industry',
                                }, {
                                    componentType: 'Other',
                                    apiName: 'NotAField',
                                }],
                            }]
                        }]
                    }]
                },
                error: undefined,
            });

            // finalRecord config should be set
            expect(finalRecordConfig.value).toEqual({
                recordId,
                fields: [ 'Account.Name', 'Account.Industry' ],
            });
        });

        describe('data', () => {
            it('includes field data from finalRecord, preferring displayValue over value', async () => {
                const stateManager = createDetailPanelStateManager(recordId, objectApiName);

                // finalRecord loaded
                await finalRecord.updateValue({
                    ...finalRecord.value,
                    status: 'loaded',
                    data: {
                        fields: {
                            Name: { value: 'Not Used', displayValue: 'Test Account' },
                            Industry: { value: 'Technology', displayValue: undefined },
                        }
                    },
                    error: undefined,
                });

                // data should be set with displayValue preferred over value
                expect(stateManager.value.data).toEqual({
                    Name: 'Test Account',
                    Industry: 'Technology',
                });
            });
        });

        describe('error', () => {
            it.each([
                // initialRecord error, layout error, finalRecord error, expected error
                [ 'initialRecord error' , 'layout error', 'finalRecord error', 'initialRecord error' ],
                [ undefined, 'layout error', 'finalRecord error', 'layout error' ],
                [ undefined, undefined, 'finalRecord error', 'finalRecord error' ],
                [ undefined, undefined, undefined, undefined ],
            ])('aggregates errors from nested state managers: (%s, %s, %s)', async (initialRecordError, layoutError, finalRecordError, expected) => {
                const stateManager = createDetailPanelStateManager(recordId, objectApiName);

                await Promise.all([
                    // set nested state managers errors
                    initialRecord.updateValue({
                        ...initialRecord.value,
                        error: initialRecordError,
                    }),
                    layout.updateValue({
                        ...layout.value,
                        error: layoutError,
                    }),
                    finalRecord.updateValue({
                        ...finalRecord.value,
                        error: finalRecordError,
                    }),
                ]);

                expect(stateManager.value.error).toEqual(expected);
            });
        });

        describe('status', () => {
            it.each([
                // initialRecord status, layout status, finalRecord status, expected status
                [ 'unconfigured', 'dont-care', 'dont-care', 'unconfigured' ],
                [ 'error', 'dont-care', 'dont-care', 'error' ],
                [ 'dont-care', 'error', 'dont-care', 'error' ],
                [ 'dont-care', 'dont-care', 'error', 'error' ],
                [ 'loaded', 'loaded', 'loaded', 'loaded' ],
                [ 'dont-care', 'dont-care', 'dont-care', 'loading' ],
            ])('aggregates status from nested state managers: (%s, %s, %s)', async (initialRecordStatus, layoutStatus, finalRecordStatus, expected) => {
                const stateManager = createDetailPanelStateManager(recordId, objectApiName);

                await Promise.all([
                    // set nested state manager status values
                    initialRecord.updateValue({
                        ...initialRecord.value,
                        status: initialRecordStatus,
                    }),
                    layout.updateValue({
                        ...layout.value,
                        status: layoutStatus,
                    }),
                    finalRecord.updateValue({
                        ...finalRecord.value,
                        status: finalRecordStatus,
                    }),
                ]);

                expect(stateManager.value.status).toEqual(expected);
            });
        });
    });

    it('works end-to-end', async () => {
        const stateManager = createDetailPanelStateManager(recordId, objectApiName);

        // initial state
        expect(stateManager.value.status).toBe('unconfigured');
        expect(stateManager.value.data).toBeUndefined();
        expect(stateManager.value.error).toBeUndefined();

        // set recordId and objectApiName to trigger the data waterfall flow
        stateManager.value.setRecordId(recordId);
        stateManager.value.setObjectApiName(objectApiName);

        // initialRecord should be configured with recordId and objectApiName
        expect(initialRecordConfig.value).toEqual({
            recordId,
            fields: [ `${objectApiName}.Id` ],
        });

        // initialRecord begins loading
        await initialRecord.updateValue({
            ...initialRecord.value,
            status: 'loading',
        });

        // state manager should switch to loading status
        expect(stateManager.value.status).toBe('loading');

        // initialRecord loaded
        await initialRecord.updateValue({
            ...initialRecord.value,
            status: 'loaded',
            data: { id: recordId, apiName: objectApiName, recordTypeId: '012xx000000000AAA' },
            error: undefined,
        });

        // layout should be configured
        expect(layoutConfig.value).toEqual({
            objectApiName,
            recordTypeId: '012xx000000000AAA',
            layoutType: 'Compact',
            mode: 'View',
        });
        
        // layout loaded
        await layout.updateValue({
            ...layout.value,
            status: 'loaded',
            data: {
                objectApiName,
                sections: [{
                    layoutRows: [{
                        layoutItems: [{
                            layoutComponents: [{
                                componentType: 'Field',
                                apiName: 'Name',
                            }, {
                                componentType: 'Field',
                                apiName: 'Industry',
                            }, {
                                componentType: 'Other',
                                apiName: 'NotAField',
                            }],
                        }]
                    }]
                }]
            },
            error: undefined,
        });

        // finalRecord should be configured
        expect(finalRecordConfig.value).toEqual({
            recordId,
            fields: [ 'Account.Name', 'Account.Industry' ],
        });
        
        // finalRecord loaded
        await finalRecord.updateValue({
            ...finalRecord.value,
            status: 'loaded',
            data: {
                fields: {
                    Name: { value: 'Not Used', displayValue: 'Test Account' },
                    Industry: { value: 'Technology', displayValue: undefined },
                }
            },
            error: undefined,
        });
        
        // state manager's final state
        expect(stateManager.value.status).toBe('loaded');
        expect(stateManager.value.data).toEqual({
            Name: 'Test Account',
            Industry: 'Technology',
        });
        expect(stateManager.value.error).toBeUndefined();
    });
});
