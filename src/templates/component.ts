const component = (componentName: string) => (
  `import React from 'react';
import { Container } from './styles';

const ${componentName} = (): JSX.Element => {
  return <Container />;
};

export default ${componentName};
`
);

export default component;
