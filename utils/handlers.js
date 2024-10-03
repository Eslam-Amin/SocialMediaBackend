const ApiError = require("./ApiError");

exports.checkForNull = (attribute, attributeName, next) => {
  console.log("Check For attibute => ", attributeName);
  if (!attribute || attribute?.length === 0)
    return next(new ApiError(`You have to add your ${attributeName}`, 400));
};

exports.checkForExistance = (attribute, attributeName, next) => {
  console.log("Check For attibute => ", attributeName);
  if (attribute || attribute?.length === 0)
    return next(
      new ApiError(`There is a ${attributeName} created before`, 400),
    );
};
