/**
 * LocateController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var classifyPoint = require("robust-point-in-polygon")

var matchingAreas = [];

function getAreas(point) {
  return new Promise(
    function(resolve, reject) {
      Areas.find().exec(
        function(err, areas) {
          if (err) {
            console.error(err);
            reject(err);
          }
          for (var area = 0; area < areas.length; area++) {
            var areaPolygon = JSON.parse(areas[area].polygon);
            var check = classifyPoint(areaPolygon, [point.lat, point.lng]);
            if (check === 0 || check < 0) {
              matchingAreas.push(areas[area]);
            }
          }
          resolve(matchingAreas);
        });
    }
  );
}

module.exports = {
  locate: function (req, res) {
    let point = req.allParams();
    getAreas(point).then(function (value) {
      res.json(matchingAreas);
      matchingAreas = [];
    });
  }
};

