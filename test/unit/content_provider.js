import FS from 'fs';

import Test from 'ava';

import Path from 'path';
import ContentProvider from '../../src/libs/content_provider';
import Sinon from 'sinon';

let real_module_path = Path.join( 'real', 'module' );
let fake_module_path = Path.join( 'fake', 'module' );

Test.before( t => {
	let real_templates_path = Path.join( real_module_path, 'templates' );
	let fake_templates_path = Path.join( fake_module_path, 'templates' );

	let real_main_js = Path.join( real_module_path, 'main.js' );

	let real_template_main_html = Path.join( real_templates_path, 'main.html' );
	let real_template_main_css = Path.join( real_templates_path, 'main.css' );

	let real_template_one_html = Path.join( real_templates_path, 'one.html' );
	let real_template_one_css = Path.join( real_templates_path, 'one.css' );

	let existsSync = Sinon.stub( FS, 'existsSync' );
	let readFileSync = Sinon.stub( FS, 'readFileSync' );

	existsSync.withArgs( real_templates_path ).returns( true );
	existsSync.withArgs( fake_templates_path ).returns( false );

	readFileSync.withArgs( real_main_js ).returns( "alert('madness');" );

	readFileSync.withArgs( real_template_main_html ).returns( "<html>main</html>" );
	readFileSync.withArgs( real_template_main_css ).returns( ".main-style{}" );

	readFileSync.withArgs( real_template_one_html ).returns( "<html>one</html>" );
	readFileSync.withArgs( real_template_one_css ).returns( ".one-style{}" );

} );

Test( 'should have the specified module path', t => {
	let content_provider = new ContentProvider( {
		module_path: real_module_path
	} );

	t.is( content_provider.module_path, real_module_path );
} );

Test( 'get_main() should return the content of the module\'s main.js file', t => {
	let content_provider = new ContentProvider( {
		module_path: real_module_path
	} );
	let content = content_provider.get_main();

	t.is( content, "alert('madness');" );
} );

Test( 'get_templates( [names] ) should return a list of template objects that match the specified template names.', t => {
	let content_provider = new ContentProvider( {
		module_path: real_module_path
	} );

	let main_template = {
		id: 'main',
		html: '<html>main</html>',
		style: '.main-style{}'
	};

	let one_template = {
		id: 'one',
		html: '<html>one</html>',
		style: '.one-style{}'
	};

	// repeated 'main' to test unique name filtering
	let template_names = [ 'main', 'one', 'main' ];
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
		module_path: real_module_path
	} );
	let templates = content_provider.get_templates();

	// must return a list
	t.not( templates, null );

	// the list must be empty
	t.is( templates.length, 0 );
} );

Test( 'get_templates() should return an empty list when the provided templates path does not exist.', t => {
	let content_provider = new ContentProvider( {
		module_path: fake_module_path
	} );
	let templates = content_provider.get_templates();

	// must return a list
	t.not( templates, null );

	// the list must be empty
	t.is( templates.length, 0 );
} );

Test( 'get_components() should return an empty list when the provided component path does not exist.', t => {
	let content_provider = new ContentProvider( {
		module_path: fake_module_path
	} );
	let components = content_provider.get_components();

	// must return a list
	t.not( components, null );

	// the list must be empty
	t.is( components.length, 0 );
} );