const spec = (componentName: string) => (
  `import { render, screen } from '@testing-library/react';
import ${componentName} from '.';

test('renders ${componentName}', () => {
  render(<${componentName} />);
});
`
);

export default spec;
