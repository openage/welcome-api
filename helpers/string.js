'use strict'

// eslint-disable-next-line no-extend-native
String.prototype.toObjectId = function () {
    let ObjectId = (require('mongoose').Types.ObjectId)
    return new ObjectId(this.toString())
}

// eslint-disable-next-line no-extend-native
String.prototype.isObjectId = function () {
    let ObjectId = (require('mongoose').Types.ObjectId)
    return ObjectId.isValid(this.toString())
}
