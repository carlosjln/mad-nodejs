function ModuleNotFound( module_name ) {
	this.code = 404;
	this.message = "Module not found.";
	this.module_name = module_name;
}

function FileNotFound( filepath ) {
	this.code = 404;
	this.message = "File not found.";
	this.module_name = filepath;
}

function InvalidModuleId( module_name ) {
	this.code = 500;
	this.message = "Module IDs can only contain alphanumeric characters, dash and underscore.";
	this.module_name = module_name;
}

function InvalidJSON( file ) {
	this.code = 500;
	this.message = "The file content isn't a valid JSON string.";
	this.file = file;
}

module.exports = {
	ModuleNotFound: ModuleNotFound,
	InvalidModuleId: InvalidModuleId,
	InvalidJSON: InvalidJSON
};