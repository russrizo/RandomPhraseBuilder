"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ajv_1 = __importDefault(require("ajv"));
var jsonSchema04 = require("ajv/lib/refs/json-schema-draft-04.json");
var jsonSchema06 = require("ajv/lib/refs/json-schema-draft-06.json");
var schema = require("./schema/sentence-schema.json");
var ajv = ajv_1.default({
    allErrors: true,
    jsonPointers: true,
    schemaId: 'auto',
}).addMetaSchema(jsonSchema04)
    .addMetaSchema(jsonSchema06);
exports.validator = ajv.compile(schema);
//# sourceMappingURL=phrase-validator.js.map