import { WorkspaceController } from './controllers/WorkspaceController.js';

document.addEventListener('DOMContentLoaded', startNote);

function startNote(){
    new WorkspaceController();
}