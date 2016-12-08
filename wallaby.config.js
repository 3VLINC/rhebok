module.exports = function (w) {

  return {
    files: [
      {pattern: 'src/**/*.ts', load: false },
      {pattern: 'src/**/*.spec.ts', ignore: true}
    ],
    tests: [
      {pattern: 'src/**/*.spec.ts', load: true}
    ],
    testFramework: 'mocha',
    env: {
      type: 'node'
    },
    compilers: {
      '**/*.ts': w.compilers.typeScript({ module: 'commonjs' })
    },
    setup: function(wallaby) {


    }
  };
};
