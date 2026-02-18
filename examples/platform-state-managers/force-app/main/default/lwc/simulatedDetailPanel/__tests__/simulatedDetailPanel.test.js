import SimulatedDetailPanel from 'c/simulatedDetailPanel';
import detailPanelStateManager from 'c/detailPanelStateManager';
import { createElement } from 'lwc';
import { stateManagerInstanceMock } from '@lwc/state-test-utils';

jest.mock('c/detailPanelStateManager', () => ({
    __esModule: true,
    default: jest.fn(),
}));

function getState(element) {
    return JSON.parse(element.shadowRoot.querySelector('textarea').textContent);
}

describe('c-simulated-detail-panel', () => {
    let stateManager;

    beforeEach(() => {
        detailPanelStateManager.mockClear();

        stateManager = stateManagerInstanceMock({
            data: undefined,
            error: undefined,
            status: 'unconfigured',
            setObjectApiName: jest.fn(),
            setRecordId: jest.fn(),
        });
        detailPanelStateManager.mockReturnValueOnce(stateManager);
    });

    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('initializes to an empty state', async () => {
        const element = createElement('c-simulated-detail-panel', {
            is: SimulatedDetailPanel
        });
        document.body.appendChild(element);
        await Promise.resolve();

        expect(getState(element)).toEqual({
            status: 'unconfigured',
            data: undefined,
            error: undefined,
        });
    });

    it('sets state manager configuration when the Set button is clicked', async () => {
        const element = createElement('c-simulated-detail-panel', {
            is: SimulatedDetailPanel
        });
        document.body.appendChild(element);
        await Promise.resolve();

        const [ objectApiNameInput, recordIdInput ] = element.shadowRoot.querySelectorAll('lightning-input');

        objectApiNameInput.value = 'Account';
        recordIdInput.value = '001xx0000000001AAA';

        element.shadowRoot.querySelector('lightning-button').click();

        expect(stateManager.value.setObjectApiName).toHaveBeenCalledTimes(1);
        expect(stateManager.value.setObjectApiName).toHaveBeenCalledWith('Account');

        expect(stateManager.value.setRecordId).toHaveBeenCalledTimes(1);
        expect(stateManager.value.setRecordId).toHaveBeenCalledWith('001xx0000000001AAA');
    });

    it('re-renders when state manager data changes', async () => {
        const element = createElement('c-simulated-detail-panel', {
            is: SimulatedDetailPanel
        });
        document.body.appendChild(element);
        await Promise.resolve();

        const expected = {
            status: 'loaded',
            data: {
                Name: 'Test Account',
            },
            error: undefined,
        };
        await stateManager.updateValue({
            ...stateManager.value,
            ...expected,
        });

        expect(getState(element)).toEqual(expected);
    });
});