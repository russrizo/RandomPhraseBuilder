import Ajv from 'ajv';
import jsonSchema04 = require('ajv/lib/refs/json-schema-draft-04.json');
import jsonSchema06 = require('ajv/lib/refs/json-schema-draft-06.json');
import schema = require('./schema/sentence-schema.json');

const ajv = Ajv({
  allErrors: true,
  jsonPointers: true,
  schemaId: 'auto',
}).addMetaSchema(jsonSchema04)
  .addMetaSchema(jsonSchema06);
export const validator = ajv.compile(schema);
