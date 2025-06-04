import { LightningElement } from 'lwc';
import detailPanelStateManager from 'force/detailPanelStateManager';
// TODO
// import detailPanelStateManager from 'c/detailPanelStateManager';

export default class simulatedDetailPanel extends LightningElement {
    state = detailPanelStateManager();

    setConfig() {
        this.state.value.setObjectApiName(this.refs.objectApiName.value);
        this.state.value.setRecordId(this.refs.recordId.value);
    }

    get stateDump() {
        return JSON.stringify(this.state.value, null, 2);
    }
}
