mongoose-temp-collection
========================

This is a mongoose plugin to cache the results of a mongoose query into a temporary collection.  This is useful when populating referenced fields prior to running an aggregation on documents with the referenced fields being populated.

##Usage
```js
var mongoose = require('mongoose');
var tempCollectionPlugin = require('/models/plugins/temp_collection.js');

var SubSchema = = new mongoose.Schema({
  someField: String,
});
var Schema = new mongoose.Schema({
  refDoc: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'subDocModel', // subDocModel would need to be defined elsewhere else in this example
	}	
});

Schema.plugin(tempCollectionPlugin, {});
var Model = mongoose.model('Model', Schema);
Model.find().populate('refDoc').lean() // need to lean the doc so it can be modified and saved inside the plugin
.then(function(result){
  // resultIntoTempCollection returns a temporary model
  return Model.resultIntoTempCollection(result).then(function(tempModel){ 
		return tempModel.aggregate( // now we can aggregate using the populated subdoc
		  [{$project: { someFieldProjection: "refDoc.someField"}]
		).exec().then(function(aggregatedResult){
		  console.log(aggregatedResult);
		  tempModel.removeTempCollection(); // cleanup by deleting the temporary collection
		}, function(err){
		  console.error(err);
		  tempModel.removeTempCollection(); // cleanup by deleting the temporary collection
		})  
});

