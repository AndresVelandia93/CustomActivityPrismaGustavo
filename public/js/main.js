requirejs.config({
	paths: {
	  postmonger: 'postmonger'
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