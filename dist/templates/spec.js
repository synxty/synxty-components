"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spec = (componentName) => (`import { render, screen } from '@testing-library/react';
import ${componentName} from '.';

test('renders ${componentName}', () => {
  render(<${componentName} />);
});
`);
exports.default = spec;
//# sourceMappingURL=spec.js.map