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

Test( 'get_main returns the content of /test-module/main.js', t => {
	let content_provider = t.context;
	let main_js_content = content_provider.get_main();
	
	t.is( main_js_content, "alert('boo');" );
} );

Test( 'get_templates returns an object containing properties id, html & css that match their file content.', t => {
	let content_provider = t.context;
	
	var expected_main = {
		id: 'main',
		html: '<html>main template</html>',
		style: '.main-style {}'
	};
	let expected_template = [ expected_main ];

	let template = content_provider.get_templates();

	// t.snapshot( template, 'template' );
	t.not( template, null );

	t.is( template.length, 1 );

	t.deepEqual( template[0], expected_main );
} );
