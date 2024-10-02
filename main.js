const { Command } = require('commander');
const fs = require('fs');
const program = new Command();

// Add command-line options
program
  .requiredOption('-i, --input <path>', 'path to input file')
  .option('-o, --output <path>', 'path to output file')
  .option('-d, --display', 'display result in console');

program.parse(process.argv);

// Get options
const options = program.opts();

// Check for required input option
if (!options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}

// Check if input file exists
if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

// Read data from input file
const data = fs.readFileSync(options.input, 'utf-8');
const jsonData = JSON.parse(data);

// Find the asset with the minimum value
let minAsset = null;
let minValue = Infinity;

jsonData.forEach(asset => {
  const value = asset.value; // Get the value of the asset
  const txt = asset.txt; // Get the name of the asset in Ukrainian
  
  if (value < minValue) {
    minValue = value;
    minAsset = { txt, value }; // Store only the name and value
  }
});

// Check if a minimum asset was found
if (minAsset) {
  const outputString = `${minAsset.txt}:${minAsset.value}`; // Format output as <назва актива>:<значення>

  // Display result in console if -d is specified
  if (options.display) {
    console.log(outputString);
  }

  // Write result to output file if -o is specified
  if (options.output) {
    fs.writeFileSync(options.output, outputString);
  }
}
