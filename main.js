const { Command } = require('commander');
const fs = require('fs'); // Імпорт модуля fs для роботи з файловою системою
const program = new Command();

// Додавання параметрів командного рядка
program
  .requiredOption('-i, --input <path>', 'path to input file') // Обов'язковий параметр для вхідного файлу
  .option('-o, --output <path>', 'path to output file') // Необов'язковий параметр для вихідного файлу
  .option('-d, --display', 'display result in console'); // Необов'язковий параметр для виведення результату в консоль

program.parse(process.argv);

// Отримання параметрів
const options = program.opts();

// Перевірка наявності обов'язкового параметра для вхідного файлу
if (!options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}

// Перевірка, чи існує вхідний файл
if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

// Читання даних з вхідного файлу
let data;
try {
  data = fs.readFileSync(options.input, 'utf-8'); // Використання readFileSync
} catch (err) {
  console.error("Error reading input file:", err.message);
  process.exit(1);
}

// Парсинг даних JSON
let jsonData;
try {
  jsonData = JSON.parse(data); // Парсинг JSON
} catch (err) {
  console.error("Error parsing JSON data:", err.message);
  process.exit(1);
}

// Змінні для знаходження активу з мінімальним значенням
let minAsset = null;
let minValue = Infinity;

// Проходження по кожному активу в jsonData
jsonData.forEach(asset => {
  const value = parseFloat(asset.value); // Отримання числового значення активу
  const txt = asset.txt || "Unnamed"; // Отримання назви активу, якщо назва відсутня, використовуємо "Unnamed"

  // Перевірка, чи значення є числовим і менше за мінімальне
  if (!isNaN(value) && value < minValue) {
    minValue = value;
    minAsset = { txt, value }; // Зберігання назви та значення активу
  }
});

// Перевірка, чи знайдено мінімальний актив
if (minAsset) {
  const outputString = `${minAsset.txt}:${minAsset.value}`; // Форматування виходу як <назва актива>:<значення>

  // Виведення результату в консоль
  console.log(`${outputString}`); // Виведення найменшого активу

  // Запис результату у вихідний файл, якщо вказано параметр -o
  if (options.output) {
    try {
      fs.writeFileSync(options.output, outputString); // Використання writeFileSync
      // Сюди ви можете прибрати або закоментувати наступний рядок
      // console.log(`Result written to ${options.output}`); // Повідомлення про запис у файл
    } catch (err) {
      console.error("Error writing to output file:", err.message);
    }
  }
} else {
  console.log("No assets found with a valid numeric value."); // Повідомлення, якщо активи не знайдені
}
