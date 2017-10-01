import Test from 'ava';

import Path from 'path';
import ContentProvider from '../../src/libs/content_provider';
import sinon from 'sinon';

let expected_path = Path.join( __dirname, '..', 'helpers', 'modules', 'test-module' );
let module_config = {
	module_path: expected_path
};

Test.beforeEach( t => {
	t.context = new ContentProvider( module_config );
} );

Test( 'should have the specified module path', t => {
	let content_provider = t.context;

	t.is( content_provider.module_path, expected_path );
} );

Test( 'get_main() should return the content of the module\'s main.js file', t => {
	let content_provider = t.context;
	let main_js_content = content_provider.get_main();

	t.is( main_js_content, "alert('boo');" );
} );

Test( 'get_templates( [names] ) should return a list of template objects that match the specified template names.', t => {
	let content_provider = t.context;

	var main_template = {
		id: 'main',
		html: '<html>main</html>',
		style: '.main-style{}'
	};

	var one_template = {
		id: 'one',
		html: '<html>one</html>',
		style: '.one-style{}'
	};

	// repeated 'main' to test unique name filtering
	var template_names = [ 'main', 'one', 'main' ];
	let templates = content_provider.get_templates( template_names );

	// must return empty list if templates directory is empty or does not exist
	t.not( templates, null );

	// make sure it is only returning the required items
	t.is( templates.length, 2 );

	t.deepEqual( templates[ 0 ], main_template );
	t.deepEqual( templates[ 1 ], one_template );
} );

Test( 'get_templates([]) should return an empty list when not receiving file names to look up.', t => {
	let content_provider = new ContentProvider( {
		module_path: Path.join( __dirname, '..', 'helpers', 'modules', 'ghost-module' )
	} );

	let templates = content_provider.get_templates();

	// must return empty list if templates directory is empty or does not exist
	t.not( templates, null );

	// make sure it is only returning the required items
	t.is( templates.length, 0 );
} );

Test( 'get_templates() should return an empty list when the provided templates path does not exist.', t => {
	let content_provider = new ContentProvider( {
		module_path: Path.join( __dirname, '..', 'helpers', 'modules', 'ghost-module' )
	} );

	let templates = content_provider.get_templates();

	// must return empty list if templates directory is empty or does not exist
	t.not( templates, null );

	// make sure it is only returning the required items
	t.is( templates.length, 0 );
} );

Test( 'get_components( [names] ) should return a list of resource objects that match the specified component names.', t => {
	let content_provider = t.context;

	// var main_component = {
	// 	id: 'main',
	// 	html: '<html>component</html>',
	// 	style: '.main-style{}'
	// };

	// var one_template = {
	// 	id: 'one',
	// 	html: '<html>one</html>',
	// 	style: '.one-style{}'
	// };

	// // repeated 'main' to test unique name filtering
	// var template_names = [ 'main', 'one', 'main' ];
	// let templates = content_provider.get_templates( template_names );

	// // must return empty list if templates directory is empty or does not exist
	// t.not( templates, null );

	// // make sure it is only returning the required items
	// t.is( templates.length, 2 );

	// t.deepEqual( templates[ 0 ], main_template );
	// t.deepEqual( templates[ 1 ], one_template );
} );