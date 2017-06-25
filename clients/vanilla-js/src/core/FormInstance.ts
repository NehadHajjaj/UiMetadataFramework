import * as umf from "./ui-metadata-framework/index";

export class FormInstance {
    public readonly metadata: umf.FormMetadata;
    public outputFieldValues: Array<OutputFieldValue> = [];
    public inputFieldValues: Array<InputFieldValue> = [];

    constructor(metadata: umf.FormMetadata) {
        this.metadata = metadata;

        for (let fieldMetadata of metadata.inputFields) {
            this.inputFieldValues.push({
                metadata: fieldMetadata,
                data: null
            });
        }
    }

    setOutputFieldValues(response: umf.FormResponse) {
        var fields = Array<OutputFieldValue>();

        var normalizedResponse = this.getNormalizedObject(response);

        for (let field of this.metadata.outputFields) {
            fields.push({
                metadata: field,
                data: normalizedResponse[field.id.toLowerCase()]
            });
        }

        fields.sort((a: OutputFieldValue, b: OutputFieldValue) => {
            return a.metadata.orderIndex - b.metadata.orderIndex;
        })

        this.outputFieldValues = fields;
    }

    getData(): any {
        var data = {};

        for (let inputField of this.inputFieldValues) {
            if (inputField.data != null) {
                data[inputField.metadata.id] = inputField.data;
            }
        }

        return data;
    }

    private getNormalizedObject(response: umf.FormResponse): any {
        var normalizedResponse = {};
        for (let field in response) {
            if (response.hasOwnProperty(field) && field !== "responseHandler") {
                normalizedResponse[field.toLowerCase()] = response[field];
            }
        }

        return normalizedResponse;
    }
}

export class InputFieldValue {
    public metadata: umf.InputFieldMetadata;
    public data: any;
}

export class OutputFieldValue {
    public metadata: umf.OutputFieldMetadata;
    public data: any;
}