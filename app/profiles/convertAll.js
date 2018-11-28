// converts all XML instances to JSON instances 
var convert = require('xml-js');
var fs      = require('fs');

function convertFile( filename ) {
    console.log('Converting ', filename, '...');
    const options = {compact: true, ignoreComment: true, spaces: 4};
    const xml = fs.readFileSync(filename+'.xml', 'utf8');
    const json = convert.xml2json(xml, options);
    fs.writeFileSync(filename+'.js', json);
    console.log('Converted ', filename, '...');
}

function convertAll() {
    convertFile('instances/ExperimentProfile');
    convertFile('instances/LexicalResourceProfile');
    convertFile('instances/SpeechCorpusProfile');
    convertFile('instances/TextCorpusProfile');
    convertFile('instances/ToolProfile');
}

convertAll();
    

    

