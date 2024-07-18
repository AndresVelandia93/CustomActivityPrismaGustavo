requirejs.config({
	paths: {
		postmonger: 'postmonger',
		'jquery': 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js'
	  
	},
	shim: {
	  'custom_activity': {
		deps: ['postmonger']
	  }
	}
});

requirejs(['jquery', 'customActivity'], function ($, customEvent) {
    // Require loaded
});

requirejs.onError = function (err) {
	if (err.requireType === 'timeout') {
		console.log('modules: ' + err.requireModules);
	}
	throw err;
};