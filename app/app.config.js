// Toastr message configuaration
toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-bottom-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

//HTTP METHODS
var HTTP_GET = 'GET';
var HTTP_POST = 'POST';
var HTTP_PUT = 'PUT';
var BASE_URL = '';
var onProduction = false;
var MARRIOTT_ID = '5832978e5b0c8732148b456c';

var SCROLLBAR_TYPE = 'minimal-dark';

if (!onProduction)
    BASE_URL = 'http://111.93.67.82:7023/marriott';

else
    BASE_URL = 'https://marriott-91784.onmodulus.net/marriott';

var API_EMAILIMAGE_URL = '/emailTypeImages?imageId=';
var API_BRANDIMAGE_URL = '/brands/images?brandIcon=';
