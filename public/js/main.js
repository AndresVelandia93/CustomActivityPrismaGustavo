requirejs.config({
	paths: {
		postmonger: 'postmonger'
	},
	shim: {
		'jquery': {
			exports: '$'
		},
		'customActivity': {
			deps: ['jquery', 'postmonger']
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