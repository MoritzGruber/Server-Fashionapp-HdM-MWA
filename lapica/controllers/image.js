var Image = require('./../models/image');
var debug = require('./../debug');
var User = require('./../controllers/user');
var fs = require("fs");


module.exports = {
    // create image
    createImage: function (creator, product, file, accessToken) {
        debug.log("createImage called");
        return new Promise(function (resolve, reject) {
            // validate accessToken
            if (file === null){
                reject('file-is-null');
            }
            else if(file.content.type.substring( 0, 6) != 'image/'.substring( 0, 6)){
                reject('uncorrect-file-type');
            }
            return User.validateAccessToken(accessToken, creator).then(function () {
                //safe the meta data about the image to the datebase with the src path
                var image = new Image({
                    creator: creator,
                    createDate: new Date,
                    active: true,
                    product: null //TODO: validate product id
                });
                image.save(function (err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        fs.readFile(file.content.path, function (err, data) {
                            var imageName = file.content.name;
                            // If there's an error
                            if (err) {
                                debug.log(err);
                                reject('error-reading-file')
                            }
                            if (!imageName) {
                                reject('error, invalid file name');
                            } else {
                                var newPath = __dirname + "/../storage/" + res._id + '.'+ file.content.type.substr(6);
                                // write file to uploads/fullsize folder
                                debug.log('newPath=' + newPath);
                                fs.writeFile(newPath, data, function (err) {
                                    if (err) {
                                        debug.log(err);
                                        reject('error-reading-file')
                                    }
                                    //delete inital file after copy to storage
                                    fs.unlink(file.content.path);
                                    // let's see it
                                    resolve('success');
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
    getOldestValidImage: function () {
      return new Promise(function (resolve, reject) {
          var maxTimeToLookFor = new Date;
          maxTimeToLookFor = maxTimeToLookFor - (60 * 60 * 24 * 7); // 7 days
          Image.findOne({createDate: {$gt: maxTimeToLookFor}}).sort('createDate').exec(function(err, res) {
              if(err){
                  reject(err);
              }else{
                  resolve(res);
              }
          });

      })
    },
    getNextImage: function (imageId) {
        return new Promise(function (resolve, reject) {
            if(imageId == null){
                //if null, its probably a new user and we grab him a image max 7 days old
                Image.getOldestValidImage().then(function (res) {
                    //if datebase is empty and there are no images
                    if(res == null){
                        resolve(null);
                    } else {
                        //if we found something we want to update this in the
                        imageId = res._id;
                    }
                })
            }
            Image.findOne({_id: {$gt: imageId}}).sort({_id: 1}).exec(function (err, res) {
                if (err) {
                    reject('error in getNextImage :' + err);
                } else {
                    resolve(res._id);
                }
            });
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
