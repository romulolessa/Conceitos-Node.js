import { configure } from 'jest';

// use ES modules
export default () => {
  configure({
    extensionsToTreatAsEsm: ['.js', '.mjs'],
  });
};

jest.setTimeout(400);