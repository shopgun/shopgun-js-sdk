import coffeescript from 'rollup-plugin-coffee-script';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import path from 'path';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';

const bundles = [
  {
    name: 'SGN',
    input: path.join(__dirname, 'lib', 'coffeescript', 'index.coffee'),
    outputs: {
      // Exclusive bundles(external `require`s untouched), for node, webpack etc.
      jsCJS: path.join(__dirname, 'dist', 'sgn-sdk.cjs.js'), // CommonJS
      jsES: path.join(__dirname, 'dist', 'sgn-sdk.es.js'), // ES Module
      // Inclusive bundles(external `require`s resolved), for browsers etc.
      jsBrowser: path.join(__dirname, 'dist', 'sgn-sdk.js'),
      jsBrowserMin: path.join(__dirname, 'dist', 'sgn-sdk.min.js'),
    },
  },
  {
    name: 'SGNTracker',
    useBuiltIns: false,
    input: path.join(__dirname, 'lib', 'coffeescript', 'kits', 'events', 'tracker.coffee'),
    outputs: {
      // Exclusive bundles(external `require`s untouched), for node, webpack etc.
      jsCJS: path.join(__dirname, 'kits', 'events', 'tracker.cjs.js'), // CommonJS
      jsES: path.join(__dirname, 'kits', 'events', 'tracker.mjs'), // ES Module
      // Inclusive bundles(external `require`s resolved), for browsers etc.
      jsBrowser: path.join(__dirname, 'kits', 'events', 'tracker.js'),
      jsBrowserMin: path.join(__dirname, 'kits', 'events', 'tracker.min.js'),
    },
  },
];

const getBabelPlugin = ({ useBuiltIns = 'usage' }) =>
  babel({
    babelrc: false,
    exclude: ['node_modules/**'],
    extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.coffee'],
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: ['> 3%', 'IE 11'],
            node: 8,
          },
          corejs: useBuiltIns ? 2 : undefined,
          useBuiltIns,
          exclude: ['transform-typeof-symbol'],
        },
      ],
    ],
  });

let configs = bundles.reduce(
  (cfgs, { name, input, outputs, useBuiltIns }) => [
    ...cfgs,
    {
      input,
      output: {
        file: outputs.jsCJS,
        format: 'cjs',
      },
      plugins: [
        replace({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
        coffeescript(),
        commonjs({
          extensions: ['.js', '.coffee'],
        }),
        getBabelPlugin({ useBuiltIns }),
      ],
    },
    {
      input,
      output: {
        file: outputs.jsES,
        format: 'es',
      },
      plugins: [
        replace({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
        coffeescript(),
        commonjs({
          extensions: ['.js', '.coffee'],
        }),
        getBabelPlugin({ useBuiltIns }),
      ],
    },
    {
      input,
      output: {
        file: outputs.jsBrowser,
        format: 'umd',
        name: 'SGN',
        amd: {
          define: 'rollupNeedsAnOptionToDisableAMDInUMD',
        },
      },
      plugins: [
        replace({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
        coffeescript(),
        resolve({
          mainFields: ['jsnext:main', 'main'],
          browser: true,
          preferBuiltins: true,
        }),
        commonjs({
          extensions: ['.js', '.coffee'],
        }),
        getBabelPlugin({ useBuiltIns }),
      ],
    },
    {
      input,
      output: {
        file: outputs.jsBrowserMin,
        format: 'umd',
        name,
        amd: {
          define: 'rollupNeedsAnOptionToDisableAMDInUMD',
        },
      },
      plugins: [
        replace({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
        coffeescript(),
        resolve({
          mainFields: ['jsnext:main', 'main'],
          browser: true,
          preferBuiltins: true,
        }),
        commonjs({
          extensions: ['.js', '.coffee'],
        }),
        getBabelPlugin({ useBuiltIns }),
        terser(),
      ],
    },
  ],
  []
);

// Only output unminified browser bundle in development mode
if (process.env.NODE_ENV === 'development') {
  configs = [configs[2]];
}

export default configs;
