var nxLibrary = angular.module('nxLibrary', ['cfp.loadingBar']);
nxLibrary.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.latencyThreshold = 500;
}]);

nxLibrary.factory('http', ['$http', '$q', function ($http, $q) {
    var get = function (request) {
        return $http({
            method: request.method || 'GET',
            url: request.url,
            params: $.param(request.params),// request.params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function (data) {
            return data;
        }).error(function (data) {
            return $q.reject(data);
        });
    };
    var post = function (request) {
        return $http({
            method: request.method || 'POST',
            url: request.url,
            params: request.params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function (data) {
            return data;
        }).error(function (data) {
            return $q.reject(data);
        });
    };
    var fileUpload = function (request) {
        var formData = new FormData();
        formData.append('file', request.file);
        if (!angular.isUndefined(request.data) && request.data != null && request.data != '') {
            angular.forEach(request.data, function (value, key) {
                formData.append(key, value);
            });
        }
        return $http({
            method: request.method || 'POST',
            url: request.url,
            data: formData,
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).success(function (data) {
            return data;
        }).error(function (data) {
            return $q.reject(data);
        });
    };
    return {
        get: get,
        post: post,
        fileUpload: fileUpload
    };
}]);
nxLibrary.factory('nx', ['nxResponse', 'nxMessage', 'nxProgress', 'nxState', 'nxDownload', 'nxArray', 'nxDate', function (nxResponse, nxMessage, nxProgress, nxState, nxDownload, nxArray, nxDate) {
    return {
        response: nxResponse,
        message: nxMessage,
        progress: nxProgress,
        state: nxState,
        download: nxDownload,
        arr: nxArray,
        date: nxDate
    };
}]);
nxLibrary.factory('nxMessage', function () {
    var successMsg = function (msg) {
        toastr["success"](msg);
    };
    var errorMsg = function (msg) {
        toastr["error"](msg);
    };
    var warningMsg = function (msg) {
        toastr["warning"](msg);
    };
    var infoMsg = function (msg) {
        toastr["info"](msg);
    };
    return {
        success: successMsg,
        error: errorMsg,
        warning: warningMsg,
        info: infoMsg
    };
});
nxLibrary.factory('nxResponse', ['$location', function ($location) {
    var redirect = function (url) {
        $location.path('/' + url);
    };
    return {
        redirect: redirect
    };
}]);
nxLibrary.factory('nxProgress', ['cfpLoadingBar', function (cfpLoadingBar) {
    var start = function () {
        $('body').css('pointer-events', 'none');
        cfpLoadingBar.start();
    };
    var set = function (percent) {
        var _per = parseInt(percent) / 10;
        cfpLoadingBar.set(_per);
    };
    var status = function () {
        return cfpLoadingBar.status();
    };
    var complete = function () {
        $('body').css('pointer-events', 'all');
        cfpLoadingBar.complete();
    };
    return {
        start: start,
        stop: stop,
        complete: complete,
        set: set,
        status: status
    };
}]);
nxLibrary.factory('nxState', function () {
    var sd = {
        obj: {}
    };
    var getData = function (k) {
        return sd.obj[k];
    };
    var setData = function (k, v) {
        sd.obj[k] = v;
    };

    function resetAll() {
        sd = {
            obj: {}
        };
    }
    resetAll();
    return {
        set: setData,
        get: getData
    };
});
nxLibrary.factory('nxDownload', function () {
    var excelDownload = function (param) {
        var data = param.data;
        var form = $('<form id="downloadForm" action="' + param.url + '" method="' + (param.method || 'POST') + '"></form>');
        for (var key in data) {
            var inputs = $('<input type="hidden" name="' + key + '" value="" />');
            $(inputs).val(data[key] instanceof Array ? JSON.stringify(data[key]) : data[key]);
            inputs.appendTo($(form));
        }
        var submitBtn = $('<input type="submit" id="btnDownloadSubmit" />');
        submitBtn.appendTo($(form));
        form.appendTo('body');
        $(submitBtn).trigger('click');
        form.remove();
    };
    return {
        excel: excelDownload
    };
});
nxLibrary.factory('nxArray', function () {
    var contains = function (arr, value) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === value) {
                return true;
            }
        }
        return false;
    };
    return {
        contains: contains
    };
});

nxLibrary.factory('nxDate', function () {

    var difference = function (startDate, endDate) {
        var timeDifference = Math.abs(endDate.getTime() - startDate.getTime());
        return Math.ceil(timeDifference / (1000 * 3600 * 24));
    };
    var convertToDate = function (dateString, format) {
        var formatArr = format.split("/");
        var dateStringArr = dateString.split("/");
        var d = {day: '', month: '', year: ''};
        for (var i = 0; i < formatArr.length; i++) {
            if (formatArr[i].toLowerCase() === 'y' || formatArr[i].toLowerCase() === 'yy' || formatArr[i].toLowerCase() === 'yyy' || formatArr[i].toLowerCase() === 'yyyy') {
                d.year = dateStringArr[i];
            }
            if (formatArr[i].toLowerCase() === 'm' || formatArr[i].toLowerCase() === 'mm') {
                d.month = dateStringArr[i];
            }
            if (formatArr[i].toLowerCase() === 'd' || formatArr[i].toLowerCase() === 'dd') {
                d.day = dateStringArr[i];
            }
        }
        return new Date(d.year, d.month - 1, d.day);
    };

    return {
        difference: difference,
        convertToDate: convertToDate
    };
});

