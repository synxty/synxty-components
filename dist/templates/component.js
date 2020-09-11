"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component = (componentName) => (`import { Container } from './styles';

const ${componentName} = (): JSX.Element => {
  return (
    <Container />
  );
};

export default ${componentName};
`);
exports.default = component;
//# sourceMappingURL=component.js.map