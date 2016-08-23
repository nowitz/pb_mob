'user strict';
angular.module('app')
    .factory('ColorsFactory', function () {
        var coloRgb = "#003366";

        // todo Prepsani barev podle typu jazyka
        var colors = [
            {id: 0, color: "#FFFF66", name: "Yellow", rgb: "255, 255, 204"},
            {id: 1, color: "#FF9900", name: "Orange", rgb: "255, 153, 0"},
            {id: 2, color: "#D82A2A", name: "Red", rgb: "216, 42, 42"},
            {id: 3, color: "#CC0066", name: "Pink", rgb: "204, 0, 102"},
            {id: 4, color: "#660066", name: "Purple", rgb: "106, 0, 106"},
            {id: 5, color: "#00CCCC", name: "Light blue", rgb: "00, 204, 204"},
            {id: 6, color: "#003366", name: "Dark blue", rgb: "0, 51, 102"},
            {id: 7, color: "#50D420", name: "Light Green", rgb: "80, 212, 32"},
            {id: 8, color: "#009933", name: "Dark green", rgb: "0, 153, 51"}
           // {id: 9, color: "#FFFFFF", name: "White", rgb: "255, 255, 255"}
        ];


        return {
            all: function () {
                return colors;
            },
            get: function (pos) {
                return colors[pos];
            },
            setRgbColor: function (pos) {
                coloRgb = pos.color;
            },
            getRgbColor: function(){
                return coloRgb;
            },
            getFindColor: function (pos, $scope){
                angular.forEach(colors, function(value, key) {
                   //console.log(pos,"         ",key + ': ' + value.color);
                    if(value.color === pos.value){
                        if(pos.type_setting.name === "background_color"){
                            $scope.data.colorBack.value = value;
                            $scope.data.colorBack.idTypeSetting = pos.type_setting.id_type_setting;
                            $scope.data.colorBack.idSetting = pos.id_setting;
                        }else if(pos.type_setting.name === "text_color"){
                            $scope.data.colorText.value = value;
                            $scope.data.colorText.idTypeSetting = pos.type_setting.id_type_setting;
                            $scope.data.colorText.idSetting = pos.id_setting;
                        }
                    }
                });
            }
        }
    });