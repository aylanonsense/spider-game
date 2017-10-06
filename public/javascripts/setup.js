requirejs.config({
	baseUrl: BASE_URL + '/javascripts',
	paths: {
		lib: 'lib',
		app: 'app',
		jquery: 'lib/jquery'
	}
});
requirejs([ 'app/Main' ], function(Main) {
	Main();
});