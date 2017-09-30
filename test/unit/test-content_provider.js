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

Test( 'get_templates returns html & css from the /test-module/template/main.(html|css) files.', t => {
	let content_provider = t.context;
	let template = content_provider.get_templates();
	let expected_template = [ {
		html: '',
		css: ''
	} ];
	t.deepEqual( template, expected_template );
} );

// 	
// test( 'test in progress', t => {
// 	t.true( 1 === 2 );
// } );
// test( 'objects', t => {
// 	const actual = {
// 		a: 1,
// 		b: {
// 			c: 2
// 		}
// 	};

// 	const expected = {
// 		a: 2,
// 		b: {
// 			c: 1
// 		}
// 	};

// 	t.deepEqual( actual, expected );
// } );
// test('test in progress', t => {
// 	t.true(assert.equal( '', __dirname ));
// });

// test( 'BBB', t => {
// 	t.truthy( 'a' === __dirname );
// } );
