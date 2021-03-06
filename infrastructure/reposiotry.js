const config = require('config');
const _ = require('lodash');

class MongoRepository {
  constructor(modelClass, searchableTextFields) {
    this.modelClass = modelClass;
    this.searchableFields = searchableTextFields;
  }

  save(record) {
    if (record instanceof this.modelClass) {
      return record.save();
    }

    let model = new this.modelClass(record);

    return model.save();
  }

  getById(id) {
    return this.modelClass.findById(id).exec();
  }

  update(record) {
    if (record instanceof this.modelClass) {
      return record.save();
    }

    return this.modelClass.findOneAndUpdate({
      _id: record.id
    }, record).exec();

  }

  search(queryObject) {
    return this.modelClass.find(
        this._hybridParametersObject(queryObject)
      )
      .sort({
        createDate: -1
      })
      .exec();
  }

  find(queryObject) {
    return this.modelClass.find(queryObject)
      .sort({
        createDate: -1
      })
      .exec();
  }

  findOne(queryObject) {
    return this.modelClass.findOne(queryObject)
      .sort({
        createDate: -1
      })
      .exec();
  }

  deleteById(id) {
    return this.modelClass.findByIdAndRemove(id).exec();
  }

  deleteByQuery(queryObject) {
    return this.modelClass.find(queryObject)
      .remove()
      .exec();
  }

  searchCount(queryObject) {
    return this.modelClass.count(queryObject).exec();
  }

  pagedSearch(queryObject, pageNumber, pageSize) {
    if (!pageSize) {
      pageSize = config.get('defaultPageSize');
    }

    let offset = 0;

    if (pageNumber) {
      offset = (pageNumber - 1) * pageSize;
    }

    return this.modelClass.find(
        this._hybridParametersObject(queryObject)
      )
      .sort({
        createDate: -1
      })
      .skip(offset)
      .limit(pageSize)
      .exec();
  }

  _hybridParametersObject(queryObject) {
    const likeObject = this._likeParametersObject(
      _.pick(queryObject, this.searchableFields)
    );

    return Object.assign({}, queryObject, likeObject);
  }

  _likeParametersObject(queryObject) {

    let result = {};

    Object.keys(queryObject)
      .forEach(function(key) {

        result[key] = new RegExp('.*' + queryObject[key] + '.*', 'gimu');

      });

    return result;

  }
}

module.exports = MongoRepository;
