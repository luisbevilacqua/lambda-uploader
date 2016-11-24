'use babel';

import LambdaUploaderView from './lambda-uploader-view';
import { CompositeDisposable } from 'atom';

export default {

  lambdaUploaderView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.lambdaUploaderView = new LambdaUploaderView(state.lambdaUploaderViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.lambdaUploaderView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'lambda-uploader:upload': () => this.upload(),
      'lambda-uploader:build': () => this.build()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.lambdaUploaderView.destroy();
  },

  serialize() {
    return {
      lambdaUploaderViewState: this.lambdaUploaderView.serialize()

    };
  },

  build() {
    var exec = require("child_process").exec;
    var editor = atom.workspace.getActivePaneItem();
    var projectPath = atom.project.getPaths()[0];
    atom.notifications.addInfo("Running \"npm run build\" this may take a while",
      {detail: "You can go take some coffee while we're getting this done"})
    exec("cd " + projectPath + " && \
      npm run build",
      (error, stdout, stderr) => {
        if (error !== null) {
          atom.notifications.addError("There was an error building the lambda files", {detail: stderr})
        }
        else{
          atom.notifications.addSuccess("Build Successfully!");
        }
      }
    );
  },

  upload() {
    var exec = require("child_process").exec;
    var editor = atom.workspace.getActivePaneItem();
    var projectPath = atom.project.getPaths()[0];
    var file = editor.buffer.file;
    var fileName = file.getBaseName();
    var lambdaName = fileName.split(/-|\./)[0].toUpperCase() + "-" + fileName.split(/-|\./)[1];

    exec("cd " + projectPath + "/dist/ && \
      zip -FSr " + fileName + ".zip " + fileName + " && \
      aws lambda update-function-code --function-name " + lambdaName + " --zip-file fileb://" + fileName + ".zip",
      (error, stdout, stderr) => {
        if (error !== null) {
          atom.notifications.addError("There was an error uploading the lambda file", {detail: stderr})
        }
        else{
          atom.notifications.addSuccess("Successfully updated " + lambdaName, {detail: stdout});
        }
      }
    );
  }
};
