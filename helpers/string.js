'use strict'
String.prototype.toObjectId = function () {
    let ObjectId = (require('mongoose').Types.ObjectId)
    return new ObjectId(this.toString())
}

String.prototype.isObjectId = function () {
    let ObjectId = (require('mongoose').Types.ObjectId)
    return ObjectId.isValid(this.toString())
}
