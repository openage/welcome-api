// module.exports=[{
//     url:"/",
//     "post": {
//         "summary": "Create identity",
//         "description": "Create identity",
//         "consumes": [
//             "application/json"
//         ],
//         "produces": [
//             "application.json"
//         ],
//         "parameters": [
//             {
//                 "name": "body",
//                 "in": "body",
//                 "description": "identity",
//                 "required": true,
//                 "schema": {
//                     "$ref": "#/definitions/identityReq"
//                 }
//             },
//             {
//                 "name": "org-code",
//                 "in": "header",
//                 "description": "code of organization",
//                 "required": true,
//                 "type": "string"
//             }
//         ],

//         "responses": {
//             "default": {
//                 "description": "Unexpected error",
//                 "schema": {
//                     "$ref": "#/definitions/Error"
//                 }
//             }
//         }
//     },
//     "get": {
//         "summary": "Get identities",
//         "description": "get identities",
//         "operationId": "get",
//         "consumes": [
//             "application/json"
//         ],
//         "produces": [
//             "application.json"
//         ],
//         "parameters": [
//             {
//                 "name": "org-code",
//                 "in": "header",
//                 "description": "Org-Code",
//                 "required": true
//             },
//             {
//                 "name": "identityName",
//                 "in": "query",
//                 "description": "identityName",
//                 "required": false
//             }
//         ],
//         "tags": [
//             "identities"
//         ],
//         "responses": {
//             "default": {
//                 "description": "Unexpected error",
//                 "schema": {
//                     "$ref": "#/definitions/Error"
//                 }
//             }
//         }
//     }

// },{
//     url:"/{id}",
//         "put": {
//             "summary": "update identities",
//             "description": "update identities",
//             "operationId": "put",
//             "consumes": [
//                 "application/json"
//             ],
//             "produces": [
//                 "application.json"
//             ],
//             "parameters": [
//                 {
//                     "in": "body",
//                     "description": "to update fields",
//                     "required": true,
//                     "schema": {
//                         "$ref": "#/definitions/identityReq"
//                     }
//                 },
//                 {
//                     "name": "id",
//                     "in": "path",
//                     "description": "identity id",
//                     "required": true,
//                     "type": "string"
//                 }
//             ],
//             "tags": [
//                 "identities"
//             ],
//             "responses": {
//                 "default": {
//                     "description": "Unexpected error",
//                     "schema": {
//                         "$ref": "#/definitions/Error"
//                     }
//                 }
//             }
//         }

// }];
