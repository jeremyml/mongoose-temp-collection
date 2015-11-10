var mongoose = require('mongoose');

function tempCollection(schema, options){
	schema.statics.resultIntoTempCollection = function (tempCollectionDataArray, callback) {
		var tmpCollectionName = 'Z' + (new mongoose.mongo.ObjectID().toString());
		var tmpSchema = new mongoose.Schema({}, {strict: false, collection: tmpCollectionName});
		tmpSchema.statics.removeTempCollection = function(tempModel){
			mongoose.connection.db.dropCollection(tmpCollectionName);
		}
		// model ref is overwritten on each subsequent run of resultIntoTempCollection
		var tempModel = mongoose.model('tempModel' + tmpCollectionName, tmpSchema);
		var promises = [];
		tempCollectionDataArray.forEach(function(doc){
			promises.push(new tempModel(doc).save());
		});
		return Promise.all(promises).then(function(){
			return tempModel;
		});
	}
}

module.exports = tempCollection;