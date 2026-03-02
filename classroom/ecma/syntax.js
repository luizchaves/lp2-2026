// Variables
// const name = 'Luiz';
let name;

name = 'Luiz';

name = 'Carlos';

console.log(name);

const values = [];

values.push(1);

console.log(values); // [1]

// function: return list of names
const names = ['Luiz', 'Maria', 'João'];
// <ul>
//   <li>Luiz</li>
//   <li>Maria</li>
//   <li>João</li>
// </ul>
console.log('<ul>');
for (const name of names) {
  console.log('  <li>' + name + '</li>')
}
console.log('</ul>');

function listNames(names) {
  let list = '<ul>\n';

  for (const name of names) {
    list += `  <li>${name}</li>\n`;
  }

  list += '</ul>';

  return list;
}

console.log(listNames(names));
