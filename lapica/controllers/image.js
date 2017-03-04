var Image = require('./../models/image');
var debug = require('./../debug');
var User = require('./../controllers/user');
var fs = require("fs");
var ObjectId = require('mongoose').Schema.ObjectId;


Date.prototype.addDays = function (num) {
    var value = this.valueOf();
    value += 86400000 * num;
    return new Date(value);
};

var getOldestValidImage = function () {
    return new Promise(function (resolve, reject) {
        var time = new Date;
        Image.findOne({createDate: {$gt: time.addDays(-7)}}, {}).sort({createDate: 1}).exec(function (err, res) {
            if (err) {
                reject(err);
            } else if (res == null) {
                resolve('no-oldest-valid-image-in-database');
            }else{
                debug.log('oldest image found: '+res._id);
                resolve(res._id);
            }
        });

    })
};

module.exports = {
    // create image
    createImage: function (creator, product, file, accessToken) {
        debug.log("createImage called");
        return new Promise(function (resolve, reject) {
            // validate accessToken
            if (file === null) {
                reject('file-is-null');
            } else if(file == undefined){
                reject('file-content-is-undefined');

            }
            else if (file.type.substring(0, 6) != 'image/') {
                reject('uncorrect-file-type');
            }
            return User.validateAccessToken(accessToken, creator).then(function () {
                //safe the meta data about the image to the datebase with the src path
                var image = new Image({
                    creator: creator,
                    createDate: new Date,
                    active: true,
                    product: null, //TODO: validate product id
                    filetype: file.type.substring(6, file.type.length)
                });
                image.save(function (err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        fs.readFile(file.path, function (err, data) {
                            var imageName = file.name;
                            // If there's an error
                            if (err) {
                                debug.log(err);
                                reject('error-reading-file')
                            }
                            if (!imageName) {
                                reject('error, invalid file name');
                            } else {
                                var newPath =  "/src/storage/" + res._id + '.' + file.type.substring(6, file.type.length);
                                // write file to uploads/fullsize folder
                                debug.log('newPath=' + newPath);
                                fs.writeFile(newPath, data, function (err) {
                                    if (err) {
                                        debug.log(err);
                                        reject('error-writing-file')
                                    }
                                    resolve(res._id);
                                });
                            }
                        })
                    }
                })

            }).catch(function (msg) {
                reject(msg);
            });
        });
    },
    getOldestValidImage: getOldestValidImage,
    getNextImage: function (imageId) {

        return new Promise(function (resolve, reject) {
            //check if image id is valid
            if (imageId == null) {
                debug.log('no last image, falling back to get oldest valid image');
                //if null, its probably a new user and we grab him a image max 7 days old
                getOldestValidImage().then(function (res) {
                   resolve(res);
                }).catch(function (err) {
                    reject(err);
                });

            } else {
                debug.log('SERVER: Image id before next: ' + imageId);
                Image.findOne({_id: {$gt: imageId}}).sort({_id: 1}).exec(function (err, res) {
                    if (err) {
                        reject('error in getNextImage :' + err);
                    } else {
                        if (res == null) {
                            resolve('no-next-image');
                        } else {
                            debug.log('SERVER: Image id after next: ' + res._id);
                            resolve(res._id);
                        }

                    }
                });
            }
        });
    },
    //this function gets the image src, extends the object with it, parsed as base64 from file
    getImageWithSrc: function(imageId){
      return new Promise(function (resolve, reject) {
          Image.findOne({_id: imageId},{}).exec(function (err, res) {
              if (err) {
                  reject('error in getImageWithSrc :' + err);
              } else {
                  if (res == null) {
                      reject('no-image-found');
                  }
                  // read binary data
                  var bitmap = fs.readFileSync('/src/storage/'+imageId+'.'+res.filetype);
                  // convert binary data to base64 encoded string
                  res.src = new Buffer(bitmap).toString('base64');

                  resolve(res);
              }
          })
      });
    },

    // get all images
    getAllImages: function (accessToken) {
        debug.log("getImages called");
        Image.find().select('_id').exec(function (err, res) {
            var imageIds = [];
            res.forEach(function (image) {
                imageIds.push(image._id);
            });
            callback(err, imageIds);
        });
    }

    ,

    // get single image
    getImage: function (id, callback) {
        debug.log("getImage called");
        Image.findOne({_id: id}, function (err, res) {
            callback(err, res);
        });
    }
    ,

    // get user(creator) of picture
    getUserOfImage: function (id, callback) {
        debug.log("getUserOfImage called");
        Image.findOne({_id: id}, function (err, res) {
            callback(err, res.user);
        });
    }
    ,

    // delete image
    deleteImage: function (imageId, callback) {
        debug.log("deleteImage called");
        Image.remove({_id: id}, function (err, res) {
            callback(err, res);
        });
    }
};
