const fs = require('fs');

const packageJSON = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const dependencyKeys = Object.keys(packageJSON.dependencies);
dependencyKeys.filter(key => key.startsWith('babel')).forEach(key => {
  packageJSON.devDependencies[key] = packageJSON.dependencies[key];
});
packageJSON.dependencies = dependencyKeys
  .filter(key => !key.startsWith('babel'))
  .reduce(
    (result, key) => {
      result[key] = packageJSON.dependencies[key];
      return result;
    },
    {}
  );

fs.writeFileSync('package.json', JSON.stringify(packageJSON, null, '  ') + '\n', 'utf8');
