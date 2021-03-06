const spec = (componentName: string) => (
  `import React from 'react';
import { render, screen } from '@testing-library/react';
import ${componentName} from '.';

test('renders ${componentName}', () => {
  render(<${componentName} />);
});
`
);

export default spec;
