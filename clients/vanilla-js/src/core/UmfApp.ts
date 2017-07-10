﻿import { FormMetadata, FormResponse } from "./ui-metadata-framework/index";
import { UmfServer } from "./UmfServer";
import { FormInstance } from "./FormInstance";
import { IFormResponseHandler } from "./IFormResponseHandler";
import { InputFieldValue } from "./InputFieldValue";
import { InputControllerRegister } from "./InputControllerRegister";

export class UmfApp {
	forms: FormMetadata[];
	private readonly formsById: { [id: string]: FormMetadata } = {};
	public readonly server: UmfServer;
	public readonly formResponseHandlers: { [id: string]: IFormResponseHandler } = {};
	public go: (form: string, inputFieldValues: InputFieldValue[]) => void;
	public makeUrl: (form: string, values) => string;
	public inputControllerRegister: InputControllerRegister;

	constructor(server: UmfServer, inputRegister: InputControllerRegister) {
		this.server = server;
		this.inputControllerRegister = inputRegister;
	}

	registerResponseHandler(handler: IFormResponseHandler) {
		this.formResponseHandlers[handler.name] = handler;
	}

	load() {
		return this.server.getAllMetadata()
			.then(response => {
				this.forms = response;

				for (let form of this.forms) {
					this.formsById[form.id] = form;
				}
			});
	}

	getForm(id: string) {
		return this.formsById[id];
	}

	getFormInstance(formId: string) {
		let metadata = this.getForm(formId);

		if (metadata == null) {
			console.error(`Form ${formId} not found.`);
			return;
		}

		return new FormInstance(metadata, this.inputControllerRegister);
	}

	handleResponse(response: FormResponse, form: FormInstance) {
		var handler = this.formResponseHandlers[response.responseHandler];

		if (handler == null) {
			throw new Error(`Cannot find FormResponseHandler "${response.responseHandler}".`);
		}

		return handler.handle(response, form);
	}
}

export * from "./ui-metadata-framework/index";