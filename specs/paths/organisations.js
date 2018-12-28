// module.exports=[{
//     url:"/",
//     "post": {
//         "summary": "Create Organization",
//         "description": "Create name and code",
//         "parameters": [
//             {
//                 "name": "body",
//                 "in": "body",
//                 "description": "",
//                 "required": true,
//                 "schema": {
//                     "$ref": "#/definitions/orgReq"
//                 }
//             },{
//                 "name": "x-role-key",
//                 "in": "header",
//                 "description": "role key",
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
//         "summary": "Get all organization",
//         "description": "get organization",
//         "parameters": [
//             {
//                 "name": "x-role-key",
//                 "in": "header",
//                 "description": "role key",
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
//     }
// },{
//     url:"/{id}",
//     "put": {
//         "summary": "update organization",
//         "description": "update organization",
//         "parameters": [
//             {
//                 "in": "body",
//                 "description": "to update fields",
//                 "required": true,
//                 "schema": {
//                     "$ref": "#/definitions/orgReq"
//                 }
//             },
//             {
//                 "name": "id",
//                 "in": "path",
//                 "description": "organization id",
//                 "required": true,
//                 "type": "string"
//             },{
//                 "name": "x-role-key",
//                 "in": "header",
//                 "description": "role key",
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
//     }
// }];
